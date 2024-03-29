import { Command, Component, Event, Listener, Modal } from "./index.js";
import { CustomItents, CustomPartials } from "@magicyan/discord";
import { Client, ClientOptions, version } from "discord.js";
import { basename, join } from "node:path";
import { log, onError } from "#settings";
import glob from "fast-glob";
import ck from "chalk";
import { db } from "#database";

const foldername = basename(join(getDirname(import.meta), "../../"));

export function createClient(options: Partial<ClientOptions> = {}) {
	const { intents, partials, ...otherOptions } = options;

	const client = new Client({
		intents: intents ?? CustomItents.All,
		partials: partials ?? CustomPartials.All,
		failIfNotExists: false, closeTimeout: 0,
		...otherOptions
	});

	client.start = async function(options) {
		this.once("ready", async (readyClient) => {
			process.on("uncaughtException", async (err) => onError(err, readyClient));
			process.on("unhandledRejection", async (err) => onError(err, readyClient));
			console.log();
			log.success(
				`${ck.green("Bot online")} ${ck.blue.underline("discord.js")} 📦 ${ck.yellow(version)} \n`,
				`${ck.greenBright(`➝ Connected as ${ck.underline(readyClient.user.username)}`)}`
			);
			console.log();

			const mainGuild = client.guilds.cache.get(process.env.MAIN_GUILD_ID);

			const [globalCommands, guildCommands] = Command.commands.partition(c => c.global);

			await mainGuild?.commands.set(Array.from(guildCommands.values()))
			.then(({ size }) => log.success(ck.green(`${size} guild commands registered successfully!`)))
			.catch(log.error);

			readyClient.application.commands.set(Array.from(globalCommands.values()))
			.then(({ size }) => log.success(ck.green(`${size} global commands registered successfully!`)))
			.catch(log.error);

			if (options?.whenReady) options.whenReady(readyClient);
		});
		const patterns = [`./${foldername}/discord/**/*.{ts,js}`, `!./${foldername}/discord/base/*`];
		const paths = await glob(patterns, { absolute: true });

		await Promise.all(paths.map(async path => import(`file://${path}`)));
		Event.register(this); Listener.register(this);
	
		Command.logs(); Component.logs(); Listener.logs(); Modal.logs(); Event.logs();

		Object.defineProperty(client, "mainGuildData", {
			value: await db.guilds.get(process.env.MAIN_GUILD_ID),
			writable: true,
		});

		this.login(process.env.BOT_TOKEN);
	};
	client.on("interactionCreate", (interaction) => {
		if (interaction.isCommand()) Command.onCommand(interaction);
		if (interaction.isAutocomplete()) Command.onAutocomplete(interaction);
		if (interaction.isMessageComponent()) Component.onComponent(interaction);
		if (interaction.isModalSubmit()) Modal.onModal(interaction);
	});
	return client;
}