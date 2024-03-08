import { settingsChannelMenu, settingsChannelsMenu, settingsChannelsSelectOptions } from "./channel.js";
import { settingsMainMenu } from "./main.js";

export const settingsMenu = {
    main: settingsMainMenu,
    channels: {
        submenu: settingsChannelMenu,
        menu: settingsChannelsMenu,
        options: settingsChannelsSelectOptions
    }
};