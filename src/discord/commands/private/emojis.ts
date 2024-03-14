import { Command } from "#base";
import { ApplicationCommandOptionType, ApplicationCommandType, AttachmentBuilder } from "discord.js";

new Command({
    name: "emojis",
    description: "Comando de emojis",
    dmPermission: false,
    type: ApplicationCommandType.ChatInput,
    defaultMemberPermissions: ["Administrator"],
    options: [
        {
            name: "servidor",
            description: "Obter todos os emojis do servidor",
            type: ApplicationCommandOptionType.Subcommand,
        },
        {
            name: "bot",
            description: "Obter todos os emojis do bot",
            type: ApplicationCommandOptionType.Subcommand,
        },
    ],
    async run(interaction){
        const { options, client, guild } = interaction;    

        const subcommand = options.getSubcommand(true);

        const emojis: Record<"static" | "animated", Record<string, string>> = {
            static: {}, animated: {}
        };

        switch(subcommand){
            case "servidor":
            case "bot":{
                const emojisCache = subcommand === "bot"
                ? client.emojis.cache 
                : guild.emojis.cache;

                for(const { id, name, animated } of emojisCache.values()){
                    if (!name) return;
                    emojis[animated ? "animated" : "static"][name] = id;
                }

                const buffer = Buffer.from(JSON.stringify(emojis, null, 2), "utf-8");
                const attachment = new AttachmentBuilder(buffer, { name: "emojis.json" });

                interaction.reply({ ephemeral, files: [attachment] });
                return;
            }
        }
    }
});