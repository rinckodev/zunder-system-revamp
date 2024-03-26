import { icon } from "#functions";
import { settings } from "#settings";
import { brBuilder, createEmbed, createRow } from "@magicyan/discord";
import { ButtonBuilder, ButtonStyle, Guild, userMention } from "discord.js";

export function settingsMainMenu(guild: Guild){

    const guildChannels = guild.channels.cache;
    const [voiceChannels, othera] = guildChannels.partition(c => c.isVoiceBased());
    const [textChannels, otherChannels] = othera.partition(c => c.isTextBased());

    const guildMembers = guild.members.cache;
    const [onlineMembers, otherb] = guildMembers.partition(m => m.presence?.status === "online");
    const [dndMembers, otherMembers] = otherb.partition(m => m.presence?.status === "dnd");

    const embeds = createEmbed({
        color: settings.colors.primary,
        thumbnail: guild.bannerURL() ?? guild.iconURL(),
        description: brBuilder(
            `# ${icon("gear")} Painel de configurações`,
            "",
            `👨‍💼 Proprietário: ${userMention(guild.ownerId)}`,
        ),
        fields: [
            {
                name: `Membros ${guild.memberCount}`,
                value: brBuilder(
                    `- 🟢 Membros online: ${onlineMembers.size}`,
                    `- 🔴 Membros ocupados: ${dndMembers.size}`,
                    `- Outros membros: ${otherMembers.size}`,
                ), inline,
            },
            {
                name: `Canais ${guildChannels.size}`,
                value: brBuilder(
                    `> - #️⃣ Canal de texto: ${voiceChannels.size}`,
                    `> - 🔉 Canal de voz: ${textChannels.size}`,
                    `> - Outros canais: ${otherChannels.size}`,
                ), inline,
            }
        ],
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
        }),
        new ButtonBuilder({
            customId: "menu/settings/information",
            label: "Informações", emoji: "📃",
            style: ButtonStyle.Secondary 
        }),
    );

    return { ephemeral, embeds, components: [row] };
}