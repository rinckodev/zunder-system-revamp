import { Event } from "#base";
import { autoRegister } from "#functions";
import { sleep } from "@magicyan/discord";
import chalk from "chalk";

new Event({
    name: chalk.reset(`${chalk.bgHex("#b38b3b").white(" Register ")} Member send message`),
    event: "messageCreate",
    async run(message) {
        if (!message.member) return;
        await sleep(2000);
        autoRegister(message.member);
    },
});