import { resourcesMenu } from "./resources/index.js";
import { settingsMenu } from "./settings/index.js";

export const menus = {
    settings: settingsMenu,
    resources: resourcesMenu
} as const;