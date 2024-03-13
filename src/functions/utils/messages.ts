import { toNull } from "@magicyan/discord";
import { Message } from "discord.js";

export function deleteMessage(message: Message, time: number){
    return setTimeout(() => message.delete().catch(toNull), time);
}

interface MessageInformation { 
    messageId: string,
    channelId: string,
    guildId: string 
}
export function resolveMessageUrl(url: string): Partial<MessageInformation> {
    const [messageId, channelId, guildId] = url.split("/").reverse();
    return { messageId, channelId, guildId };
}