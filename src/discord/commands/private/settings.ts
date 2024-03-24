import { Command } from "#base";
import { embedChat, icon } from "#functions";
import { menus } from "#menus";
import { settings } from "#settings";
import { brBuilder, createEmbed, notFound } from "@magicyan/discord";
import { ApplicationCommandOptionType, ApplicationCommandType, ChannelType, inlineCode, roleMention } from "discord.js";

new Command({
    name: "settings",
    nameLocalizations: { "pt-BR": "configurações" },
    description: "Settings panel",
    descriptionLocalizations: { "pt-BR": "Painel de configurações." },
    dmPermission: false,
    defaultMemberPermissions: ["Administrator"],
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: "panel",
            nameLocalizations: { "pt-BR": "painel" },
            description: "Settings panel",
            descriptionLocalizations: { "pt-BR": "Painel de configurações" },
            type: ApplicationCommandOptionType.SubcommandGroup,
            options: [
                {
                    name: "show",
                    nameLocalizations: { "pt-BR": "exibir" },
                    description: "Exibir o painel de configurações",
                    descriptionLocalizations: { "pt-BR": "Show settings panel" },
                    type: ApplicationCommandOptionType.Subcommand,
                }
            ]
        },
        {
            name: "resources",
            nameLocalizations: { "pt-BR": "recursos" },
            description: "Resources settings (temp)",
            descriptionLocalizations: { "pt-BR": "Configurações de recursos (temp)" },
            type: ApplicationCommandOptionType.SubcommandGroup,
            options: [
                {
                    name: "list",
                    nameLocalizations: { "pt-BR": "listar" },
                    description: "List resource categories",
                    descriptionLocalizations: { "pt-BR": "Lista as categorias de recurso" },
                    type: ApplicationCommandOptionType.Subcommand,
                },
                {
                    name: "create",
                    nameLocalizations: { "pt-BR": "criar" },
                    description: "Create a new resource category",
                    descriptionLocalizations: { "pt-BR": "Cria uma nova categoria de recurso" },
                    type: ApplicationCommandOptionType.Subcommand,
                    options: [
                        {
                            name: "id",
                            description: "Category id",
                            descriptionLocalizations: { "pt-BR": "Id da categoria" },
                            type: ApplicationCommandOptionType.String,
                            required,
                        },
                        {
                            name: "title",
                            nameLocalizations: { "pt-BR": "título" },
                            description: "Category title",
                            descriptionLocalizations: { "pt-BR": "Título da categoria" },
                            type: ApplicationCommandOptionType.String,
                            required,
                        },
                        {
                            name: "description",
                            nameLocalizations: { "pt-BR": "descrição" },
                            description: "Category description",
                            descriptionLocalizations: { "pt-BR": "Descrição da categoria" },
                            type: ApplicationCommandOptionType.String,
                            required,
                        },
                        {
                            name: "channel",
                            nameLocalizations: { "pt-BR": "canal" },
                            description: "Category channel",
                            descriptionLocalizations: { "pt-BR": "Canal da categoria" },
                            type: ApplicationCommandOptionType.Channel,
                            channelTypes: [ChannelType.GuildText],
                            required,
                        },
                        {
                            name: "emoji",
                            description: "Category emoji",
                            descriptionLocalizations: { "pt-BR": "Emoji da categoria" },
                            type: ApplicationCommandOptionType.String,
                        },
                        {
                            name: "role",
                            nameLocalizations: { "pt-BR": "cargo" },
                            description: "Category role",
                            descriptionLocalizations: { "pt-BR": "Cargo da categoria" },
                            type: ApplicationCommandOptionType.Role,                            
                        },
                        {
                            name: "tags",
                            description: "Category roles (separate by comma)",
                            descriptionLocalizations: { "pt-BR": "Tags da categoria (separe por vírgula)" },
                            type: ApplicationCommandOptionType.String,                            
                        },
                    ]
                },
                {
                    name: "edit",
                    nameLocalizations: { "pt-BR": "editar" },
                    description: "Edita uma categoria de recurso",
                    type: ApplicationCommandOptionType.Subcommand,
                    options: [
                        {
                            name: "id",
                            description: "Category id",
                            descriptionLocalizations: { "pt-BR": "Id da categoria" },
                            type: ApplicationCommandOptionType.String,
                            required,
                        },
                        {
                            name: "title",
                            nameLocalizations: { "pt-BR": "título" },
                            description: "Category title",
                            descriptionLocalizations: { "pt-BR": "Título da categoria" },
                            type: ApplicationCommandOptionType.String,
                        },
                        {
                            name: "description",
                            nameLocalizations: { "pt-BR": "descrição" },
                            description: "Category description",
                            descriptionLocalizations: { "pt-BR": "Descrição da categoria" },
                            type: ApplicationCommandOptionType.String,
                        },
                        {
                            name: "channel",
                            nameLocalizations: { "pt-BR": "canal" },
                            description: "Category channel",
                            descriptionLocalizations: { "pt-BR": "Canal da categoria" },
                            type: ApplicationCommandOptionType.Channel,
                            channelTypes: [ChannelType.GuildText],
                        },
                        {
                            name: "emoji",
                            description: "Category emoji",
                            descriptionLocalizations: { "pt-BR": "Emoji da categoria" },
                            type: ApplicationCommandOptionType.String,
                        },
                        {
                            name: "role",
                            nameLocalizations: { "pt-BR": "cargo" },
                            description: "Category role",
                            descriptionLocalizations: { "pt-BR": "Cargo da categoria" },
                            type: ApplicationCommandOptionType.Role,                            
                        },
                        {
                            name: "tags",
                            description: "Category roles (separate by comma)",
                            descriptionLocalizations: { "pt-BR": "Tags da categoria (separe por vírgula)" },
                            type: ApplicationCommandOptionType.String,                       
                        },
                    ]
                },
                {
                    name: "delete",
                    nameLocalizations: { "pt-BR": "deletar" },
                    description: "Delete a resource category",
                    descriptionLocalizations: { "pt-BR": "Deleta uma categoria de recurso" },
                    type: ApplicationCommandOptionType.Subcommand,
                    options: [
                        {
                            name: "id",
                            description: "Category id",
                            descriptionLocalizations: { "pt-BR": "Id da categoria" },
                            type: ApplicationCommandOptionType.String,
                            required,
                        },
                    ]
                },
            ]
        },
    ],
    async run(interaction){
        const { options, guild, client } = interaction;
        const group = options.getSubcommandGroup(true);
        const subcommand = options.getSubcommand(true);
        switch(group){
            case "panel":{
                interaction.reply(menus.settings.main(guild));
                return;
            }
            case "resources":{
                await interaction.deferReply({ ephemeral });

                const guildData = client.mainGuildData;
                const categories = guildData.resources?.categories!;
                const length = categories.length;

                switch(subcommand){
                    case "list":{
                        const display = categories.map(
                            ({ id, title, emoji, channel, role, tags }) => ({
                                name: id,
                                value: brBuilder(
                                    `${emoji} ${title} ${channel.url} ${role ? roleMention(role.id) : ""}`,
                                    `> Tags ${tags.length >= 1 ? tags.map(inlineCode).join(" ") : "Sem tags"}`
                                ),
                            })
                        );

                        const embed = createEmbed({
                            color: settings.colors.warning,
                            description: brBuilder(
                                "# 📂 Categorias de recurso",
                                `${length < 1 ? "Nenhuma categoria" : `Categorias: \`${length}\``}`,
                            ),
                            fields: display
                        });
                        interaction.editReply({ embeds: [embed] });
                        return;
                    }
                    case "create":{
                        const id = options.getString("id", true);
                        
                        if (categories.some(c => c.id === id)){
                            const embed = embedChat("danger", `${icon("cancel")} Já existe uma categoria de recurso com o id \`${id}\``);
                            interaction.editReply({ embeds: [embed] });
                            return;
                        }
                        
                        const title = options.getString("title", true);
                        const description = options.getString("description", true);
                        const emoji = notFound(options.getString("emoji"));
                        const channel = options.getChannel("channel", true);
                        const role = options.getRole("role");
                        const rawTags = options.getString("tags")??"";
                        const tags = rawTags.split(",").map(t => t.trim()).filter(Boolean);

                        categories.push({
                            id, title, description,
                            emoji, channel: { id: channel.id, url: channel.url },
                            role: role ? { id: role.id } : undefined,
                            tags: tags.length >= 1 ? tags.slice(0, 25) : undefined
                        });

                        await guildData.$set("resources.categories", categories).save();

                        const embed = embedChat("success", `${icon("check")} Categoria de recurso criada com sucesso!`);
                        interaction.editReply({ embeds: [embed] });
                        return;
                    }
                    case "edit":{
                        const id = options.getString("id", true);
                        
                        const category = categories.find(c => c.id === id); 

                        if (!category){
                            const embed = embedChat("danger", `${icon("cancel")} Não foi encontrada uma categoria de recurso com o id \`${id}\``);
                            interaction.editReply({ embeds: [embed] });
                            return;
                        }
                        
                        const title = options.getString("title");
                        const description = options.getString("description");
                        const emoji = notFound(options.getString("emoji"));
                        const channel = options.getChannel("channel");
                        const role = options.getRole("role");
                        const rawTags = options.getString("tags")??"";
                        const tags = rawTags.split(",").map(t => t.trim()).filter(Boolean);

                        const index = categories.findIndex(c => c.id == id);

                        if (title) categories[index].title = title;
                        if (description) categories[index].description = description;
                        if (emoji) categories[index].emoji = emoji;
                        if (channel) categories[index].channel = { id: channel.id, url: channel.url };
                        if (role) categories[index].role = { id: role.id };
                        if (tags.length >= 1) categories[index].tags = tags.slice(0, 25);

                        await guildData.$set("resources.categories", categories).save();

                        const embed = embedChat("success", `${icon("check")} Categoria de recurso editada com sucesso!`);
                        interaction.editReply({ embeds: [embed] });
                        return;
                    }
                    case "delete":{
                        const id = options.getString("id", true);
                        if (!categories.some(c => c.id !== id)){
                            const embed = embedChat("danger", `${icon("cancel")} Não foi encontrada uma categoria de recurso com o id \`${id}\``);
                            interaction.editReply({ embeds: [embed] });
                            return;
                        }

                        const updatedCategories = categories.filter(c => c.id !== id);

                        await guildData.$set("resources.categories", updatedCategories).save();
                        
                        const embed = embedChat("success", `${icon("check")} Categoria de recurso deletada com sucesso!`);
                        interaction.editReply({ embeds: [embed] });
                        return;
                    }
                }

                return;
            }
        }
    }
});