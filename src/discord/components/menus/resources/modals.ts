import { Modal } from "#base";
import { resourceCommand } from "#discord/commands";
import { getResourceInfo, embedChat, icon, findResource, getEmbedFiles, isUrl } from "#functions";
import { menus } from "#menus";
import { settings } from "#settings";
import { createEmbed, createRow, createLinkButton } from "@magicyan/discord";
import { confirm } from "@magicyan/discord-ui";
import { codeBlock, inlineCode, ButtonBuilder, ButtonStyle } from "discord.js";

new Modal({
    customId: "resources/:mode/:action",
    cache: "cached", isFromMessage: true,
    async run(interaction, { mode, action }) {
        const { member, guild, message: { embeds: [resourceEmbed] }, fields } = interaction;

        switch(action){
            case "information":{
                const url = fields.getTextInputValue("url/input");

                const information = {
                    title: fields.getTextInputValue("title/input"),
                    description: fields.getTextInputValue("description/input"),
                    url: isUrl(url) ? url : undefined
                };

                const updateOptions = mode === "create"
                ? menus.resources.create(member, {
                    ...getResourceInfo(resourceEmbed),
                    ...information
                })
                : menus.resources.edit({ 
                    ...getResourceInfo<"edit">(resourceEmbed),
                    ...information,
                    url: isUrl(url) ? url : getResourceInfo<"edit">(resourceEmbed).url
                });

                await interaction.update(updateOptions)
                .catch(async err => {
                    const embed = embedChat("danger", `${icon("cancel")} Não foi possível editar informações! ${codeBlock(err)}`);
                    interaction.update({ embeds: [embed] });
                });

                if (!isUrl(url)){
                    const embed = embedChat("danger", `${icon("cancel")} A url enviada não é válida!`);
                    interaction.followUp({ ephemeral, embeds: [embed] });
                    return;
                }
                return;
            }
            case "save":{
                await interaction.deferUpdate();

                const messageUrl = fields.getTextInputValue("message/input");

                const result = await findResource(messageUrl, guild);
                if (!result.success){
                    const embed = embedChat("danger", result.error);
                    interaction.followUp({ embeds: [embed] });
                    return;
                }
                const { message, resourceEmbed: oldResourceEmbed } = result;
                const resourceInfo = getResourceInfo<"edit">(resourceEmbed);

                if (message.id !== resourceInfo.messageId){
                    const embed = embedChat("danger", `${icon("cancel")} Parece que você está tentando editar outro recurso`);
                    interaction.followUp({ embeds: [embed] });
                    return;
                }

                const embedFields = oldResourceEmbed.data.fields ?? [];
                const embedFinal = createEmbed({
                    color: settings.colors.primary,
                    ...resourceInfo,
                    image: resourceInfo.banner,
                    fields: embedFields,
                    footer: {
                        text: `${resourceInfo.category}/${resourceInfo.authorId}`
                    }
                });

                if (resourceInfo.tags && resourceInfo.tags.length > 1){
                    const tagsIndex = embedFields.findIndex(f => f.name === "Tags");
                    const field = {
                        name: "Tags",
                        value: resourceInfo.tags.map(inlineCode).join(", "), 
                    };
                    if (tagsIndex !== -1){
                        embedFinal.spliceFields(tagsIndex, 1, field);
                    } else {
                        const lastIndex = embedFields.length-1;
                        const authorField = embedFinal.fields[lastIndex];
                        embedFinal.spliceFields(tagsIndex, lastIndex, field, authorField);
                    }
                }

                const resourceRow = createRow(
                    createLinkButton({
                        url: resourceInfo.url, label: "Acessar",
                    }),
                    new ButtonBuilder({
                        customId: `resource/report/${resourceInfo.authorId}`, 
                        label: "Reportar",
                        style: ButtonStyle.Danger
                    })
                );

                const embedInfo = embedChat("warning", "Deseja salvar as alterações deste recurso?");

                confirm({
                    components: buttons => [createRow(
                        buttons.confirm, buttons.cancel
                    )],
                    render: components => interaction.editReply({
                        embeds: [embedFinal, embedInfo], components
                    }),
                    async onClick(interaction, isCancel) {
                        if (isCancel){
                            await interaction.update(menus.resources.edit(getResourceInfo<"edit">(resourceEmbed)));
                            const embed = embedChat("danger", "Você cancelou essa ação!");
                            interaction.followUp({ ephemeral, embeds: [embed] });
                            return;
                        }

                        const embed = embedChat("warning", `${icon(":a:spinner")} Aguarde...`);
                        await interaction.update({ embeds: [embed], components: [] });

                        message.edit({ embeds: [embedFinal], files: getEmbedFiles(embedFinal), components: [resourceRow] })
                        .then(async message => {
                            const embed = embedChat("success", `${icon("check")} Recurso editado com sucesso! Confira: ${message.url}`);
                            interaction.editReply({ embeds: [embed] });

                            const now = new Date();
                            const time = 1000 * 60 * 5;
                            now.setMilliseconds(now.getMilliseconds() + time);

                            resourceCommand.store.cooldowns.set(
                                `${guild.id}/${member.id}/edit`, now, time
                            );
                        })
                        .catch(err => {
                            const embed = embedChat("danger", `${icon("cancel")} Não foi possível editar o recurso! ${codeBlock(err)}`);
                            interaction.editReply({ embeds: [embed] });
                        });
                    },
                });
                return;
            }
        }
    },
});