import { Component } from "#base";
import { menus } from "#menus";
import { ComponentType } from "discord.js";

new Component({
    customId: "menu/settings/:menu",
    type: ComponentType.Button, cache: "cached",
    async run(interaction, { menu }) {
        const { guild, client } = interaction;
        
        await interaction.deferUpdate();
        const guildData = client.mainGuildData;
        
        switch(menu){
            case "main":{
                interaction.editReply(menus.settings.main(guild));
                return;
            }
            case "channels":{
                interaction.editReply(menus.settings.channels.menu(guildData));
                return;
            }
            case "ranks":{
                interaction.editReply(menus.settings.ranks.menu(guild));
                return;
            }
        }
    }
});