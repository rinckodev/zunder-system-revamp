import { Schema } from "mongoose";
import { t } from "../utils.js";

const resourceCategory = new Schema({
    id: t.string,
    title: t.string,
    description: t.string,
    emoji: { type: String, default: "📂" },
    channel: {
        type: t.channel,
        required: true
    },
    role: t.role,
    tags: [String]

}, { _id: false });

export const guildSchema = new Schema(
    {
        id: t.string,
        bank:{
            total: { type: Number, default: 0 }
        },
        channels: {
            logs: t.channel,
            general: t.channel,
            global: t.channel,
            announcement: t.channel,
            bank: t.channel,
            terms: t.channel,
            management: t.channel,
            records: t.channel,
            audit: t.channel,
            party: t.channel
        },
        ranks: {
            levels: {
                "5": t.role,
                "4": t.role,
                "3": t.role,
                "2": t.role,
                "1": t.role,
            },
            types: {
                zunder: t.role,
                discord: t.role
            }
        },
        resources: {
            categories: [resourceCategory]
        }
    },
    {
        statics: {
            async get(id: string) {
                return await this.findOne({ id }) ?? this.create({ id });
            }
        }
    }
);