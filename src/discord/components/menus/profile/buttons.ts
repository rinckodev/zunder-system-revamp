import { Component } from "#base";
import { db } from "#database";
import { embedChat, icon } from "#functions";
import { menus } from "#menus";
import { findMember } from "@magicyan/discord";
import { ComponentType } from "discord.js";

new Component({
    customId: "profile/:action/:profileMemberId",
    type: ComponentType.Button, cache: "cached",
    async run(interaction, { action, profileMemberId }) {
        const { member, guild } = interaction;

        await interaction.deferUpdate();

        const profileMember = findMember(guild).byId(profileMemberId);
        if (!profileMember){
            interaction.editReply(embedChat("danger", `${icon("cancel")} O membro não foi localizado no servidor!`));
            return;
        }

        const profileMemberData = await db.members.get(profileMember);
        
        switch(action){
            case "refresh":{
                interaction.editReply(
                    menus.profile.main(member.id, profileMember, profileMemberData)
                );
                return;
            }
            case "settings":{
                interaction.followUp({ ephemeral,
                    content: "🚧 Isso está em desenvolvimento..."
                });
                return;
            }
        }
    },
});