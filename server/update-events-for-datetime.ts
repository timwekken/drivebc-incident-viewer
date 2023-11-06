import axios from "axios";
import { getDB } from "./db-connection";
import EventRepository from "./event-repository";

const CURRENT_EVENTS_URL = "https://www.drivebc.ca/data/events.json";

/**
 * Updates the events collection in the database with data fetched from drivebc
 * This is used to track the historical events for a given datetime (not yet visible in the UI)
 * @returns {Promise<string>} A promise that resolves to a success message on updating events.
 * @throws {Error} Throws an error if the update process fails.
 */
const updateEventsForDatetime = async () => {
  try {
    // Get the JSON data from drivebc
    const response = await axios.get(CURRENT_EVENTS_URL);
    // Add the events to the mongodb collection
    const db = await getDB();
    await new EventRepository(db).insertCollection(response.data);
    return "Events updated successfully";
  } catch (error) {
    console.error("Error updating events:", error);
    throw new Error("Failed to update events");
  }
};

export default updateEventsForDatetime;
