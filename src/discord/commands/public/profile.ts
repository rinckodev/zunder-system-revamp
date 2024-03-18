import { Command } from "#base";
import { db } from "#database";
import { menus } from "#menus";
import { ApplicationCommandOptionType, ApplicationCommandType } from "discord.js";

new Command({
    name: "profile",
    nameLocalizations: { "pt-BR": "perfil" },
    description: "Show a member profile",
    descriptionLocalizations: { "pt-BR": "Exibe o perfil de um membro" },
    dmPermission: false,
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: "member",
            nameLocalizations: { "pt-BR": "membro" },
            description: "Mention a member",
            descriptionLocalizations: { "pt-BR": "Mencione um membro" },
            type: ApplicationCommandOptionType.User,
        }
    ],
    async run(interaction){
        const { options, member } = interaction;

        const profileMember = options.getMember("member") ?? member;
        
        await interaction.deferReply({ ephemeral });
        
        const profileMemberData = await db.members.get(profileMember);

        interaction.editReply(
            menus.profile.main(member.id, profileMember, profileMemberData)
        );
    }
});