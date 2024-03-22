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
    },
    menus: {
        multimenu:{
            buttons: {
                previous: { emoji: icon("previous"), label: "", },
                home: { emoji: icon("home"), label: "", },
                next: { emoji: icon("next"), label: "", },
                close: { emoji: icon("cancel"), label: "", },
            }
        },
        pagination: {
            buttons: {
                previous: { emoji: icon("previous"), label: "", },
                home: { emoji: icon("home"), label: "", },
                next: { emoji: icon("next"), label: "", },
                close: { emoji: icon("cancel"), label: "", },
            }
        }
    }
});