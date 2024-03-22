import { MemberSchema } from "#database";
import { icon } from "#functions";
import { settings } from "#settings";
import { brBuilder, captalize, createEmbed, createEmbedAuthor, createRow } from "@magicyan/discord";
import { ButtonBuilder, ButtonStyle, GuildMember, formatEmoji } from "discord.js";

export function profileMainMenu(executorId: string, member: GuildMember, memberData: MemberSchema){
    const { rank } = memberData;
    
    const rankLevelIcon = settings.ranks.levels[rank.level].emoji;
    const rankTypeIcon = settings.ranks.types[rank.type].emoji;

    const embed = createEmbed({
        thumbnail: member.displayAvatarURL({ size: 2048 }),
        author: createEmbedAuthor({ user: member.user, prefix: "Perfil de " }),
        color: member.displayColor,
        description: brBuilder(
            `> ${formatEmoji(rankLevelIcon)} ${member.roles.highest} ${member} **@${member.user.username}**`,
            `> 🏷️ Nick: \` ${rank.nick} \``,
            `> Dispositivo: ${captalize(rank.device)}`,
            `> Tipo: ${formatEmoji(rankTypeIcon)} ${captalize(rank.type)}`,
        )
    });

    const row = createRow(
        new ButtonBuilder({
            customId: `profile/refresh/${member.id}`, 
            emoji: "📡", 
            style: ButtonStyle.Success
        }),
        new ButtonBuilder({
            customId: `profile/settings/${member.id}`, 
            emoji: icon("gear"), 
            style: ButtonStyle.Primary,
            disabled: executorId !== member.id
        }),
    );

    return { ephemeral, embeds: [embed], components: [row] }; 
}