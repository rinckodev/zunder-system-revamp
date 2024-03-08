import { Event } from "#base";
import { sendGuildRecord, icon } from "#functions";
import { brBuilder, createEmbedAsset } from "@magicyan/discord";
import chalk from "chalk";

new Event({
    name: `${chalk.bgHex("#bad63d")(" Logs ")} Member kicked`,
    event: "userKick",
    run(user, executor, reason, guild) {
        
        sendGuildRecord({
            guild,
            title: "👢 Expulsão", color: "danger",
            thumbnail: createEmbedAsset(user.displayAvatarURL()),
            details: brBuilder(
                "- Foi expulso do servidor",
                `${icon("pencil")} Motivo: \`${reason ?? "sem motivo"}\``
            ),
            target: user, executor,
        });
    },
});