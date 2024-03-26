import { Schema } from "mongoose";
import { t } from "../utils.js";
import { ButtonStyle } from "discord.js";

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

const guildChannels = new Schema({
    logs: t.channel,
    general: t.channel,
    global: t.channel,
    announcement: t.channel,
    bank: t.channel,
    terms: t.channel,
    information: t.channel,
    management: t.channel,
    records: t.channel,
    audit: t.channel,
    party: t.channel,
    presentations: t.channel,
    instaplay: t.channel,
    concepts: t.channel,
}, { _id: false });

const guildInformation = new Schema({
    title: t.string,
    description: t.string,
    emoji: String,
    style: {
        type: Number,
        enum: [
            ButtonStyle.Primary, 
            ButtonStyle.Secondary, 
            ButtonStyle.Success, 
            ButtonStyle.Danger
        ] as const,
        default: ButtonStyle.Primary
    }
}, { _id: false });

export const guildSchema = new Schema(
    {
        id: t.string,
        bank:{
            total: { type: Number, default: 0 }
        },
        channels: {
            type: guildChannels,
            default: {},
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
        },
        information: [guildInformation]
    },
    {
        statics: {
            async get(id: string) {
                return await this.findOne({ id }) ?? this.create({ id });
            }
        }
    }
);