import { Command } from "#base";
import { icon } from "#functions";
import { settings } from "#settings";
import { brBuilder, createEmbed } from "@magicyan/discord";
import { ApplicationCommandType, hyperlink } from "discord.js";

new Command({
	name: "informações",
	description: "📄 Comando de informações",
	dmPermission: false,
	type: ApplicationCommandType.ChatInput,
	async run(interaction){
		const { guild } = interaction;

		const embeds = createEmbed({
			color: settings.colors.azoxo,
			thumbnail: guild.iconURL(),
			description: brBuilder(
				`# ${icon("book")} Informações`,
				"",
				`Bot desenvolvido por ${hyperlink("Rincko Dev", "https://github.com/rinckodev")}`,
			),
			footer: {
				text: guild.name,
				iconURL: guild.iconURL() 
			}
		}).toArray();

		await interaction.reply({ ephemeral, embeds });

	}
});