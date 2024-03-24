import { settings } from "#settings";
import { EmbedPropery, brBuilder, createEmbed, findChannel } from "@magicyan/discord";
import { Attachment, AttachmentBuilder, Client, Guild, GuildMember, User } from "discord.js";

interface GuildRecordOptions {
    guild: Guild,
    title: string;
    executor: Client | GuildMember | User
    target: GuildMember | User
    details: string;
    thumbnail?: EmbedPropery<"thumbnail">;
    author?: EmbedPropery<"author">;
    color?: keyof typeof settings.colors;
    files?: Attachment[] | AttachmentBuilder[]
}
export async function sendGuildRecord(options: GuildRecordOptions){
    const { guild, thumbnail, author, details, executor, color="primary", files, target, title } = options;
    const { channels } = guild.client.mainGuildData;

    const channel = findChannel(guild).byId(channels.records?.id ?? "");
    if (!channel) return false;

    const footerText = "Administração Zunder";

    const embeds = createEmbed({
        thumbnail, author,
        color: settings.colors[color],
        description: brBuilder(
            `### ${title}`,
            target instanceof GuildMember 
            ? `> ${target?.roles.highest} ${target} **@${target?.user.username}**`
            : `> ${target} **@${target?.username}**`,
            "",
            details,
        ),
        timestamp: new Date(),
        footer: executor instanceof Client
        ? { text: brBuilder("Pelo sistema", footerText), iconURL: executor.user?.displayAvatarURL() }
        : { text: brBuilder(`Por ${executor.displayName}`, footerText), iconURL: executor.displayAvatarURL() },
    }).toArray();

    const message = await channel.send({ embeds, files });
    
    return Boolean(message);
}