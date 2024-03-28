import { Event } from "#base";
import { deleteMessage, icon } from "#functions";
import { gemini } from "#tools";

new Event({
    name: "AI Chat",
    event: "messageCreate",
    async run(message) {
        if (message.author.bot || !message.inGuild()) return;
        const { guild, client, mentions, content } = message;
        const me = guild.members.me!;
        if (!mentions.users.has(me.id) && !mentions.roles.has(me.roles.highest.id)) return;

        const mainGuildData = client.mainGuildData;

        if (!mainGuildData.aibot?.enabled){
            deleteMessage(await message.reply({
                content: `${icon("cancel")} No momento estou indisponível!`
            }), 12000);
            return;
        }
        await message.channel.sendTyping();
        const { response } = await gemini.text.generateContent(content);
        const result = gemini.getText(response);
        if (!result.success || !result.text) return;

        const maxLength = 3000;
        const texts: string[] = [];
        for (let i = 0; i < result.text.length; i += maxLength) {
            texts.push(result.text.slice(i, i+maxLength));
        }

        await message.reply({ allowedMentions: { repliedUser: false }, content: texts.shift() });

        if (texts.length < 1) return;

        while(texts.length >= 1){
            await message.reply({ allowedMentions: { repliedUser: false }, content: texts.shift() });
        }


    },
});