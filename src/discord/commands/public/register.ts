import { Command, Store } from "#base";
import { db } from "#database";
import { embedChat, icon } from "#functions";
import { settings } from "#settings";
import { brBuilder, createEmbed, createEmbedAsset, createEmbedFooter, createRow, findChannel } from "@magicyan/discord";
import { ApplicationCommandOptionType, ApplicationCommandType, ButtonBuilder, ButtonStyle, hyperlink, time } from "discord.js";

new Command({
    name: "register",
    nameLocalizations: { "pt-BR": "registrar" },
    description: "Register command",
    descriptionLocalizations: { "pt-BR": "Comando de registro" },
    dmPermission: false,
    options: [
        {
            name: "nick",
            description: "Your ingame nick",
            descriptionLocalizations: { "pt-BR": "Seu nick em jogo" },
            type: ApplicationCommandOptionType.String,
            minLength: 3,
            required,
        }
    ],
    store: {
        cooldowns: new Store<Date>({ clearTime: 2*60*1000 }) 
    },
    type: ApplicationCommandType.ChatInput,
    async run(interaction, { cooldowns }){
        const { options, member, guild, client } = interaction;

        await interaction.deferReply({ ephemeral });

        const memberData = await db.members.get(member);
        if (memberData.rank?.type === "zunder"){
            interaction.editReply(embedChat("danger", `${icon("cancel")} Você já está registrado como membro Zunder`));
            return;
        }

        const nowTime = new Date();
        const cooldownTime = cooldowns.get(member.id) ?? nowTime;

        if (cooldownTime > nowTime){
            interaction.editReply(embedChat("danger", `${icon("clock")} Você poderá usar este comando novamente ${time(cooldownTime, "R")}`));
            return;
        }

        const guildData = client.mainGuildData;

        const managementChannel = findChannel(guild).byId(guildData?.channels?.management?.id ?? "");
        if (!managementChannel){
            interaction.editReply(embedChat("danger", "Este sistema não está configurado!"));
            return;
        }

        const nick = options.getString("nick", true);
        
        const embed = createEmbed({
            title: "📋 Solicitação de registro Zunder",
            thumbnail: createEmbedAsset(member.displayAvatarURL()),
            color: settings.colors.warning,
            description: brBuilder(
                `> ${member.roles.highest} ${member} @${member.user.username}`,
                "",
                `**Nick**: ${hyperlink(nick, `https://pt.namemc.com/profile/${nick}`, "NameMc")}`
            ),
            footer: createEmbedFooter({
                text: "Sistema de registro",
                iconURL: guild.iconURL()
            }),
            timestamp: new Date()
        });

        const row = createRow(
            new ButtonBuilder({
                customId: `register/manage/${member.id}/${nick}/approve`,
                label: "Aprovar",
                style: ButtonStyle.Success,
                emoji: icon("check"),
            }),
            new ButtonBuilder({
                customId: `register/manage/${member.id}/${nick}/recuse`,
                label: "Recusar",
                style: ButtonStyle.Danger,
                emoji: icon("cancel"),
            }),
        );

        managementChannel.send({ embeds: [embed], components: [row] })
        .then(() => {
            interaction.editReply(embedChat("success", `${icon("check")} Sua solicitação de registro Zunder foi enviada!`));

            const future = new Date();
            future.setMinutes(future.getMinutes() + 2);

            cooldowns.set(member.id, future);
        })
        .catch(() => {
            interaction.editReply(embedChat("danger", `${icon("cancel")} Não foi possível enviar a solicitação de registro!`));
        });

    }
});