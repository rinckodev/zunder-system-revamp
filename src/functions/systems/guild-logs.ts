import { db } from "#database";
import { findChannel, spaceBuilder } from "@magicyan/discord";
import { Attachment, AttachmentBuilder, Guild, time } from "discord.js";

interface GuildLogOptions {
    guild: Guild,
    details: string,
    icon?: string,
    files?: AttachmentBuilder[] | Attachment[]
}
export async function sendGuildLog(options: GuildLogOptions){
    const { guild, details, icon, files } = options;
    const { channels={} } = await db.guilds.get(guild.id);

    const channel = findChannel(guild).byId(channels?.logs?.id ?? "");
    if (!channel) return false;

    const text = [time(new Date(), "t"), icon, details].filter(Boolean) as string[];
    
    const message = await channel.send({ content: spaceBuilder(text), files });
    return Boolean(message);
}