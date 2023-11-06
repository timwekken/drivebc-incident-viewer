import axios from "axios";
import polyline from "@mapbox/polyline";
import { getDB } from "./db-connection";
import EventRepository from "./event-repository";

/**
 * Generates and saves missing events with polylines in the database.
 * @param {string[]} missingEventIds - An array of event IDs that are missing in the database.
 * @returns {Promise<Array<any>>} A promise that resolves to an array of event documents added.
 */
const _generateAndSaveMissingEventsWithPolylines = async (
  missingEventIds: string[]
): Promise<Array<any>> => {
  const eventDocuments = await Promise.all(
    missingEventIds.map(async (eventId) => {
      try {
        // get polyline from the drivebc api
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
        // insert the polyline into the db
        const db = await getDB();
        await new EventRepository(db).insert(eventDocument);
        return eventDocument;
      } catch (err) {
        console.error("Error inserting matches", err);
        return null; // Return null for failed document insertion
      }
    })
  );
  return eventDocuments.filter((event) => event !== null);
};

/**
 * Retrieves events with polylines for the provided event IDs.
 * @param {string[]} eventIds - An array of event IDs to retrieve from the database.
 * @returns {Promise<Array<any>>} A promise that resolves to an array of events with polylines.
 * @throws {Error} Throws an error if the fetching process fails.
 */
const getEventsWithPolylines = async (
  eventIds: string[]
): Promise<Array<any>> => {
  try {
    // get exisiting polylines from the db
    const db = await getDB();
    const eventsWithPolylines = await new EventRepository(db).get(eventIds);
    // figure out what events don't have a polyline yet
    const existingEventIds = eventsWithPolylines.map((event) =>
      String(event._id)
    );
    const missingEventIds = eventIds.filter(
      (eventId) => !existingEventIds.includes(eventId)
    );
    // generate and save polylines for the missing events
    const newlyGeneratedEventsWithPolylines =
      await _generateAndSaveMissingEventsWithPolylines(missingEventIds);
    return [...eventsWithPolylines, ...newlyGeneratedEventsWithPolylines];
  } catch (err) {
    console.error("Error fetching or updating events with polylines:", err);
    throw err;
  }
};

export default getEventsWithPolylines;
