import { GuildSchema } from "#database";
import { formatedChannelMention, icon } from "#functions";
import { settings } from "#settings";
import { brBuilder, createEmbed, createRow } from "@magicyan/discord";
import { ChannelSelectMenuBuilder, StringSelectMenuBuilder, StringSelectMenuComponentData } from "discord.js";
import { settingsNav } from "./nav.js";

export const settingsChannelsSelectOptions: StringSelectMenuComponentData["options"] = [
    { emoji: "🌍", label: "Global", value: "global", description: "Canal global",  },
    { emoji: "📢", label: "Anúncios", value: "announcement", description: "Canal de novidades" },
    { emoji: "💵", label: "Banco", value: "bank", description: "Banco da Zunder" },
    { emoji: icon("book"), label: "Termos", value: "terms", description: "Canal de regras do servidor",  },
    
    { emoji: "💬", label: "Geral", value: "general", description: "Canal de bate papo geral",  },
    
    { emoji: "🧰", label: "Gerenciamento", value: "management", description: "Canal destinado a gerenciar sistemas" },
    { emoji: "📋", label: "Registros", value: "records", description: "Canal de registros de ações e eventos no servidor" },
    
    { emoji: "📃", label: "Logs", value: "logs", description: "Canal de logs mais detalhados" },
    { emoji: "📋", label: "Auditoria", value: "audit", description: "Onde fica registrado as atividades dos membros" },
];

export function settingsChannelsMenu(guildData: GuildSchema){
    const channels = (guildData.channels ?? {}) as Record<string, { id: string }>;

    const display = settingsChannelsSelectOptions.map(({ label, emoji, value }) => 
        `- ${emoji} ${label}: ${formatedChannelMention(channels[value]?.id, "`Não definido`")}` 
    );

    const embeds = createEmbed({
        color: settings.colors.primary,
        description: brBuilder(
            "# Configurar canais",
            display
        ),
    }).toArray();

    const selectRow = createRow(
        new StringSelectMenuBuilder({
            customId: "menu/settings/channels",
            placeholder: "Selecione o canal que deseja configurar",
            options: settingsChannelsSelectOptions
        })
    );

    const navRow = createRow(settingsNav.main);

    return { ephemeral, embeds, components: [selectRow, navRow] };
}
export function settingsChannelMenu(guildData: GuildSchema, selected: string){
    const channels = (guildData.channels ?? {}) as Record<string, { id: string }>;

    const { label, emoji } = settingsChannelsSelectOptions.find(({ value }) => value === selected)!;

    const embeds = createEmbed({
        color: settings.colors.warning,
        description: brBuilder(
            `Alterar o canal ${emoji} ${label}`,
            `Atual: ${formatedChannelMention(channels[selected]?.id, "`Não definido`")}`
        ),
    }).toArray();

    const selectRow = createRow(
        new ChannelSelectMenuBuilder({
            customId: `menu/settings/channel/${selected}`,
            placeholder: "Selecione o canal que deseja definir",
        })
    );

    const navRow = createRow(settingsNav.main, settingsNav.previous("channels"));

    return { ephemeral, embeds, components: [selectRow, navRow] };  
}