import { Event } from "#base";
import { sendGuildLog, icon } from "#functions";
import { brBuilder, sleep } from "@magicyan/discord";
import chalk from "chalk";
import { channelMention, inlineCode } from "discord.js";

new Event({
    name: `${chalk.bgHex("#bad63d")(" Logs ")} Message deleted`,
    event: "messageDelete",
    async run(message) {

        if (!message.inGuild() || !message.author) return;
        const { guild, channel, author, client } = message;
        
        if (guild.id !== process.env.MAIN_GUILD_ID) return;
        if (author.id === client.user.id) return;
        if (author.id === guild.ownerId) return;
        
        const files = Array.from(message.attachments.values());

        sendGuildLog({
            guild, icon: "🗑️",                     
            files, embeds,
            details: brBuilder(
                `mensagem de **@${author.username}** deletada em ${channelMention(channel.id)}`,
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
        const { guild, channel, author, client } = newMessage;    
        
        if (guild.id !== process.env.MAIN_GUILD_ID) return;
        if (author.id === client.user.id) return;
        if (author.id === guild.ownerId) return;
    
        sendGuildLog({
            icon: "🗑️", guild,
            details: brBuilder(
                `**@${author.username}** editou uma mensagem em ${channelMention(channel.id)}`,
                `> ➜ : ${inlineCode(oldMessage.content ?? "")}`,
                `> ${icon("pencil")} : ${inlineCode(newMessage.content)} `,
            ),
        });
    },
});

new Event({
    name:`${chalk.bgHex("#bad63d")(" Logs ")} Message bulk deleted`,
    event: "messageDeleteBulk",
    async run(messagesCollection, channel) {
      
        const messages = Array.from(messagesCollection.values());

        while(messages.length > 0){
            for (let i = 0; i < Math.min(3, messages.length); i++) {
                const message = messages.pop();
                if (!message) break;
                if (!message.inGuild() || !message.author) continue;
                const { guild, author, embeds } = message;    
                
                if (guild.id !== process.env.MAIN_GUILD_ID) continue;
                
                const files = Array.from(message.attachments.values());

                sendGuildLog({
                    guild, icon: "🗑️ \` Bulk \`", 
                    files, embeds,
                    details: brBuilder(
                        `mensagem de **@${author.username}** deletada em ${channelMention(channel.id)}`,
                        `> ${inlineCode(message.content)}`
                    ),
                });
            }
            await sleep(2 * 60 * 1000);
        }
    },
});