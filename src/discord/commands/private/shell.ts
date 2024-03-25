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
            const embed = embedChat("danger", `${icon("cancel")} Apenas o dono da guild pode usar este comando!`);
            interaction.reply({ ephemeral, embeds: [embed] });
            return;
        }

        const shellCommand = options.getString("command", true);

        await interaction.deferReply({ ephemeral });

        exec(shellCommand, async (err, stdout, stderr) => {
            if (err) {
                const embed = embedChat("danger", brBuilder(
                    `${icon("cancel")} Ocorreu um erro!`,
                    codeBlock(err.message)
                ));
                interaction.editReply({ embeds: [embed] });
                return;
            }
            const embed = embedChat("success", brBuilder(
                `${icon("check")} Retorno do console:`,
                codeBlock(limitText(stdout, 3000, "..."))
            ));
            await interaction.editReply({ embeds: [embed] });
            if (stderr) {
                const embed = embedChat("warning", brBuilder(
                    `${icon("next")} Retorno do console:`,
                    codeBlock(limitText(stderr, 3000, "..."))
                ));
                await interaction.followUp({ ephemeral, embeds: [embed] });
            }
        });

    }
});