import dbo from "./db-connection";
import axios from "axios";
import polyline from "@mapbox/polyline";

const EVENTS_JSON_COLLECTION = "eventsJSON";

const getEventsForDatetime = async (date: string) => {
  const dbConnect = dbo.getDb();
  return new Promise((resolve, reject) => {
    // get exisitng polylines from the db
    dbConnect
      .collection(EVENTS_JSON_COLLECTION)
      .find({ _id: { $in: date } })
      .toArray()
      .then(async (events: any) => {
        // console.log("RESULTS", events);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export default getEventsForDatetime;
