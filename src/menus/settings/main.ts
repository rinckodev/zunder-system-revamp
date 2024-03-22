import { icon } from "#functions";
import { settings } from "#settings";
import { brBuilder, createEmbed, createRow } from "@magicyan/discord";
import { ButtonBuilder, ButtonStyle, Guild, userMention } from "discord.js";

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
        new ButtonBuilder({
            customId: "menu/settings/channels",
            label: "Canais", emoji: "🔊",
            style: ButtonStyle.Secondary 
        }),
        new ButtonBuilder({
            customId: "menu/settings/ranks",
            label: "Ranks", emoji: icon("account"),
            style: ButtonStyle.Secondary 
        })
    );

    return { ephemeral, embeds, components: [row] };
}