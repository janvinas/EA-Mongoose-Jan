import { model, Schema, Types } from "mongoose";
import { PersonModel } from "./Person.js";

export enum Priority {
    High = "HIGH",
    Medium = "MEDIUM",
    Low = "LOW",
}

export interface ICalendarEvent {
    name: string;
    date: Date;
    people: Types.ObjectId[];
    location?: string;
    priority?: Priority;
    _id?: Types.ObjectId;
}

const schema = new Schema<ICalendarEvent>({
    name: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true,     
    },
    people: [{
        type: Schema.Types.ObjectId,
        ref: PersonModel,
    }],
    location: {
        type: String,
        required: false,
    },
    priority: {
        type: String,
        default: Priority.Medium,
    }
});

export const CalendarEventModel = model("Event", schema);