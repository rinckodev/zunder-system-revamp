import { Event } from "#base";
import { icon, sendGuildLog } from "#functions";
import { findMember, spaceBuilder } from "@magicyan/discord";
import chalk from "chalk";

new Event({
    name: `${chalk.bgHex("#bad63d")(" Logs ")} Threads deleted`,
    event: "threadDelete",
    run(thread) {
        const { guild, ownerId, parent } = thread;
        if (!ownerId || guild.id !== process.env.MAIN_GUILD_ID) return;
        
        const member = findMember(guild).byId(ownerId);

        sendGuildLog({
            guild, icon: icon("talk").toString(),
            details: spaceBuilder(
                `Tópico **${thread.name}**`,
                member ? `de **@${member.user.username}** ` : "sem autor",
                parent ? `em ${parent}` : "em **?**", 
                "deletado"
            ),
        });
    },
});