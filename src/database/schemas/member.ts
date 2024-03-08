import { Schema } from "mongoose";
import { t } from "../utils.js";

const rankSchema = new Schema({
    level: { type: Number, enum: [1, 2, 3, 4, 5], default: 1, required: true },
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
            coins: { type: Number, default: 0 },
        }
    },
    {
        statics: {
            async get(member: { id: string, guild: { id: string } }) {
                const query = { id: member.id, guildId: member.guild.id };
                return await this.findOne(query) ?? this.create(query);
            }
        }
    },
);