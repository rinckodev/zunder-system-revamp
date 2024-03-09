import { GuildSchema } from "#database";
import { icon, formatedRoleMention } from "#functions";
import { createEmbed, brBuilder, createEmbedFooter, createRow } from "@magicyan/discord";
import { Guild, RoleSelectMenuBuilder, StringSelectMenuBuilder } from "discord.js";
import { settingsNav } from "../nav.js";
import { settings } from "#settings";

export const settingsRanksLevelsSelectOptions = [
    { emoji: icon("rank_leader"), label: "Líder", value: "5" },
    { emoji: icon("rank_admin"), label: "Admin", value: "4" },
    { emoji: icon("rank_mod"), label: "Mod", value: "3" },
    { emoji: icon("rank_support"), label: "Ajudante", value: "2" },
    { emoji: icon("account"), label: "Membro", value: "1" },
] as const;


export function settingsRanksLevelsMenu(guild: Guild, guildData?: GuildSchema){
    const ranks = guildData?.ranks;
    
    const display = settingsRanksLevelsSelectOptions.map(({ label, emoji, value }) => 
        `- ${emoji} ${label}: ${formatedRoleMention(ranks?.levels?.[value]?.id, "`Não definido`")}` 
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
            customId: "menu/settings/ranks/levels",
            placeholder: "Selecione o nível de rank que deseja definir",
            options: Array.from(settingsRanksLevelsSelectOptions)
        })
    );

    const controlRow = createRow(
        settingsNav.main,
        settingsNav.previous("ranks")
    );

    return { embeds: [embed], components: [row, controlRow] };
}

export function settingsRanksLevelMenu(guildData: GuildSchema, selected: string){
    const levels = (guildData.ranks?.levels ?? {});
    type Levels = keyof NonNullable<NonNullable<GuildSchema["ranks"]>["levels"]>

    const { label, emoji } = settingsRanksLevelsSelectOptions.find(({ value }) => value === selected)!;

    const embeds = createEmbed({
        color: settings.colors.warning,
        description: brBuilder(
            `Alterar o cargo ${emoji} ${label}`,
            `Atual: ${formatedRoleMention(levels[selected as Levels]?.id, "`Não definido`")}`
        ),
    }).toArray();

    const selectRow = createRow(
        new RoleSelectMenuBuilder({
            customId: `menu/settings/ranks/levels,${selected}`,
            placeholder: "Selecione o cargo que deseja definir",
        })
    );

    const navRow = createRow(settingsNav.main, settingsNav.previous("ranks"));

    return { ephemeral, embeds, components: [selectRow, navRow] };  
}