import { toNull } from "@magicyan/discord";
import { Message } from "discord.js";

export function deleteMessage(message: Message, time: number){
    return setTimeout(() => message.delete().catch(toNull), time);
}