import { Event } from "#base";
import { icon, sendGuildRecord } from "#functions";
import { brBuilder, createEmbedAsset } from "@magicyan/discord";
import chalk from "chalk";
import { time } from "discord.js";


new Event({
    name: `${chalk.bgHex("#bad63d")(" Logs ")} Member timeout`,
    event: "guildMemberTimeoutAdd",
    run(member, executor, expireAt, reason) {
        if (member.guild.id !== process.env.MAIN_GUILD_ID) return;
        
        sendGuildRecord({
            guild: member.guild,
            title: `${icon("block")} Castigo`,
            color: "danger", executor, target: member,
            thumbnail: createEmbedAsset(member.displayAvatarURL()),
            details: brBuilder(
                `${icon("block")} Teve um castigo aplicado`,
                `${icon("pencil")} Motivo: \`${reason ?? "sem motivo"}\``,
                `${icon("clock")} Expiração: ${time(expireAt, "R")}`
            ),
        });
    },
});