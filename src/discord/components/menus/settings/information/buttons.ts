import { Component } from "#base";
import { GuildSchema } from "#database";
import { menus } from "#menus";
import { createModalInput, notFound } from "@magicyan/discord";
import { ComponentType, ModalBuilder, TextInputStyle } from "discord.js";

function informationModal(action: "add" | "edit", index: string, data: GuildSchema["information"]){
    return new ModalBuilder({
        customId: `menu/settings/information/${action}/${index}`,
        title: "Adicionar uma informação",
        components: [
            createModalInput({
                customId: "title",
                label: "Título",
                placeholder: "Insira o título da informação",
                style: TextInputStyle.Short,
                value: data[+index]?.title,
                required,
            }),
            createModalInput({
                customId: "description",
                label: "Descrição",
                placeholder: "Insira a descrição da informação",
                style: TextInputStyle.Paragraph,
                value: data[+index]?.description,
                required,
            }),
            createModalInput({
                customId: "emoji",
                label: "Emoji",
                placeholder: "Emoji da informação",
                style: TextInputStyle.Short,
                value: notFound(data[+index]?.emoji),
                required: false,
            }),
            createModalInput({
                customId: "style",
                label: "Estilo",
                placeholder: "Defina o estilo do botão. (1, 2, 3, 4)",
                style: TextInputStyle.Short,
                value: data[+index]?.style.toString(),
                required: false,
            }),
        ],
    });
}

new Component({
    customId: "menu/settings/information/:action/:index",
    type: ComponentType.Button, cache: "cached",
    async run(interaction, { action, index }) {
        
        const guildData = interaction.client.mainGuildData;

        switch(action){
            case "add":
            case "edit":{
                interaction.showModal(
                    informationModal(action, index, guildData.information)
                );
                return;
            }
            case "remove":{
                await interaction.deferUpdate();

                const array = guildData.information;
                array.splice(+index, 1);
                guildData.$set("information", array);

                await guildData.save();
                interaction.editReply(menus.settings.information.main(guildData));
                return;
            }
        }
    },
});