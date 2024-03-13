import { Schema } from "mongoose";
import { t } from "../utils.js";

interface GetGuildMember {
    id: string,
    guild: { id: string },
    displayName?: string
}

const rankSchema = new Schema({
    level: { type: Number, enum: [1, 2, 3, 4, 5] as const, default: 1, required: true },
    ["type"]: { type: String, enum: ["discord", "zunder"], default: "discord", required: true },
    nick: t.string,
    device: t.string,
}, { _id: false });

export const memberSchema = new Schema(
    {
        id: t.string,
        guildId: t.string,
        rank: rankSchema,
        wallet: {
            coins: { type: Number },
        },
        statistics:{
            donation: { type: Number }   
        }
    },
    {
        statics: {
            async get(member: GetGuildMember) {
                const query = { id: member.id, guildId: member.guild.id };
                return await this.findOne(query) ?? this.create({
                    ...query, rank: {
                        nick: member.displayName ?? "Sem nick",
                        device: "discord", type: "discord",
                        level: 1  
                    }
                });
            },
            async hasRegister(member: GetGuildMember){
                const query = { id: member.id, guildId: member.guild.id };
                return Boolean(await this.findOne({
                    ...query, "rank.level": { $gt: 0 }
                }));
            }
        }
    },
);