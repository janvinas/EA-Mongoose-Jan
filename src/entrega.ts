import mongoose from 'mongoose';
import { CalendarEventModel, ICalendarEvent, Priority } from './models/CalendarEvent.js';
import { IPerson, PersonModel } from './models/Person.js';

async function main(){
    mongoose.set('strictQuery', true);
    await mongoose.connect('mongodb://localhost:27017/calendar')
        .then(() => console.log("Database is connected"))
        .catch(() => console.log("Error connecting to database"));

    mongoose.connection.on('error', (err) => console.log(err));

    // create new people (C)
    const person1 = new PersonModel({
        name: "Marc Pérez",
        email: "marcperez@mail.com"
    } as IPerson);
    person1.save();

    const person2 = new PersonModel({
        name: "Marta González",
    } as IPerson);
    person2.save();

    // create new events (C)
    const event1 = new CalendarEventModel({
        name: "Classe EA",
        date: new Date("2025-03-04T11:00Z"),
        location: "EETAC",
        priority: Priority.High,
    } as ICalendarEvent);
    await event1.save();

    const event2 = new CalendarEventModel({
        name: "Dinar",
        date: new Date("2025-03-05T13:00Z"),
        people: [person1._id, person2._id],
    } as ICalendarEvent);
    await event2.save();

    const event3 = new CalendarEventModel({
        name: "Reunió",
        date: new Date("2025-03-05T15:00Z"),
        people: [person1._id],
    } as ICalendarEvent);
    await event3.save();

    // find calendar events (R)
    console.log("Get all events from the calendar");
    const events = await CalendarEventModel.find();
    console.log(events);

    console.log("Get events with Medium priority");
    const important = await CalendarEventModel.find({priority: Priority.Medium});
    console.log(important);

    // update calendar events (U)
    console.log("Change priority of events from medium to low");
    await CalendarEventModel.updateMany({priority: Priority.Medium}, {priority: Priority.Low});
    console.log("Set location of 'Dinar' to 'Castelldefels'")
    const dinar = await CalendarEventModel.findOne({name: "Dinar"});
    if(dinar){
        dinar.location = "Castelldefels";
        await dinar.save();
    }

    console.log(await CalendarEventModel.find());

    // embedded documents
    console.log("Get document with another embedded document");
    const populatedDocument = await CalendarEventModel.findOne({name: "Dinar"}).populate<{people: IPerson[]}>("people");
    if(populatedDocument){
        console.log(populatedDocument);
        console.log(populatedDocument.people[0].name);
    }

    // aggregation pipeline
    console.log("Aggregation pipeline example");
    const output = await CalendarEventModel.aggregate([
        {$match: {date: {$gt: new Date()}}},
        {$match: {priority: Priority.Low}},
        {$count: "numLowPriority"},
    ])
    console.log(output);
    console.log(output.at(0).numLowPriority);

    // delete calendar events(D)
    console.log("Delete events");
    const result = await CalendarEventModel.deleteMany({priority: Priority.High});
    console.log(result);
    console.log(await CalendarEventModel.find());
}

main();