import { Command } from "#base";
import { db, MemberSchema } from "#database";
import { closeZunderRegister, embedChat, icon } from "#functions";
import { settings } from "#settings";
import { brBuilder, captalize, createEmbed, createRow, findMember } from "@magicyan/discord";
import { confirm, multimenu } from "@magicyan/discord-ui";
import { ApplicationCommandOptionType, ApplicationCommandType, formatEmoji, userMention } from "discord.js";

new Command({
    name: "manage",
    nameLocalizations: { "pt-BR": "gerenciar" },
    description: "manage command",
    descriptionLocalizations: { "pt-BR": "🧰 Comando de gerenciar" },
    dmPermission: false,
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: "nicks",
            description: "manage zunder nicks",
            descriptionLocalizations: { "pt-BR": "Gerenciar nicks da Zunder" },
            type: ApplicationCommandOptionType.Subcommand,
        }
    ],
    async run(interaction){
        const { options, guild, member } = interaction;

        const subcommand = options.getSubcommand(true);

        switch(subcommand){
            case "nicks":{
                await interaction.deferReply({ ephemeral });
                
                const membersDatas = await db.members.find({ 
                    guildId: guild.id,
                    "rank.type": "zunder" 
                });
                
                if (membersDatas.length < 1){
                    const embed = embedChat("danger", `${icon("cancel")} Não existem ainda dados de membros Zunder`);
                    interaction.editReply({ embeds: [embed] });
                    return;
                }

                const guildMembers = guild.members.cache.filter(m => 
                    membersDatas.some(d => d.id === m.id)
                );

                const dataRecord = membersDatas.reduce((prev, curr) => ({
                    ...prev, [curr.id]: curr
                }), {} as Record<string, MemberSchema>);
                
                multimenu({
                    viewType: "items", itemsPerPage: 2,
                    embed: createEmbed({
                        color: settings.colors.warning,
                        description: "Lista de membros com registro Zunder"
                    }),
                    selectMenu: {
                        placeholder: "Selecione o membro que deseja"
                    },
                    items: guildMembers.map(member => {
                        const { rank } = dataRecord[member.id]!;
                        const rankLevelIcon = settings.ranks.levels[rank.level].emoji;

                        return {
                            title: member.displayName,
                            color: member.displayHexColor,
                            thumbnail: member.displayAvatarURL(),
                            description: brBuilder(
                                `> ${formatEmoji(rankLevelIcon)} ${member.roles.highest} ${member} **@${member.user.username}**`,
                                `> 🏷️ Nick: \` ${rank.nick} \``,
                                `> Dispositivo: ${captalize(rank.device)}`,
                            ),
                            option: {
                                label: member.displayName,
                                value: member.id,
                                description: `Nick: ${rank.nick}`,
                                emoji: rankLevelIcon
                            }
                        };
                    }),
                    components: (buttons, selectMenu) => [
                        createRow(selectMenu),
                        createRow(buttons.previous, buttons.home, buttons.next),
                    ],
                    render: (embed, components) => interaction.editReply({
                        embeds:[embed], components
                    }),
                    async onSelect(interaction, item) {

                        const mentionId = item.option!.value;
                        const mention = findMember(guild).byId(mentionId)!;

                        const embed = createEmbed({
                            color: settings.colors.warning,
                            description: `Deseja encerrar o registro Zunder de ${userMention(item.option!.value)}`
                        });

                        confirm({
                            components: buttons => [createRow(buttons.confirm, buttons.cancel)],
                            render: components => interaction.update({
                                embeds: [embed], components, fetchReply,
                            }),
                            async onClick(interaction, isCancel) {
                                await interaction.update({ components: [] });

                                if (isCancel){
                                    const embed = embedChat("danger", `${icon("cancel")} Ação cancelada!`);
                                    interaction.editReply({ embeds: [embed] });
                                    return;
                                }

                                const embed = embedChat("success", `${icon("check")} O registro Zunder de ${mention} foi encerrado!`);
                                interaction.editReply({ embeds: [embed] });

                                closeZunderRegister(member, mention);
                            },
                        });

                    },
                });
                return;
            }
        }
    }
});