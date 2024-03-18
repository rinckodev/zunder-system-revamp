import { profileMenu } from "./profile/index.js";
import { resourcesMenu } from "./resources/index.js";
import { settingsMenu } from "./settings/index.js";

export const menus = {
    settings: settingsMenu,
    resources: resourcesMenu,
    profile: profileMenu
} as const;