import { Schema } from "mongoose";
import { t } from "../utils.js";

const channelInfo = new Schema({ id: t.string, url: t.string }, { _id: false });
const roleInfo =  new Schema({ id: t.string }, { _id: false });

const resourceCategory = new Schema({
    id: t.string,
    title: t.string,
    description: t.string,
    emoji: { type: String, default: "📂" },
    channel: {
        type: channelInfo,
        required: true
    },
    role: roleInfo

}, { _id: false });

export const guildSchema = new Schema(
    {
        id: t.string,
        bank:{
            total: { type: Number, default: 0 }
        },
        channels: {
            logs: channelInfo,
            general: channelInfo,
            global: channelInfo,
            announcement: channelInfo,
            bank: channelInfo,
            terms: channelInfo,
            management: channelInfo,
            records: channelInfo,
            audit: channelInfo,
            party: channelInfo
        },
        ranks: {
            levels: {
                "5": roleInfo,
                "4": roleInfo,
                "3": roleInfo,
                "2": roleInfo,
                "1": roleInfo,
            },
            types: {
                zunder: roleInfo,
                discord: roleInfo
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