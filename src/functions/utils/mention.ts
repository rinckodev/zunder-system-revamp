import { channelMention, roleMention } from "discord.js";

export function formatedChannelMention(id: string | undefined | null, alt: string = ""){
    return id ? channelMention(id) : alt;
}

export function formatedRoleMention(id: string | undefined | null, alt: string = ""){
    return id ? roleMention(id) : alt;
}