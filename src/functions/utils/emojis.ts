import { formatEmoji as discordFormatEmoji } from "discord.js";
import { settings } from "#settings";

type EmojiList = typeof settings.emojis;
type EmojiKey = `:a:${keyof EmojiList["animated"]}` | keyof EmojiList["static"]

export function icon(name: EmojiKey){
    const animated = name.startsWith(":a:");
    const id = animated
    ? settings.emojis.animated[name.slice(3, name.length) as keyof EmojiList["animated"]]
    : settings.emojis.static[name as keyof EmojiList["static"]];

    const toString = () => discordFormatEmoji(id, animated);

    return { id, animated, toString };
}