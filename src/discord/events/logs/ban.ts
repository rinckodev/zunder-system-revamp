import { Event } from "#base";
import { icon, sendGuildRecord } from "#functions";
import { brBuilder, createEmbedAsset } from "@magicyan/discord";
import chalk from "chalk";

new Event({
    name: `${chalk.bgHex("#bad63d")(" Logs ")} Member banned`,
    event: "userBanAdd",
    run(user, executor, reason, guild) {
        
        sendGuildRecord({ guild,
            title: "🔥 Banimento", color: "danger",
            thumbnail: createEmbedAsset(user.displayAvatarURL()),
            details: brBuilder(
                "- Foi banido do servidor",
                `${icon("pencil")} Motivo: \`${reason ?? "sem motivo"}\``
            ),
            target: user, executor,
        });
    },
});