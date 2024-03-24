import { z } from "zod";

export function isEmail(email: string){
    return z.string().email().safeParse(email).success;
}

export function isUrl(url: string){
    return z.string().url().safeParse(url).success;
}