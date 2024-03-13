import { Command } from "#base";
import { createEmbed } from "@magicyan/discord";
import { ApplicationCommandType, inlineCode } from "discord.js";

new Command({
    name: "pop",
    description: "Legendary Zunder test command",
    dmPermission: false,
    defaultMemberPermissions: ["Administrator"],
    type: ApplicationCommandType.ChatInput,
    async run(interaction){
        const tags = [
            "📚 Texturas", 
            "🗡️ Pvp", 
            "⚔️ Skywars",
            "🛏️ Bedwars",
            "🪓 Duelos",
            "🔨 Construções",
            "🗺️ Mapas",
            "👕 Skins",
            "⚔️ Mods",
        ];

        const embed = createEmbed({
            fields: [
                { value: tags.map(inlineCode).join(" "), inline },
                { inline },{ inline }
            ]
        });

        interaction.reply({ ephemeral, embeds: [embed] });
    }
});