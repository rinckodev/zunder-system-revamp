import { findChannel, spaceBuilder } from "@magicyan/discord";
import { Attachment, AttachmentBuilder, Embed, Guild, time } from "discord.js";

interface GuildLogOptions {
    guild: Guild,
    details: string,
    icon?: string,
    files?: AttachmentBuilder[] | Attachment[],
    embeds?: Embed[]
}
export async function sendGuildLog(options: GuildLogOptions){
    const { guild, details, icon, files, embeds } = options;
    const { channels } = guild.client.mainGuildData; 

    const channel = findChannel(guild).byId(channels.logs?.id ?? "");
    if (!channel) return false;

    const text = [time(new Date(), "t"), icon, details].filter(Boolean) as string[];
    
    const message = await channel.send({ content: spaceBuilder(text), files, embeds });
    return Boolean(message);
}