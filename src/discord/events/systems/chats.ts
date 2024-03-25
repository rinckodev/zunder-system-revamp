import { Event } from "#base";
import { deleteMessage, embedChat } from "#functions";
import { brBuilder, createLinkButton, createRow } from "@magicyan/discord";
import { codeBlock, ThreadAutoArchiveDuration } from "discord.js";

new Event({
    name: "Presentation system",
    event: "messageCreate",
    async run(message) {
        if (!message.inGuild() || message.guild.id !== process.env.MAIN_GUILD_ID) return;
        if (message.author.bot) return;

        const channel = message.channel;
        const { channels } = message.client.mainGuildData;
        
        switch(channel.id){
            case channels.presentations?.id:{
                if (message.content.length < 100){
                    message.delete();
                    const errMessage = [
                        "> Sua mensagem de apresentação é muito curta!",
                        "> Tente contar mais detalhes sobre você, o que faz, objetivos, etc!",
                        "> A mensagem deve ter no mínimo \`100\` caracteres"
                    ];
                    const embed = embedChat("danger", brBuilder(errMessage,
                        "- Para não perder o que você já escreveu: ",
                        codeBlock(message.content),
                    ));
                    const row = createRow(
                        createLinkButton({ 
                            label: "Voltar para o canal de apresentações",
                            url: channel.url, emoji: "👋",
                        })
                    );
                    message.author.send({ embeds: [embed], components: [row]})
                    .then(m => deleteMessage(m, 60000))
                    .catch(async () => {
                        const embed = embedChat("danger", brBuilder(errMessage));
                        deleteMessage(await channel.send({ embeds: [embed] }), 22000);
                    });
                    return;
                }
        
                message.react("❤️");
                return;
            }
            case channels.instaplay?.id:{
                if (message.attachments.size < 1){
                    message.delete();
                    const embed = embedChat("danger", brBuilder(
                        "Você deve enviar imagens ou vídeos no canal:",
                        `${message.channel}`
                    ));
                    const row = createRow(
                        createLinkButton({ 
                            label: "Voltar para o canal instaplay",
                            url: channel.url, emoji: "📷",
                        })
                    );
                    message.author.send({ embeds: [embed], components: [row]})
                    .then(m => deleteMessage(m, 60000))
                    .catch(async () => {
                        deleteMessage(await channel.send({ embeds: [embed] }), 22000);
                    });
                    return;
                }
        
                message.react("❤️");
                message.react("🔥");
                message.react("👎");
                return;
            }
            case channels.concepts?.id:{
                message.react("❤️");
                message.react("🔥");
                message.react("👎");

                message.startThread({
                    name: "💬 Comentários",
                    autoArchiveDuration: ThreadAutoArchiveDuration.OneWeek
                });
                return;
            }
        }

    },
});