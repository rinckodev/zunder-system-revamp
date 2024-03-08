import { Command } from "#base";
import { menus } from "#menus";
import { ApplicationCommandType } from "discord.js";

new Command({
    name: "configurações",
    description: "Painel de configurações",
    dmPermission: false,
    type: ApplicationCommandType.ChatInput,
    async run(interaction){
        const { guild } = interaction;
        interaction.reply(menus.settings.main(guild));
    }
});