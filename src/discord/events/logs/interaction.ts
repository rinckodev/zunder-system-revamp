import { Event } from "#base";
import { sendGuildLog } from "#functions";
import { notFound, spaceBuilder } from "@magicyan/discord";
import chalk from "chalk";
import { User, bold, channelMention, inlineCode, chatInputApplicationCommandMention as mentionCommand } from "discord.js";

new Event({
    name: `${chalk.bgHex("#bad63d")(" Logs ")} On interaction`,
    event: "interactionCreate",
    async run(interaction) {
        const { guild, member } = interaction;
        if (!guild || !member) return;
    
        const getUsername = (user?: User) => {
            return user ? bold("@"+user.username) : bold("@"+member.user.username);
        };
    
        if (interaction.isChatInputCommand()){
            const { options, commandName, commandId, channelId } = interaction;
    
            const group = notFound(options.getSubcommandGroup(false));
            const subCommand = notFound(options.getSubcommand(false));
    
            const mention = 
            group && subCommand ? mentionCommand(commandName, group, subCommand, commandId) :
            subCommand ? mentionCommand(commandName, subCommand, commandId) : 
            mentionCommand(commandName, commandId);
    
            sendGuildLog({ guild,
                details: `${getUsername()} usou ${mention} em ${channelMention(channelId)}`,
            });
            return;
        }
    
        if (interaction.isUserContextMenuCommand()){
            const { targetUser, channelId, commandName } = interaction;

            sendGuildLog({ guild,
                details: spaceBuilder(
                    getUsername(),
                    "usou o contexto de usuário", inlineCode(commandName),
                    "em", getUsername(targetUser),
                    "em", channelMention(channelId)
                )
            });
        }
    
        if (interaction.isMessageContextMenuCommand()){
            const { targetMessage, channelId, commandName } = interaction;

            sendGuildLog({ guild,
                details: spaceBuilder(
                    getUsername(),
                    getUsername(),
                    "usou o contexto de mensagem", commandName,
                    "em", targetMessage.url,
                    "em", channelMention(channelId)
                )
            });
        }
        
        if (interaction.isButton()){
            const { customId, channelId } = interaction;

            sendGuildLog({ guild,
                details: spaceBuilder(
                    getUsername(),
                    "clicou no botão", inlineCode(customId),
                    "em", channelMention(channelId)
                )
            });
        }
    
        if (interaction.isAnySelectMenu()){
            const { customId, channelId } = interaction;
           
            sendGuildLog({ guild,
                details: spaceBuilder(
                    getUsername(),
                    "usou o menu de seleção", inlineCode(customId),
                    "em", channelMention(channelId)
                )
            });
        }
    
        if (interaction.isModalSubmit()){
            const { customId } = interaction;

            sendGuildLog({ guild,
                details: spaceBuilder(
                    getUsername(),
                    "enviou o modal", inlineCode(customId)
                )
            });
        } 
    },
});