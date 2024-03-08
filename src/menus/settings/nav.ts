import { icon } from "#functions";
import { ButtonBuilder, ButtonStyle } from "discord.js";

export const settingsNav = {
    main: new ButtonBuilder({
        customId: "menu/settings/main",
        label: "Menu principal",
        emoji: icon("home"),
        style: ButtonStyle.Danger,
    }),
    previous(menu: string){
        return new ButtonBuilder({
            customId: `menu/settings/${menu}`,
            label: "Voltar",
            emoji: icon("previous"),
            style: ButtonStyle.Danger,
        });
    }
};