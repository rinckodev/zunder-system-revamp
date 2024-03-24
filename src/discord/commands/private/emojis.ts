import { Command } from "#base";
import { settings } from "#settings";
import { brBuilder, createEmbed, findEmoji } from "@magicyan/discord";
import { ApplicationCommandOptionType, ApplicationCommandType, AttachmentBuilder, formatEmoji, inlineCode } from "discord.js";

new Command({
    name: "emojis",
    description: "Comando de emojis",
    dmPermission: false,
    type: ApplicationCommandType.ChatInput,
    defaultMemberPermissions: ["Administrator"],
    global: true,
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
        {
            name: "verificar",
            description: "Verifica os emojis do arquivo de configurações",
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
            case "verificar":{
                const check = (list: Record<string, string>) => {
                    return Object.entries(list).map(([name, id]) => {
                        const emoji = findEmoji(client).byId(id);
                        return `- ${emoji ? `✅ ${formatEmoji(id, emoji?.animated??false)}` : "❌"} ${inlineCode(name)}`;
                    });
                };

                const statics = check(settings.emojis.static);
                const animateds = check(settings.emojis.animated);

                const embed = createEmbed({
                    color: settings.colors.primary,
                    description: brBuilder(
                        "# Lista de emojis",
                        "## Estáticos",
                        statics, 
                        "## Animados",
                        animateds,
                    ),
                });

                interaction.reply({ ephemeral, embeds: [embed] });
                return;
            }
        }
    }
});