import { Schema } from "mongoose";
import { t } from "../utils.js";

const channelInfo = new Schema({ id: t.string, url: t.string }, { _id: false });
const roleInfo =  new Schema({ id: t.string }, { _id: false });

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
        },
        ranks: {
            roles: {
                [5]: roleInfo,
                [4]: roleInfo,
                [3]: roleInfo,
                [2]: roleInfo,
                [1]: roleInfo,
            },
            types: {
                zunder: roleInfo,
                discord: roleInfo
            }
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