import { Command } from "#base";
import { db } from "#database";
import { embedChat, icon } from "#functions";
import { menus } from "#menus";
import { settings } from "#settings";
import { brBuilder, createEmbed, notFound } from "@magicyan/discord";
import { ApplicationCommandOptionType, ApplicationCommandType, ChannelType, roleMention } from "discord.js";

new Command({
    name: "configurações",
    description: "Painel de configurações.",
    dmPermission: false,
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: "painel",
            description: "painel de configurações",
            type: ApplicationCommandOptionType.SubcommandGroup,
            options: [
                {
                    name: "exibir",
                    description: "Exibir o painel",
                    type: ApplicationCommandOptionType.Subcommand,
                }
            ]
        },
        {
            name: "recursos",
            description: "configurações de recursos",
            type: ApplicationCommandOptionType.SubcommandGroup,
            options: [
                {
                    name: "listar",
                    description: "Lista as categorias de recurso",
                    type: ApplicationCommandOptionType.Subcommand,
                },
                {
                    name: "criar",
                    description: "Cria uma nova categoria de recurso",
                    type: ApplicationCommandOptionType.Subcommand,
                    options: [
                        {
                            name: "id",
                            description: "Id da categoria",
                            type: ApplicationCommandOptionType.String,
                            required,
                        },
                        {
                            name: "title",
                            description: "Título da categoria",
                            type: ApplicationCommandOptionType.String,
                            required,
                        },
                        {
                            name: "description",
                            description: "Descrição da categoria",
                            type: ApplicationCommandOptionType.String,
                            required,
                        },
                        {
                            name: "channel",
                            description: "Canal da categoria",
                            type: ApplicationCommandOptionType.Channel,
                            channelTypes: [ChannelType.GuildText],
                            required,
                        },
                        {
                            name: "emoji",
                            description: "Emoji da categoria",
                            type: ApplicationCommandOptionType.String,
                        },
                        {
                            name: "role",
                            description: "Cargo da categoria",
                            type: ApplicationCommandOptionType.Role,                            
                        },
                    ]
                },
                {
                    name: "editar",
                    description: "Edita uma categoria de recurso",
                    type: ApplicationCommandOptionType.Subcommand,
                    options: [
                        {
                            name: "id",
                            description: "Id da categoria",
                            type: ApplicationCommandOptionType.String,
                            required,
                        },
                        {
                            name: "title",
                            description: "Título da categoria",
                            type: ApplicationCommandOptionType.String,
                        },
                        {
                            name: "description",
                            description: "Descrição da categoria",
                            type: ApplicationCommandOptionType.String,
                        },
                        {
                            name: "channel",
                            description: "Canal da categoria",
                            type: ApplicationCommandOptionType.Channel,
                            channelTypes: [ChannelType.GuildText],
                        },
                        {
                            name: "emoji",
                            description: "Emoji da categoria",
                            type: ApplicationCommandOptionType.String,
                        },
                        {
                            name: "role",
                            description: "Cargo da categoria",
                            type: ApplicationCommandOptionType.Role,                            
                        },
                    ]
                },
                {
                    name: "deletar",
                    description: "Deleta uma categoria de recurso",
                    type: ApplicationCommandOptionType.Subcommand,
                    options: [
                        {
                            name: "id",
                            description: "Id da categoria",
                            type: ApplicationCommandOptionType.String,
                            required,
                        },
                    ]
                },
            ]
        },
    ],
    async run(interaction){
        const { options, guild } = interaction;
        const group = options.getSubcommandGroup(true);
        const subcommand = options.getSubcommand(true);
        switch(group){
            case "painel":{
                interaction.reply(menus.settings.main(guild));
                return;
            }
            case "recursos":{
                await interaction.deferReply({ ephemeral });

                const guildData = await db.guilds.get(guild.id);
                const categories = guildData.resources?.categories!;
                const length = categories.length;
                
                switch(subcommand){
                    case "listar":{
                        const display = categories.map(({ id, title, emoji, channel, role }) => 
                            `- ID: \`${id}\` | ${emoji} ${title} ${channel.url} ${role ? roleMention(role.id) : ""}`
                        );

                        const embed = createEmbed({
                            color: settings.colors.warning,
                            description: brBuilder(
                                "# 📂 Categorias de recurso",
                                `${length < 1 ? "Nenhuma categoria" : `Categorias: \`${length}\``}`,
                                display
                            )
                        });
                        interaction.editReply({ embeds: [embed] });
                        return;
                    }
                    case "criar":{
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

                        categories.push({
                            id, title, description,
                            emoji, channel: { id: channel.id, url: channel.url },
                            role: role ? { id: role.id } : undefined
                        });

                        await guildData.$set("resources.categories", categories).save();

                        const embed = embedChat("success", `${icon("check")} Categoria de recurso criada com sucesso!`);
                        interaction.editReply({ embeds: [embed] });
                        return;
                    }
                    case "editar":{
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

                        const index = categories.findIndex(c => c.id == id);

                        if (title) categories[index].title = title;
                        if (description) categories[index].description = description;
                        if (emoji) categories[index].emoji = emoji;
                        if (channel) categories[index].channel = { id: channel.id, url: channel.url };
                        if (role) categories[index].role = { id: role.id };

                        await guildData.$set("resources.categories", categories).save();

                        const embed = embedChat("success", `${icon("check")} Categoria de recurso editada com sucesso!`);
                        interaction.editReply({ embeds: [embed] });
                        return;
                    }
                    case "deletar":{
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