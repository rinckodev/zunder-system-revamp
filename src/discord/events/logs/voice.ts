import { Event } from "#base";
import { sendGuildLog, icon } from "#functions";
import chalk from "chalk";

new Event({
    name: `${chalk.bgHex("#bad63d")(" Logs ")} Member connect voice channel`,
    event: "guildMemberConnect",
    run(member, channel) {
        sendGuildLog({
            icon: icon("plus").toString(), guild: member.guild,
            details: `**@${member.user.tag}** entrou em ${channel}`
        });
    },
});

new Event({
    name: `${chalk.bgHex("#bad63d")(" Logs ")} Member disconnect voice channel`,
    event: "guildMemberDisconnect",
    run(member, channel) {
        sendGuildLog({
            icon: icon("minus").toString(), guild: member.guild,
            details: `**@${member.user.tag}** saiu de ${channel}`
        });
    },
});