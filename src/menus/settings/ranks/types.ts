import { GuildSchema } from "#database";
import { icon, formatedRoleMention } from "#functions";
import { createEmbed, brBuilder, createEmbedFooter, createRow } from "@magicyan/discord";
import { Guild, RoleSelectMenuBuilder, StringSelectMenuBuilder } from "discord.js";
import { settingsNav } from "../nav.js";
import { settings } from "#settings";

export const settingsRanksTypesSelectOptions = [
    { emoji: icon("rank_type_zunder"), label: "Zunder", value: "zunder" },
    { emoji: icon("rank_type_discord"), label: "Discord", value: "discord" },
] as const;


export function settingsRanksTypesMenu(guild: Guild, guildData?: GuildSchema){
    const ranks = guildData?.ranks;
    
    const display = settingsRanksTypesSelectOptions.map(({ label, emoji, value }) => 
        `- ${emoji} ${label}: ${formatedRoleMention(ranks?.types?.[value]?.id, "`Não definido`")}` 
    );

    const embed = createEmbed({
        color: settings.colors.primary,
        description: brBuilder(
            `## ${icon("account")} Cargos dos ranks`,
            ...display
        ),
        footer: createEmbedFooter({
            text: "Painel de configurações",
            iconURL: guild.iconURL()
        })
    });

    const row = createRow(
        new StringSelectMenuBuilder({
            customId: "menu/settings/ranks/types",
            placeholder: "Selecione o tipo de rank que deseja definir",
            options: Array.from(settingsRanksTypesSelectOptions)
        })
    );

    const controlRow = createRow(
        settingsNav.main,
        settingsNav.previous("ranks")
    );

    return { embeds: [embed], components: [row, controlRow] };
}

export function settingsRanksTypeMenu(guildData: GuildSchema, selected: string){
    const types = (guildData.ranks?.types ?? {});
    type Types = keyof NonNullable<NonNullable<GuildSchema["ranks"]>["types"]>

    const { label, emoji } = settingsRanksTypesSelectOptions.find(({ value }) => value === selected)!;

    const embeds = createEmbed({
        color: settings.colors.warning,
        description: brBuilder(
            `Alterar o cargo ${emoji} ${label}`,
            `Atual: ${formatedRoleMention(types[selected as Types]?.id, "`Não definido`")}`
        ),
    }).toArray();

    const selectRow = createRow(
        new RoleSelectMenuBuilder({
            customId: `menu/settings/ranks/types,${selected}`,
            placeholder: "Selecione o cargo que deseja definir",
        })
    );

    const navRow = createRow(settingsNav.main, settingsNav.previous("ranks"));

    return { ephemeral, embeds, components: [selectRow, navRow] };  
}