import { Component } from "#base";
import { db } from "#database";
import { deleteMessage, embedChat, icon, sendGuildRecord } from "#functions";
import { createEmbed, findMember, findRole } from "@magicyan/discord";
import { ComponentType } from "discord.js";

new Component({
    customId: "register/manage/:mentionId/:nick/:action",
    type: ComponentType.Button, cache: "cached",
    async run(interaction, { action, nick, mentionId }) {
        const { member, message: { embeds: [messageEmbed] }, client, guild } = interaction;
        
        const embeds = [
            createEmbed({ extend: messageEmbed.data })
        ];

        await interaction.deferUpdate();

        const done = async () => {
            const message = await interaction.editReply({ embeds, components:[] });
            deleteMessage(message, 12 * 1000);
        };

        const mention = findMember(guild).byId(mentionId);
        if (!mention){
            embeds.push(embedChat("danger", `${icon("cancel")} O membro não foi encontrado no servidor!`).embed); done();
            return;
        }

        if (action === "recuse"){
            embeds.push(embedChat("danger", `${icon("cancel")} A solicitação de ${mention} foi recusada!`).embed); done();
            return;
        }

        const { ranks } = client.mainGuildData; 
                
        const zunderRankTypeRole = findRole(guild).byId(ranks?.types?.zunder?.id ?? "");
        const discordRankTypeRole = findRole(guild).byId(ranks?.types?.discord?.id ?? "");

        if (!zunderRankTypeRole || !discordRankTypeRole){
            interaction.followUp(embedChat("danger", `${icon("cancel")} Um dos cargos de tipo de registro não está definido!`));
            return;
        }

        const mentionData = await db.members.get(mention);
        if (mentionData?.rank?.type === "zunder"){
            embeds.push(embedChat("primary", `${icon("book")} O membro já tem um registro Zunder!`).embed); done();
            return;
        }

        switch(action){
            case "approve":{
                embeds.push(embedChat("success", `${icon("check")} A solicitação de ${mention} foi aprovada!`).embed);

                await mentionData.set("rank", {
                    level: mentionData?.rank?.level ?? 1, 
                    type: "zunder", device: "minecraft", nick 
                }).save();

                sendGuildRecord({ guild,
                    title: "📋 Sistema de registro",
                    details: `${icon("check")} Registrado como membro Zunder`,
                    color: "warning", target: mention, executor: member,
                    thumbnail: member.displayAvatarURL()
                });

                const roles = new Set(Array.from(mention.roles.cache.keys()));
                roles.delete(discordRankTypeRole.id);
                roles.add(zunderRankTypeRole.id);

                mention.roles.set(Array.from(roles.values()));
                break;
            }
        }

        done();
    },
});