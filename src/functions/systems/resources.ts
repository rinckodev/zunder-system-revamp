import { Embed, Guild, Message, TextChannel } from "discord.js";
import { resolveMessageUrl } from "../utils/messages.js";
import { EmbedPropery, findChannel, toNull } from "@magicyan/discord";
import { icon } from "../utils/emojis.js";

type ResourceInfoMode = "create" | "edit";

type ResourceInfo<M extends ResourceInfoMode> = {
    title: M extends "edit" ? string : string | undefined;
    description: M extends "edit" ? string : string | undefined;
    url: M extends "edit" ? string : string | undefined;
    category: M extends "edit" ? string : string | undefined;
    
    banner?: string;
    thumbnail?: string;
    tags?: string[];
    
    authorId: string;
    messageId: M extends "edit" ? string : undefined;
    author: M extends "edit" ? EmbedPropery<"author"> : undefined;
}
export function getResourceInfo<M extends ResourceInfoMode = "create">(embed: Embed): ResourceInfo<M> {
    
    const author = embed.data.author!;
    const [categoryId, authorId, messageId] = embed.data.footer!.text.split("/");
    const tagsField = embed.data?.fields?.find(f => f.name === "Tags") ?? { value: "" };

    const tags = tagsField.value.split(",").map(t => t.replaceAll("`", "").trim()).filter(Boolean);

    return {
        title: embed.data.title,
        description: embed.data.description,
        url: embed.data.url,
        banner: embed.data.image?.url,
        thumbnail: embed.data.thumbnail?.url,
        category: categoryId !== "none" ? categoryId : undefined,
        tags: tags.length >= 1 ? tags : undefined,
        authorId, messageId,
        author
    } as ResourceInfo<M>;
}

interface SuccessFindResource {
    success: true;
    channel: TextChannel; 
    message: Message;
    authorId: string; 
    categoryId: string;
    resourceEmbed: Embed;
}
interface FailFindResource {
    success: false;
    error: string;
}
export async function findResource(messageUrl: string, guild: Guild): Promise<SuccessFindResource | FailFindResource> {
                
    const { channelId="", messageId="" } = resolveMessageUrl(messageUrl);
    const channel = findChannel(guild).byId(channelId);

    if (!channel){
        return {
            success: false,
            error: `${icon("cancel")} O canal do recurso não foi encontrado!`
        };
    }
    
    const message = await channel.messages.fetch(messageId).catch(toNull);
    
    if (!message){
        return {
            success: false,
            error: `${icon("cancel")} A mensagem do recurso não foi encontrada!`
        };
    }
    const { embeds: [resourceEmbed] } = message;
    if (!resourceEmbed){
        return {
            success: false,
            error: `${icon("cancel")} A mensagem não contém um embed!`
        };
    }

    const [categoryId, authorId] = (resourceEmbed.data.footer?.text ?? "none/none").split("/");

    if (categoryId === "none" || authorId === "none"){
        return {
            success: false,
            error: `${icon("cancel")} A mensagem não contém um recurso!`
        };
    }
    
    return {
        success: true,
        channel, message,
        authorId, categoryId,
        resourceEmbed
    };
}