import { Command } from "#base";
import { ApplicationCommandOptionType, ApplicationCommandType } from "discord.js";

new Command({
    name: "emit",
    description: "Emit event",
    dmPermission: false,
    defaultMemberPermissions: ["Administrator"],
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: "guildmemberadd",
            description: "Emite Guild Member Add Event",
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: "member",
                    description: "Mention a member",
                    type: ApplicationCommandOptionType.User,
                    required
                }
            ]
        },
        {
            name: "guildmemberremove",
            description: "Emite Guild Member Remove Event",
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: "member",
                    description: "Mention a member",
                    type: ApplicationCommandOptionType.User,
                    required
                }
            ]
        },
    ],
    async run(interaction){
        const { client, options } = interaction;
    
        const subCommand = options.getSubcommand(true);

        switch(subCommand){
            case "guildmemberadd":{
                interaction.reply({ ephemeral, content: "Event emited!" });
                const member = options.getMember("member")!;
                client.emit("guildMemberAdd", member);
                return;
            }
            case "guildmemberremove":{
                interaction.reply({ ephemeral, content: "Event emited!" });
                const member = options.getMember("member")!;
                client.emit("guildMemberRemove", member);

                return;
            }
        }
    }
});