import { Event } from "#base";
import { autoRegister } from "#functions";
import { sleep } from "@magicyan/discord";
import chalk from "chalk";

new Event({
    name: chalk.reset(`${chalk.bgHex("#b38b3b").white(" Register ")} Member join guild`),
    event: "guildMemberAdd",
    async run(member) {
        await sleep(2000);
        autoRegister(member);
    },
});