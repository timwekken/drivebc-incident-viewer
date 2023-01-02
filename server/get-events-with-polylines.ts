import dbo from "./db-connection";
import axios from "axios";
import polyline from "@mapbox/polyline";

const EVENTS_COLLECTION = "events";

const generateAndSaveMissingEventsWithPolylines = async (
  missingEventIds: string[]
) => {
  const dbConnect = dbo.getDb();
  return await Promise.all(
    missingEventIds.map(async (eventId) => {
      const { data } = await axios.get(
        `https://maps.th.gov.bc.ca/geoV05/ows?&SERVICE=WFS&VERSION=1.0.0&REQUEST=GetFeature&SRS=EPSG%3A4326&` +
          `typeName=OP5_EVENT511_V&maxFeatures=1&outputFormat=application%2Fjson&CQL_FILTER=SOURCE_ID%3D%27${eventId}%27`
      );
      const bbox = data?.features?.[0]?.bbox;
      const coords = data?.features?.[0]?.geometry?.coordinates;
      const line = polyline.encode(coords);
      const eventDocument: any = {
        _id: eventId,
        bbox,
        line,
      };
      dbConnect
        .collection(EVENTS_COLLECTION)
        .insertOne(eventDocument)
        .then((result) => {
          console.log(`Added a new match with id ${result.insertedId}`);
        })
        .catch((err) => {
          console.log("Error inserting matches!", err);
        });
      return eventDocument;
    })
  );
};

const getEventsWithPolylines = async (eventIds: string[]) => {
  const dbConnect = dbo.getDb();
  return new Promise((resolve, reject) => {
    // get exisitng polylines from the db
    dbConnect
      .collection(EVENTS_COLLECTION)
      .find({ _id: { $in: eventIds } })
      .limit(100)
      .toArray()
      .then(async (eventsWithPolylines: any) => {
        // console.log("RESULTS", eventsWithPolylines);
        const existingEventIds: string[] = eventsWithPolylines.map(
          (event: any) => event._id
        );
        const missingEventIds = eventIds.filter(
          (eventId) => !existingEventIds.includes(eventId)
        );
        const newlyGeneratedEventsWithPolylines =
          await generateAndSaveMissingEventsWithPolylines(missingEventIds);
        // console.log("NEW", missingEventIds, newlyGeneratedEventsWithPolylines);
        resolve([...eventsWithPolylines, ...newlyGeneratedEventsWithPolylines]);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export default getEventsWithPolylines;
