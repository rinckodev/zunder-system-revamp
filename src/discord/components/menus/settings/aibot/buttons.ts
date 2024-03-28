import { Component } from "#base";
import { menus } from "#menus";
import { ComponentType } from "discord.js";

new Component({
    customId: "menu/settings/aibot/:action",
    type: ComponentType.Button, cache: "cached",
    async run(interaction, { action }) {
        
        await interaction.deferUpdate();
        const guildData = interaction.client.mainGuildData;

        switch(action){
            case "toggle":{
                guildData.$set("aibot.enabled", !guildData.aibot?.enabled).save();
                interaction.editReply(menus.settings.aibot.main(guildData));
                return;
            }
        }
    },
});