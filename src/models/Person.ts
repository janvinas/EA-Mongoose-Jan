import { model, Schema, Types } from "mongoose";

export interface IPerson {
    name: string,
    email?: string,
    _id?: Types.ObjectId,
}

const schema = new Schema<IPerson>({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: false,
    },
})

export const PersonModel = model("Person", schema);