import { Component, Modal } from "#base";
import { embedChat, icon } from "#functions";
import { createModalInput, findMember, spaceBuilder } from "@magicyan/discord";
import { ComponentType, TextInputStyle } from "discord.js";

new Component({
    customId: "resource/:action/:authorId",
    type: ComponentType.Button, cache: "cached",
    async run(interaction, { action, authorId }) {

        switch(action){
            case "report":{
                interaction.showModal({
                    customId: `resource/report/${authorId}`,
                    title: "Reportar um recurso",
                    components: [
                        createModalInput({
                            customId: "reason/input",
                            label: "Motivo",
                            style: TextInputStyle.Paragraph,
                            minLength: 10,
                            placeholder: "Digite o motivo do reporte",
                            required,
                        })
                    ],
                });
                return;
            }
        }
    },
});

new Modal({
    customId: "resource/:action/:authorId",
    cache: "cached", isFromMessage: true,
    async run(interaction, { action, authorId }) {
        const { message: { embeds: [resourceEmbed] }, fields, guild } = interaction;
    
        const author = findMember(guild).byId(authorId);
        const title = resourceEmbed?.data.title;

        switch(action){
            case "report":{
                // TODO implement resource report system
                const reason = fields.getTextInputValue("reason/input");
                reason;

                interaction.reply(embedChat("success", spaceBuilder(
                    `${icon("check")} Você reportou o recurso`,
                    title??"", author ? `de ${author}` : ""
                )));
                return;
            }
        }
    },
});