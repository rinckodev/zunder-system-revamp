import { Component } from "#base";
import { menus } from "#menus";
import { ComponentType } from "discord.js";

new Component({
    customId: "menu/settings/:menu/:[args]",
    type: ComponentType.ActionRow, cache: "cached",
    async run(interaction, { menu, args }) {
        const { guild, client } = interaction;
        
        const guildData = client.mainGuildData; 
        
        if (interaction.isChannelSelectMenu()){
            await interaction.deferUpdate();
            
            const [selectedChannelId] = interaction.values;
            
            switch(menu){
                case "channel":{
                    const [selected] = args;
                    const { id, url } = guild.channels.cache.get(selectedChannelId)!;

                    await guildData.$set(`channels.${selected}`, { id, url }).save();
                    
                    interaction.editReply(menus.settings.channels.menu(guildData));
                    return;
                }
            }
        }

        console.log(menu, args);

        if (interaction.isStringSelectMenu()){
            console.log("select");
            
            const [selected] = interaction.values;
            switch(menu){
                case "ranks":{
                    await interaction.deferUpdate();
                    
                    const [submenu] = args;
                    switch(submenu){
                        case "types":{
                            interaction.editReply(
                                menus.settings.ranks.types.submenu(guildData, selected)
                            );
                            return;
                        }
                        case "levels":{
                            interaction.editReply(
                                menus.settings.ranks.levels.submenu(guildData, selected)
                            );
                            return;
                        }
                    }
                    return;
                }
                case "information":{

                    interaction.update(menus.settings.information.submenu(guildData, selected));
                    return;
                }
            }
        }

        if (interaction.isRoleSelectMenu()){
            await interaction.deferUpdate();
            const [selectedRoleId] = interaction.values;

            switch(menu){
                case "ranks":{
                    const [submenu, selected] = args as ["levels" | "types", string];

                    await guildData.$set(`ranks.${submenu}.${selected}`, { id: selectedRoleId }).save();
                    
                    interaction.editReply(
                        menus.settings.ranks[submenu].menu(guild, guildData)
                    );
                    return;
                }
            }
        }
    },
});