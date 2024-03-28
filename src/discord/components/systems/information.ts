import { Component } from "#base";
import { embedChat, icon } from "#functions";
import { settings } from "#settings";
import { createEmbed, createRow } from "@magicyan/discord";
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } from "discord.js";

new Component({
    customId: "information/:index",
    type: ComponentType.Button, cache: "cached",
    async run(interaction, { index }) {

        const { information } = interaction.client.mainGuildData;

        if (information.length < 1){
            interaction.reply(embedChat("info", "🚧 Não há informações definidas ainda!"));
            return;
        }
        
        if (index === "index" || index === "back"){
            let infoIndex = 0;

            const components: ActionRowBuilder<ButtonBuilder>[] = [];
    
            for(let rowIndex = 0; rowIndex < 5; rowIndex++){
                const row = createRow<ButtonBuilder>();
                for(let buttonIndex = 0; buttonIndex < 5; buttonIndex++){
                    const info = information[infoIndex];
                    if (info){
                        row.addComponents(
                            new ButtonBuilder({
                                customId: `information/${infoIndex}`,
                                label: info.title,
                                emoji: info.emoji??"📃",
                                style: info.style,
                            })
                        );
                    }
                    infoIndex++;
                }
                if (row.components.length >= 1) components.push(row);
            }

            const embed = createEmbed({
                color: settings.colors.azoxo,
                description: `${icon("next")} Selecione a informação que deseja!`,
            });
            const options = { ephemeral, embeds: [embed], components };
            index === "index" ? interaction.reply(options) : interaction.update(options);
            return;
        }

        const info = information[+index];
        if (!info){
            interaction.reply(embedChat("danger", `${icon("cancel")} A informação selecionada não foi definida!`));
            return;
        }

        const embed = createEmbed({
            color: settings.colors.primary,
            title: info.title,
            description: info.description,
        });

        const row = createRow(
            new ButtonBuilder({
                customId: "information/back", 
                label: "Voltar para o índice", 
                emoji: icon("home"),
                style: ButtonStyle.Danger
            })
        );

        interaction.update({ embeds: [embed], components: [row] });
    },
});