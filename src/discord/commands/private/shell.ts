import { Command } from "#base";
import { embedChat, icon } from "#functions";
import { brBuilder, limitText } from "@magicyan/discord";
import { exec } from "child_process";
import { ApplicationCommandOptionType, ApplicationCommandType, codeBlock } from "discord.js";

new Command({
    name: "shell",
    description: "Execute shell command",
    dmPermission: false,
    defaultMemberPermissions: ["Administrator"],
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: "command",
            description: "Shell command",
            type: ApplicationCommandOptionType.String,
            required,
        }
    ],
    async run(interaction){
        const { options, member, guild } = interaction;
        
        if (member.id !== guild.ownerId){
            interaction.reply(embedChat("danger", `${icon("cancel")} Apenas o dono da guild pode usar este comando!`));
            return;
        }

        const shellCommand = options.getString("command", true);

        await interaction.deferReply({ ephemeral });

        exec(shellCommand, async (err, stdout, stderr) => {
            if (err) {
                interaction.editReply(embedChat("danger", `${icon("cancel")} Ocorreu um erro! ${codeBlock(err.message)}`));
                return;
            }
            await interaction.editReply(embedChat("success", brBuilder(
                `${icon("check")} Retorno do console:`,
                codeBlock(limitText(stdout, 3000, "..."))
            )));
            if (stderr) {
                await interaction.followUp(embedChat("warning", brBuilder(
                    `${icon("next")} Retorno do console:`,
                    codeBlock(limitText(stderr, 3000, "..."))
                )));
            }
        });

    }
});