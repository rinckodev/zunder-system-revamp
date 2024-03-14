import { icon } from "#functions";
import { settings } from "#settings";
import { brBuilder, createEmbed, createEmbedAuthor, createRow } from "@magicyan/discord";
import { ButtonBuilder, ButtonStyle, GuildMember, inlineCode } from "discord.js";

interface ResourcesCreateMenuProps {
    title?: string | null;
    description?: string | null;
    url?: string | null;
    thumbnail?: string | null;
    banner?: string | null;
    category?: string;
    tags?: string[];
}
export function resourcesCreateMenu(member: GuildMember, props: ResourcesCreateMenuProps){
    const { category, tags=[], ...info } = props;
    const { title, description, url, banner, thumbnail } = info;
    
    const ready = Boolean(category && title && description && url);

    const missing: string[] = [];
    if (!title) missing.push(inlineCode(" título "));
    if (!description) missing.push(inlineCode(" descrição "));
    if (!url) missing.push(inlineCode(" url "));
    if (!category) missing.push(inlineCode(" categoria "));

    const color = settings.colors[ready ? "success" : "warning"];

    const embed = createEmbed({
        author: createEmbedAuthor({ user: member.user }),
        color, title, description, url,
        thumbnail: thumbnail,
        image: banner,
        footer: {
            text: `${category??"none"}/${member.id}`
        },
    });

    if (tags.length >= 1) embed.addFields({ 
        name: "Tags", value: tags.map(inlineCode).join(", ")
    }); 

    const embedInfo = createEmbed({
        color, description: ready 
        ? `${icon("check")} O recurso está pronto para ser enviado!`
        : brBuilder(
            `${icon("block")} O recurso não pode ser enviado ainda!`,
            `${missing.length > 1 ? "Estão" : "Está"} faltando: ${missing.join(", ")}`,
        ),
    });


    const row = createRow(
        new ButtonBuilder({
            customId: "resources/create/information",
            label: "Editar informações",
            style: ButtonStyle.Primary,
            emoji: icon("pencil")
        }),
        new ButtonBuilder({
            customId: "resources/create/category",
            label: "Editar categoria",
            style: ButtonStyle.Primary,
            emoji: icon("favorite")
        }),
        new ButtonBuilder({
            customId: "resources/create/tags",
            label: "Editar tags",
            style: ButtonStyle.Primary,
            emoji: "🏷️",
            disabled: !category,
        }),
    );

    const submitRow = createRow(
        new ButtonBuilder({
            customId: "resources/create/submit",
            label: "Enviar",
            style: ButtonStyle.Success,
            emoji: icon("next"),
            disabled: !ready,
        }),
    );

    return { ephemeral, embeds: [embed, embedInfo], components: [row, submitRow] };
}