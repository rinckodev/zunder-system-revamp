import { resourcesCreateMenu } from "./create.js";
import { resourcesEditMenu } from "./edit.js";

export const resourcesMenu = {
    create: resourcesCreateMenu,
    edit: resourcesEditMenu,
} as const;