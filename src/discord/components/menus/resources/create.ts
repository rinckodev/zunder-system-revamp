import { Component, Modal } from "#base";
import { db } from "#database";
import { embedChat, getEmbedFiles, icon } from "#functions";
import { menus } from "#menus";
import { settings } from "#settings";
import { createEmbed, createEmbedAuthor, createLinkButton, createModalInput, createRow, findChannel } from "@magicyan/discord";
import { confirm } from "@magicyan/discord-ui";
import { ButtonBuilder, ButtonStyle, ComponentType, Embed, StringSelectMenuBuilder, TextInputStyle, codeBlock } from "discord.js";

new Component({
    customId: "resources/create/:menu",
    type: ComponentType.Button, cache: "cached",
    async run(interaction, { menu }) {
        const { member, guild, message: { embeds: [resourceEmbed] } } = interaction;
        
        switch(menu){
            case "information":{
                interaction.showModal({
                    customId: "resources/create/information",
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
            case "category":{
                await interaction.deferUpdate();

                const guildData = await db.guilds.get(guild.id);
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
                const { title, description, url, category: categoryId, thumbnail, banner } = getResourceInfo(resourceEmbed);
                
                const guildData = await db.guilds.get(guild.id);
                const categories = guildData.resources?.categories!;
                const category = categories.find(c => c.id === categoryId);
                const channel = findChannel(guild).byId(category?.channel.id??"");
                
                if (!channel){
                    const embed = embedChat("danger", "O canal da categoria escolhida não está definido!");
                    interaction.followUp({ ephemeral, embeds: [embed] });
                    return;
                }
                
                const embedFinal = createEmbed({
                    color: settings.colors.primary,
                    author: createEmbedAuthor({ user: member.user }),
                    title, description, url, thumbnail, image: banner,
                    fields: [
                        { name: "Autor", value: member.toString() }
                    ]
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
                        .then(message => {
                            const embed = embedChat("success", `${icon("check")} Recurso enviado com sucesso! Confira: ${message.url}`);
                            interaction.editReply({ embeds: [embed] });
                        
                            message.react("👍");
                            message.react("👎");
                        })
                        .catch(err => {
                            const embed = embedChat("danger", `${icon("cancel")} Não foi possível enviar o recurso! ${codeBlock(err)}`);
                            interaction.editReply({ embeds: [embed] });
                        });
                    },
                });
                return;
            }
        }
    },
});

new Modal({
    customId: "resources/create/:menu",
    cache: "cached", isFromMessage: true,
    async run(interaction, { menu }) {
        const { member, message: { embeds: [resourceEmbed] }, fields } = interaction;
        
        switch(menu){
            case "information":{
                const title = fields.getTextInputValue("title/input");
                const description = fields.getTextInputValue("description/input");
                const url = fields.getTextInputValue("url/input");

                const { thumbnail, banner, category } = getResourceInfo(resourceEmbed);

                interaction.update(menus.resources.create(member, {
                    title, description, url, 
                    thumbnail, banner, category
                }))
                .catch(async err => {
                    await interaction.deferUpdate();
                    const embed = embedChat("danger", `${icon("cancel")} Não foi possível editar informações! ${codeBlock(err)}`);
                    interaction.followUp({ ephemeral, embeds: [embed] });
                });
            }
        }
    },
});

new Component({
    customId: "resources/create/:menu",
    type: ComponentType.StringSelect, cache: "cached",
    async run(interaction, { menu }) {
        const { member, message: { embeds: [resourceEmbed] }, values: [selected] } = interaction;

        switch(menu){
            case "category":{
                interaction.update(menus.resources.create(member, {
                    ...getResourceInfo(resourceEmbed),
                    category: selected
                }));
                return;
            }
        }
    },
});

function getResourceInfo(embed: Embed){
    const isCategoryDefined = new RegExp(/^!.*!$/);
    
    const { value } = embed.fields[0];

    return {
        title: embed.data.title,
        description: embed.data.description,
        url: embed.data.url,
        banner: embed.data.image?.url,
        thumbnail: embed.data.thumbnail?.url,
        category: isCategoryDefined.test(value) ? undefined : value 
    };
}