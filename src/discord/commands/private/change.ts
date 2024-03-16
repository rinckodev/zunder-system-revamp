import { Command } from "#base";
import { db } from "#database";
import { embedChat, icon } from "#functions";
import { ApplicationCommandOptionType, ApplicationCommandType, EmbedBuilder } from "discord.js";

new Command({
    name: "change",
    description: "Change command",
    dmPermission: false,
    defaultMemberPermissions: ["Administrator"],
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: "rank",
            description: "Change member rank",
            type: ApplicationCommandOptionType.SubcommandGroup,
            options: [
                {
                    name: "type",
                    description: "Change member rank type",
                    type: ApplicationCommandOptionType.Subcommand,
                    options: [
                        {
                            name: "member",
                            description: "Select member",
                            type: ApplicationCommandOptionType.User,
                            required,
                        },
                        {
                            name: "type",
                            description: "Select new type",
                            type: ApplicationCommandOptionType.String,
                            choices: [
                                { name: "Registro Zunder", value: "zunder" },
                                { name: "Registro Discord", value: "discord" }
                            ],
                            required
                        },
                    ]
                },
                {
                    name: "level",
                    description: "Change member rank level",
                    type: ApplicationCommandOptionType.Subcommand,
                    options: [
                        {
                            name: "member",
                            description: "Select member",
                            type: ApplicationCommandOptionType.User,
                            required,
                        },
                        {
                            name: "level",
                            description: "Select new level",
                            type: ApplicationCommandOptionType.Integer,
                            choices: [
                                { name: "[ 5 ] Líder", value: 5 },
                                { name: "[ 4 ] Admin", value: 4 },
                                { name: "[ 3 ] Mod", value: 3 },
                                { name: "[ 2 ] Ajudante", value: 2 },
                                { name: "[ 1 ] Membro", value: 1 },
                            ],
                            required
                        },
                    ]
                },
                {
                    name: "device",
                    description: "Change member rank device",
                    type: ApplicationCommandOptionType.Subcommand,
                    options: [
                        {
                            name: "member",
                            description: "Select member",
                            type: ApplicationCommandOptionType.User,
                            required,
                        },
                        {
                            name: "device",
                            description: "New device",
                            type: ApplicationCommandOptionType.String,
                            required
                        },
                    ]
                },
                {
                    name: "nick",
                    description: "Change member rank nick",
                    type: ApplicationCommandOptionType.Subcommand,
                    options: [
                        {
                            name: "member",
                            description: "Select member",
                            type: ApplicationCommandOptionType.User,
                            required,
                        },
                        {
                            name: "nick",
                            description: "New nickname",
                            type: ApplicationCommandOptionType.String,
                            required
                        },
                    ]
                },
            ]
        }
    ],
    async run(interaction) {
        const { options, guild, member } = interaction;
        if (member.id !== guild.ownerId) {
            const embed = embedChat("danger", `${icon("cancel")} Apenas o dono da guilda pode usar este comando!`);
            interaction.reply({ ephemeral, embeds: [embed] });
            return;
        }

        const group = options.getSubcommandGroup(true);
        const subcommand = options.getSubcommand(true);

        switch (group) {
            case "rank": {
                await interaction.deferReply({ ephemeral });
                const mention = options.getMember("member")!;
                const embeds: EmbedBuilder[] = [];

                const mentionData = await db.members.get(mention);
                const { rank } = mentionData;

                switch (subcommand) {
                    case "level": {
                        const level = options.getInteger("level", true);

                        embeds.push(embedChat("success",
                            `${icon("pencil")} O nível do rank de ${mention} foi alterado de \`${rank.level}\` para \`${level}\``)
                        );
                        mentionData.$set("rank.level", level);
                        break;
                    }
                    case "type": {
                        const type = options.getString("type", true);

                        embeds.push(embedChat("success",
                            `${icon("pencil")} O tipo de rank de ${mention} foi alterado de \`${rank.type}\` para \`${type}\``)
                        );

                        mentionData.$set("rank.type", type);
                        break;
                    }
                    case "device": {
                        const device = options.getString("device", true);

                        embeds.push(embedChat("success",
                            `${icon("pencil")} O dispositivo do rank de ${mention} foi alterado de \`${rank.device}\` para \`${device}\``)
                        );

                        mentionData.$set("rank.device", device);
                        break;
                    }
                    case "nick": {
                        const nick = options.getString("nick", true);

                        embeds.push(embedChat("success",
                            `${icon("pencil")} O nick do rank de ${mention} foi alterado de \`${rank.nick}\` para \`${nick}\``)
                        );

                        mentionData.$set("rank.nick", nick);
                        break;
                    }
                }

                interaction.editReply({ embeds });
                await mentionData.save();
                return;
            }
        }
    }
});