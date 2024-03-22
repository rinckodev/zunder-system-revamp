import { Event } from "#base";
import { sendGuildLog, icon } from "#functions";
import { sleep } from "@magicyan/discord";
import chalk from "chalk";


new Event({
    name: `${chalk.bgHex("#bad63d")(" Logs ")} Member on voice channel`,
    event: "voiceStateUpdate",
    async run(oldState, newState) {
        const { channel, member, guild } = newState;
        if (!member || guild.id !== process.env.MAIN_GUILD_ID) return;

        if (oldState.channel && oldState.channel.id !== channel?.id){
            sendGuildLog({
                icon: icon("minus").toString(), guild: member.guild,
                details: `**@${member.user.tag}** saiu de ${oldState.channel}`
            });
            await sleep(1000);
        }
        if (channel && channel.id !== oldState.channel?.id){
            sendGuildLog({
                icon: icon("plus").toString(), guild: member.guild,
                details: `**@${member.user.tag}** entrou em ${channel}`
            });
            await sleep(1000);
        }
    },
});