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
            case "channels":{
                interaction.editReply(menus.settings.channels.submenu(guildData, selected));
                return;
            }
            case "ranks":{
                
                switch(selected){
                    case "types":{
                        interaction.editReply(menus.settings.ranks.types.menu(guild, guildData));
                        return;
                    }
                    case "levels":{
                        interaction.editReply(menus.settings.ranks.levels.menu(guild, guildData));
                        return;
                    }
                }
                return;
            }
        }
    },
});