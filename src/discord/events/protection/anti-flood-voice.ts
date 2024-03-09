import { Event, Store } from "#base";
import { db } from "#database";
import { icon, deleteMessage } from "#functions";
import { settings } from "#settings";
import { createEmbed, createEmbedAsset, brBuilder, createEmbedFooter, createRow, createLinkButton, toNull, findChannel } from "@magicyan/discord";
import chalk from "chalk";
import { time, spoiler } from "discord.js";

const store = new Store<number>();

new Event({
    name: chalk.reset(`${chalk.bgHex("#3bb349").white(" Protection ")} Anti flood voice`),
    event: "guildMemberConnect",
    async run(member) {
        const { guild } = member;

        const key = `${guild.id}-${member.id}`;
        const times = store.get(key) ?? 0;

        if (times >= 3){
            const { channels } = await db.guilds.get(guild.id);

            const future = new Date();
            future.setSeconds(future.getSeconds() + 65);
            
            const embed = createEmbed({
                thumbnail: createEmbedAsset(member.displayAvatarURL()),
                color: settings.colors.danger,
                description: brBuilder(
                    `${member} evite entrar e sair dos canais de voz`,
                    " repetidamente em um curto período de tempo.",
                    "",
                    `${icon("block")} Você recebeu um castigo temporário`,
                    `${icon("clock")} Expira ${time(future, "R")}`,
                    "",
                    `${icon("book")} Leia os termos do servidor para evitar punições`
                ),
                footer: createEmbedFooter({
                    text: "Administração Zunder",
                    iconURL: member.guild.iconURL()
                }),
                timestamp: new Date()
            });

            const row = createRow(
                createLinkButton({
                    url: channels?.terms?.url ?? "https://discord.com",
                    label: "Leia os termos",
                    emoji: "📜"
                })
            );

            const options = { content: spoiler(`${member}`), embeds: [embed], components: [row] };

            if (member.id !== guild.ownerId){
                member.timeout(60 * 1000, "Flood em call").catch(toNull);
            }

            const message = await member.send(options)
            .catch(async () => {
                
                const generalChannel = findChannel(guild).byId(channels?.general?.id ?? "");
                if (!generalChannel) return;

                return generalChannel.send(options);
            });
            if (message) deleteMessage(message, 60 * 1000);
            return;
        }

        store.set(key, times+1, null);
        setTimeout(() => {
            const times = store.get(key) ?? 0;
            store.set(key, times-1);
            if (times-1 < 1) store.delete(key);
        }, 6000);
    },
});