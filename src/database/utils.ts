import { Schema } from "mongoose";

const p = {
   string: { type: String, required: true },
   number: { type: Number, required: true },
   boolean: { type: Number, required: true },
};

const channel = new Schema({ id: p.string, url: p.string }, { _id: false });
const role =  new Schema({ id: p.string }, { _id: false });

export const t = {
   ...p, channel, role
} as const;