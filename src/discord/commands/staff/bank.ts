import { Command } from "#base";
import { db } from "#database";
import { embedChat, icon } from "#functions";
import { settings } from "#settings";
import { brBuilder, createEmbed, createRow, findChannel, toNull } from "@magicyan/discord";
import { confirm } from "@magicyan/discord-ui";
import { ApplicationCommandOptionType, ApplicationCommandType, time } from "discord.js";

new Command({
    name: "bank", nameLocalizations: { "pt-BR": "banco" },
    description: "Manages Zunder's bank",
    descriptionLocalizations: { "pt-BR": "Administra o banco da Zunder" },
    defaultMemberPermissions: ["Administrator"],
    type: ApplicationCommandType.ChatInput,
    dmPermission: false,
    options: [
        {
            name: "add", nameLocalizations: { "pt-BR": "adicionar" },
            description: "Adds a value to the bank",
            descriptionLocalizations: { "pt-BR": "Adiciona um valor ao banco" },
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: "member", nameLocalizations: { "pt-BR": "membro" },
                    description: "Member who made the donation",
                    descriptionLocalizations: { "pt-BR": "Membro que fez a doação" },
                    type: ApplicationCommandOptionType.User,
                    required: true
                },
                {
                    name: "amount", nameLocalizations: { "pt-BR": "quantidade" },
                    description: "Value to be added",
                    descriptionLocalizations: { "pt-BR": "Valor a ser adicionado" },
                    type: ApplicationCommandOptionType.Number,
                    minValue: 1,
                    required: true
                }
            ]
        },
        {
            name: "remove", nameLocalizations: { "pt-BR": "remover" },
            description: "Remove an amount from the bank",
            descriptionLocalizations: { "pt-BR": "Remove um valor do banco" },
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: "reason", nameLocalizations: { "pt-BR": "motivo" },
                    description: "Reason the value was removed",
                    descriptionLocalizations: { "pt-BR": "Motivo pelo qual o valor foi removido" },
                    type: ApplicationCommandOptionType.String,
                    required: true
                },
                {
                    name: "amount", nameLocalizations: { "pt-BR": "quantidade" },
                    description: "Value to remove",
                    descriptionLocalizations: { "pt-BR": "Valor a ser removido" },
                    type: ApplicationCommandOptionType.Number,
                    minValue: 1,
                    required: true
                }
            ]
        }
    ],
    async run(interaction) {
        const { member, guild, client, options } = interaction;

        await interaction.deferReply({ ephemeral });

        if (guild.id != process.env.MAIN_GUILD_ID) {
            interaction.editReply(embedChat("danger", `${icon("cancel")} Este comando só pode ser usado no servidor principal!`));
            return;
        }

        const memberData = await db.members.get(member);

        if (!memberData.rank || memberData.rank.level < 5) {
            interaction.editReply(embedChat("danger", `${icon("cancel")} Apenas líderes podem usar este comando!`));
            return;
        }

        const guildData = client.mainGuildData;
        const bankChannel = findChannel(guild).byId(guildData.channels?.bank?.id ?? "");

        if (!bankChannel) {
            interaction.editReply(embedChat("danger", `${icon("cancel")} Não foi possível encontrar o chat do banco!`));
            return;
        }

        switch (options.getSubcommand(true)) {
            case "add": {
                const mention = options.getMember("member")!;
                const amount = options.getNumber("amount", true);

                const mentionData = await db.members.get(mention);
                if (!mentionData) {
                    interaction.editReply(embedChat("danger", `${icon("cancel")} O membro mencionado não está registrado!`));
                    return;
                }

                confirm({
                    components: buttons => [createRow(
                        buttons.confirm, buttons.cancel
                    )],
                    render(components) {
                        const embed = embedChat("warning", `Deseja adicionar ${amount} reais doados por ${mention} ao banco da Zunder?`).embed;
                        return interaction.editReply({ embeds: [embed], components });
                    },
                    async onClick(interaction, isCancel) {

                        if (isCancel) {
                            interaction.update(embedChat("danger", `${icon("cancel")} A operação foi cancelada!`).custom(true));
                            return;
                        }

                        interaction.update(embedChat("success", `${icon("check")} O valor doado por ${mention} foi adicionado ao banco!`).custom(true));

                        const embedLog = createEmbed({
                            color: settings.colors.green,
                            description: brBuilder(
                                `## ${icon("plus")} Valor adicionado`,
                                `> ${mention} **${mention.user.tag}** apoiou o grupo`,
                                `- 💵 Valor: \`${amount}\` reais`,
                                `- ${time(new Date(), "f")}`
                            )
                        });

                        bankChannel.send({ embeds: [embedLog] });

                        await mentionData.$inc("statistics.donation", amount).save();

                        mention.send(embedChat("success", brBuilder(
                            "## A zunder agradece pela contribuição",
                            "> Você pode acompanhar como o dinheiro que o nosso grupo",
                            "> recebe de doações está sendo usado, no chat:",
                            bankChannel.toString(),
                            "",
                            `💵 Valor doado: \` ${amount} \` reais`
                        ))).catch(toNull);

                        const total = (guildData.bank?.total ?? 0) + amount;

                        await guildData.set("bank.total", total).save();

                        bankChannel.edit({ topic: `Valo total em conta: ${total} reais` });
                    },
                });
                return;
            }
            case "remove": {
                const reason = options.getString("reason", true);
                const amount = options.getNumber("amount", true);

                confirm({
                    components: buttons => [createRow(
                        buttons.confirm, buttons.cancel
                    )],
                    render(components) {
                        const embed = embedChat("warning", `Deseja remover ${amount} reais do banco da Zunder?`).embed;
                        return interaction.editReply({ embeds: [embed], components });
                    },
                    async onClick(interaction, isCancel) {
                        if (isCancel) {
                            interaction.update(embedChat("danger", `${icon("cancel")} A operação foi cancelada!`).custom(true));
                            return;
                        }

                        interaction.update(embedChat("success", `${icon("check")} O valor foi removido do banco!`).custom(true));

                        const embedLog = createEmbed({
                            color: settings.colors.danger,
                            description: brBuilder(
                                `## ${icon("minus")} Valor removido`,
                                `> Motivo: ${reason}`,
                                `- 💵 Valor: \`${amount}\` reais`,
                                `- ${time(new Date(), "f")}`
                            )
                        });

                        bankChannel.send({ embeds: [embedLog] });

                        const total = (guildData.bank?.total ?? 0) - amount;

                        await guildData.set("bank.total", total).save();

                        bankChannel.edit({ topic: `Valo total em conta: ${total} reais` });
                    }
                });
                return;
            }
        }
    },
});