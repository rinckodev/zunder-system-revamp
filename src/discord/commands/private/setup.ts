import { Command } from "#base";
import { embedChat, icon } from "#functions";
import { settings } from "#settings";
import { brBuilder, createEmbed, createLinkButton, createRow } from "@magicyan/discord";
import { ApplicationCommandOptionType, ApplicationCommandType, ButtonBuilder, ButtonStyle, ChannelType, codeBlock } from "discord.js";

new Command({
    name: "setup",
    description: "Setup systems",
    dmPermission: false,
    defaultMemberPermissions: ["Administrator"],
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: "terms",
            description: "setup terms message",
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: "channel",
                    description: "Select channel",
                    type: ApplicationCommandOptionType.Channel,
                    channelTypes: [ChannelType.GuildText],
                    required
                }
            ]
        },
        {
            name: "informations",
            description: "setup informations message",
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: "channel",
                    description: "Select channel",
                    type: ApplicationCommandOptionType.Channel,
                    channelTypes: [ChannelType.GuildText],
                    required
                },
                {
                    name: "terms",
                    description: "Select terms channel",
                    type: ApplicationCommandOptionType.Channel,
                    channelTypes: [ChannelType.GuildText],
                    required
                },
            ]
        },
    ],
    async run(interaction){
        const { options, guild } = interaction;

        switch(options.getSubcommand(true)){
            case "terms":{
                const channel = options.getChannel("channel", true, [ChannelType.GuildText]);

                const embed = createEmbed({
                    color: settings.colors.info,
                    description: brBuilder(
                        `# ${icon("book")} Termos e regras do discord Zunder`,
                        "- 📃 \` (d01) \` Proibido discussões, desavenças, brigas, intrigas, ofensas, insultos, provocações e deboches nos chats e canais de voz.",
                        "- 📃 \` (d02) \` Proibido correntes, spam e flood de emojis, imagens, mensagens, comandos ou até mesmo nos canais de voz.",
                        "- 📃 \` (d03) \` Proibido comércio, divulgação, venda ou troca de contas ou qualquer produto nos chats, canais de voz ou no privado de membros do servidor.",
                        "- 📃 \` (d04) \` Proibido assuntos e imagens violentas, pornográficas, nojentas, macabras, políticas, religiosas e ofensivas nos chats.",
                        "- 📃 \` (d05) \` Proibido perturbação da paz. Estourar áudio nos canais de voz, menções sem motivos nos chats, atrapalhar conversas, incomodar pessoas, pedir ou cobrar coisas sem compromisso.",
                    ),
                    fields: [
                        { inline, value: brBuilder(
                            `${icon("check")} Utilizar os chats e canais de voz conforme suas finalidades`,
                            `${icon("check")} Links são permitidos desde que não seja auto promoção/divulgação`
                        )},
                        { inline, value: brBuilder(
                            `${icon("check")} Auto promoção é permitida apenas no programa de compartilhamento (em breve)`,
                            `${icon("check")} Se não pode ajudar, não atrapalhe.`    
                        )},                    
                    ],
                    footer: {
                        text: guild.name,
                        iconURL: guild.iconURL()
                    }
                });

                channel.send({ embeds: [embed] })
                .then(message => {
                    message.react(icon("check").id);
                
                    const embed = embedChat("success", `${icon("check")} Mensagem enviada com sucesso! ${message.url}`);
                    interaction.reply({ ephemeral, embeds: [embed] });
                })
                .catch(err => {
                    const embed = embedChat("danger", `${icon("cancel")} Não foi possível enviar a mensagem! ${codeBlock(err)}`);
                    interaction.reply({ ephemeral, embeds: [embed] }); 
                });
                return;
            }
            case "informations":{
                const channel = options.getChannel("channel", true, [ChannelType.GuildText]);
                const terms = options.getChannel("terms", true, [ChannelType.GuildText]);

                const urls = {
                    invite: "http://discord.gg/tTu8dGN",
                    youtube: "https://www.youtube.com/@zundergroup",
                    tiktok: "https://www.tiktok.com/@zundergroup",
                    instagram: "https://www.instagram.com/zundergroup",
                };

                const embed = createEmbed({
                    color: settings.colors.azoxo,
                    description: brBuilder(
                        "# 📄 Informações",
                        "> A **Zunder** é uma comunidade que busca unir as pessoas em um ambiente livre de toxidade. Sempre tentando aproximar jogadores, programadores e qualquer tipo de pessoa.",
                        "",
                        `> Todos aqui são bem vindos, não importa de onde tenha vindo, poderá interagir com todos no grupo desde que siga os ${terms} da comunidade para que não haja nenhum conflito ou desavença.`,
                        "",
                        `## ${icon("discord")} Convite oficial do servidor`,
                        `${urls.invite} [${icon("link")}](${urls.invite})`,
                        "",
                        "## Acompanhe a gente nas redes sociais",
                        `- ${icon("s-youtube")} Youtube: ${urls.youtube} [${icon("link")}](${urls.youtube})`,
                        `- ${icon("s-tiktok")} Tiktok ${urls.tiktok} [${icon("link")}](${urls.tiktok})`,
                        `- ${icon("s-instagram")} Instagram: ${urls.instagram} [${icon("link")}](${urls.instagram})`,
                        "",
                        "> Clique no botão abaixo para mais informações"    
                    ),
                    footer: {
                        text: guild.name,
                        iconURL: guild.iconURL()
                    }
                });

                const row = createRow(
                    new ButtonBuilder({
                        customId: "information/index", 
                        label: "Índice de informações", 
                        style: ButtonStyle.Primary,
                        emoji: icon("home")
                    }),
                    createLinkButton({
                        url: terms.url,
                        label: "Termos",
                        emoji: "📜"
                    })
                );

                channel.send({ embeds: [embed], components: [row] })
                .then(message => {
                    message.react(icon("check").id);
                
                    const embed = embedChat("success", `${icon("check")} Mensagem enviada com sucesso! ${message.url}`);
                    interaction.reply({ ephemeral, embeds: [embed] });
                })
                .catch(err => {
                    const embed = embedChat("danger", `${icon("cancel")} Não foi possível enviar a mensagem! ${codeBlock(err)}`);
                    interaction.reply({ ephemeral, embeds: [embed] }); 
                });
                return;
            }
        }
    }
});