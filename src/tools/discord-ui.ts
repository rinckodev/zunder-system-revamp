import { icon } from "#functions";
import { discordUi } from "@magicyan/discord-ui";

discordUi({
    prompts: {
        confirm: {
            buttons: {
                confirm: {
                    label: "Confirmar",
                    emoji: icon("check")
                },
                cancel: {
                    label: "Cancelar",
                    emoji: icon("cancel")
                }
            }
        }
    }
});