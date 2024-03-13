import { settings } from "#settings";
import { EmbedBuilderPlus, createEmbed } from "@magicyan/discord";
import { AttachmentBuilder } from "discord.js";

type EmbedPresetColor = keyof typeof settings.colors;

export function embedChat(color: EmbedPresetColor, text: string){
    return createEmbed({ color: settings.colors[color], description: text });   
}

export function getEmbedFiles(embed: EmbedBuilderPlus, files: AttachmentBuilder[] = []){
    const cdnUrl = "https://cdn.discordapp.com/ephemeral-attachments/";

    if (embed.data.thumbnail?.url.startsWith(cdnUrl)){
        files.push(new AttachmentBuilder(embed.data.thumbnail.url, { name: "thumbnail.png" }));
        embed.setThumbnail("attachment://thumbnail.png");
    } else {
        const index = files.findIndex(f => f.attachment.toString().includes("thumbnail.png"));
        if (index !== -1) files.splice(index, 1);
    }
    if (embed.data.image?.url.startsWith(cdnUrl)){
        files.push(new AttachmentBuilder(embed.data.image.url, { name: "image.png" }));
        embed.setImage("attachment://image.png");
    } else {
        const index = files.findIndex(f => f.attachment.toString().includes("image.png"));
        if (index !== -1) files.splice(index, 1);
    }
    return files;
}