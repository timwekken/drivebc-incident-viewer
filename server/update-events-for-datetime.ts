import { ObjectId } from "mongodb";
import dbo from "./db-connection";
import axios from "axios";

const EVENTS_JSON_COLLECTION = "eventsJSON";

const updateEventsForDatetime = async () => {
  const dbConnect = dbo.getDb();
  return new Promise(async (resolve, reject) => {
    // Get the json from https://www.drivebc.ca/data/events.json
    const eventsJSON = await axios.get("https://www.drivebc.ca/data/events.json");
    // Add the events to the mongodb collection
    dbConnect.collection(EVENTS_JSON_COLLECTION).insertOne({
      timestamp: new Date().getTime(),
      events: eventsJSON.data,
    });
  });
};

export default updateEventsForDatetime;
