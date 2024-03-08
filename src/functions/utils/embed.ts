import { settings } from "#settings";
import { createEmbed } from "@magicyan/discord";

type EmbedPresetColor = keyof typeof settings.colors;

export function embedChat(color: EmbedPresetColor, text: string){
    return createEmbed({ color: settings.colors[color], description: text });   
}