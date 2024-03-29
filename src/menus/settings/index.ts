import { settingsAIBotMenu } from "./aibot.js";
import { settingsChannelMenu, settingsChannelsMenu, settingsChannelsSelectOptions } from "./channel.js";
import { settingsInformationMenu, settingsInformationsMenu } from "./information.js";
import { settingsMainMenu } from "./main.js";
import { settingsRanksLevelMenu, settingsRanksLevelsMenu, settingsRanksLevelsSelectOptions } from "./ranks/levels.js";
import { settingsRanksMenu } from "./ranks/main.js";
import { settingsRanksTypeMenu, settingsRanksTypesMenu, settingsRanksTypesSelectOptions } from "./ranks/types.js";

export const settingsMenu = {
    main: settingsMainMenu,
    channels: {
        submenu: settingsChannelMenu,
        menu: settingsChannelsMenu,
        options: settingsChannelsSelectOptions
    },
    ranks: {
        menu: settingsRanksMenu,
        types: {
            menu: settingsRanksTypesMenu,
            options: settingsRanksTypesSelectOptions,
            submenu: settingsRanksTypeMenu
        },
        levels: {
            options: settingsRanksLevelsSelectOptions,
            menu: settingsRanksLevelsMenu,
            submenu: settingsRanksLevelMenu
        }
    },
    information: {
        main: settingsInformationsMenu,
        submenu: settingsInformationMenu,
    },
    aibot: {
        main: settingsAIBotMenu,
    }
} as const;