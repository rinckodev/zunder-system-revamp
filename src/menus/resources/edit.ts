import { icon } from "#functions";
import { settings } from "#settings";
import { createEmbed, createRow, EmbedPropery } from "@magicyan/discord";
import { ButtonBuilder, ButtonStyle, inlineCode } from "discord.js";

interface ResourcesEditMenuProps {
    title: string | null;
    description: string | null;
    url: string | null;
    category: string;
    thumbnail?: string | null;
    banner?: string | null;
    tags?: string[];
    authorId: string;
    messageId: string;
    author: EmbedPropery<"author">
}
export function resourcesEditMenu(props: ResourcesEditMenuProps){
    const { category, authorId, author, messageId, tags=[], ...info } = props;
    const { title, description, url, banner, thumbnail } = info;
    
    const embed = createEmbed({
        author, color: settings.colors.warning,
        title, description, url,
        thumbnail: thumbnail,
        image: banner,
        footer: { text: `${category}/${authorId}/${messageId}` },
    });

    if (tags.length >= 1) embed.addFields({ 
        name: "Tags", value: tags.map(inlineCode).join(", ")
    });

    const row = createRow(
        new ButtonBuilder({
            customId: "resources/edit/information",
            label: "Editar informações",
            style: ButtonStyle.Primary,
            emoji: icon("pencil")
        }),
        new ButtonBuilder({
            customId: "resources/edit/tags",
            label: "Editar tags",
            style: ButtonStyle.Primary,
            emoji: "🏷️",
        }),
    );

    const submitRow = createRow(
        new ButtonBuilder({
            customId: "resources/edit/save",
            label: "Salvar alterações",
            style: ButtonStyle.Success,
            emoji: icon("check"),
        }),
    );

    return { ephemeral, embeds: [embed], components: [row, submitRow] };
}