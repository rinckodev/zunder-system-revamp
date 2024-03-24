import { Component } from "#base";
import { getResourceInfo } from "#functions";
import { menus } from "#menus";
import { ComponentType } from "discord.js";

new Component({
    customId: "resources/:mode/:action",
    type: ComponentType.StringSelect, cache: "cached",
    async run(interaction, { mode, action }) {
        const { member, message: { embeds: [resourceEmbed] }, values } = interaction;

        switch(action){
            case "category":{
                const [selected] = values;

                const updateOptions = mode === "create"
                ? menus.resources.create(member, {
                    ...getResourceInfo(resourceEmbed),
                    category: selected, tags: undefined,
                })
                : menus.resources.edit({ 
                    ...getResourceInfo<"edit">(resourceEmbed),
                    category: selected, tags: undefined,
                });

                interaction.update(updateOptions);
                return;
            }
            case "tags":{
                const isRemoveAllSelected = values.includes("remove");

                const updateOptions = mode === "create"
                ? menus.resources.create(member, {
                    ...getResourceInfo(resourceEmbed),
                    tags: isRemoveAllSelected ? undefined : values
                })
                : menus.resources.edit({ 
                    ...getResourceInfo<"edit">(resourceEmbed),
                    tags: isRemoveAllSelected ? undefined : values
                });

                interaction.update(updateOptions);
                return;
            }
        }
    },
});