import { Event } from "#base";
import { db } from "#database";
import { createCard } from "#functions";
import { findChannel } from "@magicyan/discord";
import chalk from "chalk";
import { AttachmentBuilder, time } from "discord.js";

new Event({
    name: chalk.reset(`${chalk.bgHex("#5444a5").black(" Global ")} Leave server`),
    event: "guildMemberRemove",
    async run(member) {
        const { guild } = member;

        const { channels } = await db.guilds.get(guild.id);

        const globalChannel = findChannel(guild).byId(channels?.global?.id ?? "");
        if (!globalChannel) return;    
        
        const canvas = await createCard({ member, action: "leave" });
        const buffer = await canvas.encode("png");
        const attachment = new AttachmentBuilder(buffer, { name: "image.png" });
        globalChannel.send({ content: time(new Date(), "F"), files: [attachment] });
    },
});