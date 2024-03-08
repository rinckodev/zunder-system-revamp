import { Component } from "#base";
import { db } from "#database";
import { menus } from "#menus";
import { ComponentType } from "discord.js";

new Component({
    customId: "menu/settings/:menu",
    type: ComponentType.StringSelect, cache: "cached",
    async run(interaction, { menu }) {
        const { values: [selected], guild } = interaction;
        
        await interaction.deferUpdate();
        const guildData = await db.guilds.get(guild.id);
        
        switch(menu){
            case "main":{
                
                switch(selected){
                    case "channels":{
                        interaction.editReply(menus.settings.channels.menu(guildData));
                        return;
                    }
                    case "ranks":{
                        // TODO add menu
                        return;
                    }
                    case "resources":{
                        // TODO add menu
                        return;
                    }
                }
                
                return;
            }
            case "channels":{
                interaction.editReply(menus.settings.channels.submenu(guildData, selected));
                return;
            }
        }
    },
});