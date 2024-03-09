import { icon } from "#functions";
import { settings } from "#settings";
import { brBuilder, createEmbed, createEmbedFooter, createRow } from "@magicyan/discord";
import { Guild, StringSelectMenuBuilder } from "discord.js";
import { settingsNav } from "../nav.js";

export function settingsRanksMenu(guild: Guild){
    const embed = createEmbed({
        color: settings.colors.primary,
        description: brBuilder(
            `## ${icon("account")} Configurar ranks`,
            "",
            "- Definir cargos de cada nível",
            "- Definir cargos de cada tipo",
        ),
        footer: createEmbedFooter({
            text: "Painel de configurações",
            iconURL: guild.iconURL()
        })
    });

    const row = createRow(
        new StringSelectMenuBuilder({
            customId: "menu/settings/ranks",
            placeholder: "Selecione o que deseja configurar",
            options: [
                { label: "Níveis", value: "levels", description: "Definir cargos de cada nível" },
                { label: "Tipos", value: "types", description: "Definir cargos de cada tipo" },
            ]
        })
    );

    const controlRow = createRow(settingsNav.main);

    return { embeds: [embed], components: [row, controlRow] };
}