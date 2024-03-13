import { Embed } from "discord.js";

export function getResourceInfo(embed: Embed){
    const isCategoryDefined = new RegExp(/^!.*!$/);
    
    const categoryField = embed.data?.fields?.find(f => f.name === "Categoria");
    const tagsField = embed.data?.fields?.find(f => f.name === "Tags") ?? { value: "" };

    const tags = tagsField.value.split(",").map(t => t.replaceAll("`", "").trim()).filter(Boolean);
    const categoryId = categoryField?.value ?? "";

    return {
        title: embed.data.title,
        description: embed.data.description,
        url: embed.data.url,
        banner: embed.data.image?.url,
        thumbnail: embed.data.thumbnail?.url,
        category: isCategoryDefined.test(categoryId) ? undefined : categoryId,
        tags: tags.length >= 1 ? tags : undefined,
    };
}