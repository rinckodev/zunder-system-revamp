import { Event } from "#base";
import { sendGuildLog, icon } from "#functions";
import { brBuilder } from "@magicyan/discord";
import chalk from "chalk";
import { channelMention, inlineCode } from "discord.js";

new Event({
    name: `${chalk.bgHex("#bad63d")(" Logs ")} Message deleted`,
    event: "messageDelete",
    async run(message) {
        if (!message.inGuild() || !message.member) return;
        const { guild, channel, member, client } = message;    
        
        if (guild.id !== process.env.MAIN_GUILD_ID) return;
        if (member.id === client.user.id) return;
        if (member.id === guild.ownerId) return;
        
        const files = Array.from(message.attachments.values());

        sendGuildLog({
            guild, icon: "🗑️", files,
            details: brBuilder(
                `**@${member.user.username}** deletou uma mensagem em ${channelMention(channel.id)}`,
                `> ${inlineCode(message.content)}`
            ),
        });
    },
});

new Event({
    name: `${chalk.bgHex("#bad63d")(" Logs ")} Message edited`,
    event: "messageUpdate",
    async run(oldMessage, newMessage) {
        if (!newMessage.inGuild() || !newMessage.member) return;
        const { guild, channel, member, client } = newMessage;    
        
        if (guild.id !== process.env.MAIN_GUILD_ID) return;
        if (member.id === client.user.id) return;
        if (member.id === guild.ownerId) return;
    
        sendGuildLog({
            icon: "🗑️", guild,
            details: brBuilder(
                `**@${member.user.username}** editou uma mensagem em ${channelMention(channel.id)}`,
                `> ➜ Original: ${inlineCode(oldMessage.content ?? "")}`,
                `> ${icon("pencil")} editado: ${inlineCode(newMessage.content)} `,
            ),
        });
    },
});