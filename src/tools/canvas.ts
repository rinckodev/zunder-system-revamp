import { log } from "#settings";
import { GlobalFonts } from "@magicyan/canvas";
import chalk from "chalk";
import glob from "fast-glob";
import { basename } from "path";

export async function initCanvas(){
    const paths = await glob("./assets/fonts/**", { cwd: __rootname, onlyDirectories: true });

    for(const path of paths){
        const fonts = GlobalFonts.loadFontsFromDir(path);
        log.success(chalk.magenta(`${chalk.underline(basename(path))} ${fonts} fonts loaded `));
    }

    console.table(
        GlobalFonts.getFamilies()
    );
}