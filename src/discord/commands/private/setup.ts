import { Command } from "#base";
import { embedChat, icon } from "#functions";
import { settings } from "#settings";
import { brBuilder, createEmbed } from "@magicyan/discord";
import { ApplicationCommandOptionType, ApplicationCommandType, ChannelType, codeBlock } from "discord.js";

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
                }
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

                const embed = createEmbed({
                    color: settings.colors.info,
                    description: "", // TODO add description
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
        }
    }
});