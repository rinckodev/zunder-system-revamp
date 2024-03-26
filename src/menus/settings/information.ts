import { GuildSchema } from "#database";
import { icon, isNumeric } from "#functions";
import { settings } from "#settings";
import { brBuilder, createEmbed, createRow, limitText } from "@magicyan/discord";
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, formatEmoji, StringSelectMenuBuilder } from "discord.js";
import { settingsNav } from "./nav.js";

function displayEmoji(emoji?: null | string){
    if (!emoji) emoji = "📃";
    return isNumeric(emoji) ? formatEmoji(emoji) : emoji; 
}

export function settingsInformationsMenu(guildData: GuildSchema){
    const { information } = guildData;

    const embed = createEmbed({
        color: settings.colors.info,
        description: brBuilder(
            `# ${icon("gear")} Configurar informações`,
            "",
            information.length >= 1 
            ? `${information.length} informações configuradas`
            : "Nenhuma informação configurada",
            information.map((info, index) => 
                `- ${index} ${displayEmoji(info.emoji)} ${info.title}`
            )
        )
    });

    const components: (ActionRowBuilder<ButtonBuilder | StringSelectMenuBuilder>)[]  = [];

    if (information.length >= 1) {
        const selectRow = createRow(
            new StringSelectMenuBuilder({
                customId: "menu/settings/information/select",
                placeholder: "Selecione a informação que deseja",
                options: information.map((info, index) => ({
                    label: info.title,
                    value: index.toString(),
                    description: limitText(info.description, 80, "..."),
                    emoji: info.emoji??"📃"
                }))
            })
        );
        components.push(selectRow);
    }

    components.push(
        createRow(
            settingsNav.main,
            new ButtonBuilder({
                customId: "menu/settings/information/add/none", 
                label: "Adicionar",
                emoji: icon("plus"), 
                style: ButtonStyle.Success,
                disabled: information.length >= 25
            })
        )
    );

    return { ephemeral, embeds: [embed], components };
}

export function settingsInformationMenu(guildData: GuildSchema, selected: string){
    const { information } = guildData;

    const info = information[+selected];
    
    const embed = createEmbed({
        color: settings.colors.info,
        description: brBuilder(
            `# ${icon("gear")} Configurar informação`,
            "",
            `- ${displayEmoji(info.emoji)} ${info.title}`,
            `>>> ${limitText(info.description, 2800, "...")}`
        )
    });

    const row = createRow(
        new ButtonBuilder({
            customId: `menu/settings/information/edit/${selected}`, 
            label: "Editar",
            emoji: icon("pencil"), 
            style: ButtonStyle.Primary,
            disabled: information.length >= 25
        }),
        new ButtonBuilder({
            customId: `menu/settings/information/remove/${selected}`, 
            label: "Remover",
            emoji: icon("trash"), 
            style: ButtonStyle.Danger,
            disabled: information.length >= 25
        })
    );
    const navRow = createRow(
        settingsNav.previous("information"),
        settingsNav.main
    );

    return { ephemeral, embeds: [embed], components:[row, navRow] };
}