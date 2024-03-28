import { Command } from "#base";
import { icon, res } from "#functions";
import { ApplicationCommandType } from "discord.js";

new Command({
    name: "pop",
    description: "Legendary Zunder test command",
    dmPermission: false,
    defaultMemberPermissions: ["Administrator"],
    type: ApplicationCommandType.ChatInput,
    async run(interaction){
        interaction.reply(res.success(
            `${icon(":a:spinner")} Aguarde...`
        ));
    }
});