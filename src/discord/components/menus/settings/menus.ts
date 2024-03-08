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
    },
});