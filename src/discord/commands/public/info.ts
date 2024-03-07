import { Command } from "#base";
import { createRow } from "@magicyan/discord";
import { ApplicationCommandType, ButtonBuilder, ButtonStyle } from "discord.js";

new Command({
	name: "informações",
	description: "Comando de informações",
	dmPermission: false,
	type: ApplicationCommandType.ChatInput,
	async run(interaction){

		const row = createRow(
			new ButtonBuilder({
				customId: `remind/${new Date().toISOString()}`,
				label: "Ping",
				style: ButtonStyle.Success
			})
		);

		await interaction.reply({ ephemeral, embeds, content: "pong", components: [row] });

	}
});