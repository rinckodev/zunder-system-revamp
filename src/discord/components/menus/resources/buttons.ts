import { Component } from "#base";
import { resourceCommand } from "#discord/commands";
import { deleteMessage, embedChat, getEmbedFiles, getResourceInfo, icon } from "#functions";
import { menus } from "#menus";
import { settings } from "#settings";
import { EmbedPropery, createEmbed, createEmbedAuthor, createLinkButton, createModalInput, createRow, findChannel } from "@magicyan/discord";
import { confirm } from "@magicyan/discord-ui";
import { ButtonBuilder, ButtonStyle, ComponentType, StringSelectMenuBuilder, StringSelectMenuComponentData, TextInputStyle, codeBlock, inlineCode, roleMention } from "discord.js";

new Component({
    customId: "resources/:mode/:action",
    type: ComponentType.Button, cache: "cached",
    async run(interaction, { mode, action }) {
        const { member, guild, client, message: { embeds: [resourceEmbed] } } = interaction;
        const guildData = client.mainGuildData;
        
        switch(action){
            case "information":{
                interaction.showModal({
                    customId: `resources/${mode}/information`,
                    title: "Informações do recurso",
                    components: [
                        createModalInput({
                            customId: "title/input",
                            label: "Título",
                            placeholder: "Título do recurso",
                            value: resourceEmbed.data.title,
                            style: TextInputStyle.Short,
                            minLength: 16
                        }),
                        createModalInput({
                            customId: "description/input",
                            label: "Descrição",
                            placeholder: "Descrição do recurso",
                            value: resourceEmbed.data.description,
                            style: TextInputStyle.Paragraph,
                            minLength: 30
                        }),
                        createModalInput({
                            customId: "url/input",
                            label: "Url",
                            placeholder: "Url do recurso",
                            value: resourceEmbed.data.url,
                            style: TextInputStyle.Short,
                        }),
                    ]
                });
                return;
            }
            case "tags":{
                await interaction.deferUpdate();
                
                const { category: categoryId, tags } = getResourceInfo(resourceEmbed);
                
                const categories = guildData.resources?.categories!;
                const category = categories.find(c => c.id === categoryId!)!;
                if (category.tags.length < 1){
                    const embed = embedChat("danger", "A categoria seleciona não tem tags definidas!");
                    interaction.followUp({ ephemeral, embeds: [embed] });
                    return;
                }

                const { embeds:[embed] } = mode == "create" 
                ?  menus.resources.create(member, getResourceInfo(resourceEmbed))
                :  menus.resources.edit(getResourceInfo<"edit">(resourceEmbed));
                
                const options: StringSelectMenuComponentData["options"] = category.tags.map(tag => ({
                    label: tag, value: tag,
                }));
                
                if (tags && tags.length >= 1){
                    options.unshift({
                        label: "Remover tags",
                        value: "remove",
                        emoji: icon("cancel")
                    });
                }
                
                const row = createRow(
                    new StringSelectMenuBuilder({
                        customId: `resources/${mode}/tags`,
                        placeholder: "Selecionar tags",
                        options, minValues: 1, maxValues: options.length,
                    })
                );

                interaction.editReply({ embeds: [embed], components: [row] });
                return;
            }
            case "category":{
                await interaction.deferUpdate();
                
                const categories = guildData.resources?.categories!;

                if (categories.length < 1){
                    const embed = embedChat("danger", "Nenhum categoria definida! Contate a equipe!");
                    interaction.followUp({ ephemeral, embeds: [embed] });
                    return;
                }

                const { embeds:[embed] } = menus.resources.create(member, getResourceInfo(resourceEmbed));
                
                const row = createRow(
                    new StringSelectMenuBuilder({
                        customId: "resources/create/category",
                        placeholder: "Selecionar categoria",
                        options: categories.map(c => ({
                            label: c.title, value: c.id,
                            description: c.description,
                            emoji: c.emoji
                        }))
                    })
                );

                interaction.editReply({ embeds: [embed], components: [row] });
                return;
            }
            case "submit":{
                await interaction.deferUpdate();
                const { title, description, url, category: categoryId, tags, thumbnail, banner } = getResourceInfo(resourceEmbed);
                
                const categories = guildData.resources?.categories!;
                const category = categories.find(c => c.id === categoryId);
                const channel = findChannel(guild).byId(category?.channel.id??"");
                
                if (!category || !channel){
                    const embed = embedChat("danger", "O canal da categoria escolhida não está definido!");
                    interaction.followUp({ ephemeral, embeds: [embed] });
                    return;
                }
                
                const fields: EmbedPropery<"fields"> = [
                    { name: "Categoria", value: `${category.emoji} ${category.title}` }
                ];
                
                if (tags && tags.length >= 1){
                    fields.push({
                        name: "Tags", value: tags.map(inlineCode).join(", ")
                    });
                }

                fields.push({ name: "Autor", value: member.toString() });
                
                const embedFinal = createEmbed({
                    color: settings.colors.primary,
                    author: createEmbedAuthor({ user: member.user }),
                    title, description, url, fields,
                    thumbnail, image: banner,
                    footer: {
                        text: `${category.id}/${member.id}`
                    }
                });

                const resourceRow = createRow(
                    createLinkButton({
                        url: url!, label: "Acessar",
                    }),
                    new ButtonBuilder({
                        customId: `resource/report/${member.id}`, 
                        label: "Reportar",
                        style: ButtonStyle.Danger
                    })
                );

                const embedInfo = embedChat("warning", "Deseja confirmar o envio deste recurso?");

                confirm({
                    components: buttons => [createRow(
                        buttons.confirm, buttons.cancel
                    )],
                    render: components => interaction.editReply({
                        embeds: [embedFinal, embedInfo], components
                    }),
                    async onClick(interaction, isCancel) {
                        if (isCancel){
                            await interaction.update(menus.resources.create(member, getResourceInfo(resourceEmbed)));
                            const embed = embedChat("danger", "Você cancelou essa ação!");
                            interaction.followUp({ ephemeral, embeds: [embed] });
                            return;
                        }

                        const embed = embedChat("warning", `${icon(":a:spinner")} Aguarde...`);
                        await interaction.update({ embeds: [embed], components: [] });

                        channel.send({ embeds: [embedFinal], files: getEmbedFiles(embedFinal), components: [resourceRow] })
                        .then(async message => {
                            const embed = embedChat("success", `${icon("check")} Recurso enviado com sucesso! Confira: ${message.url}`);
                            interaction.editReply({ embeds: [embed] });
                        
                            await message.react("❤️");
                            await message.react("🔥");
                            await message.react("👍");
                            await message.react("👎");

                            if (category.role?.id){
                                deleteMessage(
                                    await message.reply({ 
                                        content: roleMention(category.role.id) 
                                    }), 300
                                );
                            }

                            const now = new Date();
                            const time = 1000 * 60 * 2;
                            now.setMilliseconds(now.getMilliseconds() + time);

                            resourceCommand.store.cooldowns.set(
                                `${guild.id}/${member.id}/create`, now, time
                            );
                        })
                        .catch(err => {
                            const embed = embedChat("danger", `${icon("cancel")} Não foi possível enviar o recurso! ${codeBlock(err)}`);
                            interaction.editReply({ embeds: [embed] });
                        });
                    },
                });
                return;
            }
            case "save":{
                interaction.showModal({
                    customId: `resources/${mode}/save`,
                    title: "Salvar alterações no recurso",
                    components: [
                        createModalInput({
                            customId: "message/input",
                            label: "Mensagem",
                            placeholder: "Insira a url da mensagem do recurso",
                            style: TextInputStyle.Short,
                            minLength: 40
                        })
                    ]
                });
                return;
            }
        }
    },
});