import { Schema } from "mongoose";
import { t } from "../utils.js";

const channelInfo = { id: String, url: String };

export const guildSchema = new Schema(
    {
        id: t.string,
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