import { Component } from "#base";
import { db } from "#database";
import { menus } from "#menus";
import { findChannel } from "@magicyan/discord";
import { ComponentType } from "discord.js";

new Component({
    customId: "menu/settings/:menu/:[args]",
    type: ComponentType.ActionRow, cache: "cached",
    async run(interaction, { menu, args }) {
        const { guild } = interaction;
        
        if (interaction.isChannelSelectMenu()){
            await interaction.deferUpdate();
            const guildData = await db.guilds.get(guild.id);
            
            const [selectedChannelId] = interaction.values;
            
            switch(menu){
                case "channel":{
                    const [selected] = args;
                    const { id, url } = findChannel(guild).byId(selectedChannelId)!;

                    await guildData.$set(`channels.${selected}`, { id, url }).save();
                    
                    interaction.editReply(menus.settings.channels.menu(guildData));
                    return;
                }
            }
        }

        if (interaction.isStringSelectMenu()){
            switch(menu){
                case "ranks":{
                    await interaction.deferUpdate();
                    const guildData = await db.guilds.get(guild.id);

                    const [selectedItem] = interaction.values;
                    
                    const [submenu] = args;
                    switch(submenu){
                        case "types":{
                            interaction.editReply(
                                menus.settings.ranks.types.submenu(guildData, selectedItem)
                            );
                            return;
                        }
                        case "levels":{
                            interaction.editReply(
                                menus.settings.ranks.levels.submenu(guildData, selectedItem)
                            );
                            return;
                        }
                    }
                    return;
                }
            }
        }

        if (interaction.isRoleSelectMenu()){
            await interaction.deferUpdate();
            const guildData = await db.guilds.get(guild.id);
            
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