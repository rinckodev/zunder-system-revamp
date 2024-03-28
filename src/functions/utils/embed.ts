import { settings } from "#settings";
import { EmbedBuilderPlus, createEmbed } from "@magicyan/discord";
import { AttachmentBuilder, InteractionReplyOptions } from "discord.js";

type EmbedPresetColor = keyof typeof settings.colors;

export function embedChat(color: EmbedPresetColor, text: string){
    const embed = createEmbed({ 
        color: settings.colors[color], 
        description: text 
    });
    const options = { ephemeral, embeds: [embed] };
    return { ...options, embed,
        custom(clear: boolean = true, fetch: boolean = true){
            const components = clear ? [] : undefined;
            return { ...options, components, fetchReply: fetch };
        },
    };
}

type ResReturn = InteractionReplyOptions & { embeds: EmbedBuilderPlus[] };
type ResHandleOptions = string | (Omit<ResReturn, "embeds"> & { text: string })
type ResHandle = (text: ResHandleOptions) => ResReturn;
type InteractionRes = Record<EmbedPresetColor, ResHandle>; 

export const res: InteractionRes = Object.create({}, Object.entries(settings.colors).reduce(
    (prev, [key, color]) => ({ ...prev, [key]:{
        enumerable: true,
        value(options: ResHandleOptions){
            const isString = typeof options === "string";
            const description = isString ? options : options.text;
            const rest = isString ? {} : options;
            const embed = createEmbed({ color, description });
            return { ephemeral, embeds: [embed], ...rest };
        }
    }}), {} as PropertyDescriptorMap
));

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

