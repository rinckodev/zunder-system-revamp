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
                    interaction.update(embedChat("danger", `${icon("cancel")} Não foi possível editar informações! ${codeBlock(err)}`));
                });

                if (!isUrl(url)){
                    interaction.followUp(embedChat("danger", `${icon("cancel")} A url enviada não é válida!`));
                    return;
                }
                return;
            }
            case "save":{
                await interaction.deferUpdate();

                const messageUrl = fields.getTextInputValue("message/input");

                const result = await findResource(messageUrl, guild);
                if (!result.success){
                    interaction.followUp(embedChat("danger", result.error));
                    return;
                }
                const { message, resourceEmbed: oldResourceEmbed } = result;
                const resourceInfo = getResourceInfo<"edit">(resourceEmbed);

                if (message.id !== resourceInfo.messageId){
                    interaction.followUp(embedChat("danger", `${icon("cancel")} Parece que você está tentando editar outro recurso`));
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

                const embedInfo = embedChat("warning", "Deseja salvar as alterações deste recurso?").embed;

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
                            interaction.followUp(embedChat("danger", "Você cancelou essa ação!"));
                            return;
                        }

                        await interaction.update(embedChat("warning", `${icon(":a:spinner")} Aguarde...`).custom(true));

                        message.edit({ embeds: [embedFinal], files: getEmbedFiles(embedFinal), components: [resourceRow] })
                        .then(async message => {
                            interaction.editReply(embedChat("success", `${icon("check")} Recurso editado com sucesso! Confira: ${message.url}`));

                            const now = new Date();
                            const time = 1000 * 60 * 5;
                            now.setMilliseconds(now.getMilliseconds() + time);

                            resourceCommand.store.cooldowns.set(
                                `${guild.id}/${member.id}/edit`, now, time
                            );
                        })
                        .catch(err => {
                            interaction.editReply(embedChat("danger", `${icon("cancel")} Não foi possível editar o recurso! ${codeBlock(err)}`));
                        });
                    },
                });
                return;
            }
        }
    },
});