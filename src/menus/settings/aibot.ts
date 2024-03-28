import { GuildSchema } from "#database";
import { icon } from "#functions";
import { settings } from "#settings";
import { brBuilder, createEmbed, createRow } from "@magicyan/discord";
import { ButtonBuilder, ButtonStyle } from "discord.js";
import { settingsNav } from "./nav.js";

export function settingsAIBotMenu(guildData: GuildSchema){
    const aibot = guildData.aibot ?? {};

    const embeds = createEmbed({
        color: settings.colors.primary,
        description: brBuilder(
            `# ${icon("gear")} Configurar IA`,
            "",
            aibot.enabled ? "- 🟢 Habilitado" : "- 🔴 Desabilitado"
        ),
    }).toArray();

    const selectRow = createRow(
        new ButtonBuilder({
            customId: "menu/settings/aibot/toggle",
            label: aibot.enabled ? "Desabilitar" : "Habilitar",
            style: aibot.enabled ? ButtonStyle.Danger : ButtonStyle.Success,
            emoji: aibot.enabled ? icon("cancel") : icon("check"),
        })
    );

    const navRow = createRow(settingsNav.main);

    return { ephemeral, embeds, components: [selectRow, navRow] };
}