import { icon } from "#functions";
import { settings } from "#settings";
import { brBuilder, createEmbed, createRow } from "@magicyan/discord";
import { Guild, StringSelectMenuBuilder, userMention } from "discord.js";

export function settingsMainMenu(guild: Guild){
    const embeds = createEmbed({
        color: settings.colors.primary,
        thumbnail: guild.bannerURL() ?? guild.iconURL(),
        description: brBuilder(
            `# ${icon("gear")} Painel de configurações`,
            "",
            `Proprietário: ${userMention(guild.ownerId)}`,
            `Membros: ${guild.memberCount}`,
            `Canais: ${guild.channels.cache.size}`,
        ),
        footer: {
            iconURL: guild.iconURL(),
            text: guild.name
        }
    }).toArray();


    const row = createRow(
        new StringSelectMenuBuilder({
            customId: "menu/settings/main",
            placeholder: "Selecione o que deseja configurar",
            options: [
                { 
                    label: "Canais", value: "channels", 
                    emoji: "🔊", description: "Configurar canais" 
                },
                { 
                    label: "Ranks", value: "ranks", emoji: icon("account"), 
                    description: "Configurar cargos de ranks" 
                }
            ]
        })
    );

    return { ephemeral, embeds, components: [row] };
}