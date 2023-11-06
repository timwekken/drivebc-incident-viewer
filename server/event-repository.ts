import { Db, Collection, Document, InsertOneResult } from "mongodb";
import { Event } from "../types/Event";

const EVENTS_COLLECTION = "events";
const EVENTS_JSON_COLLECTION = "eventsJSON";

export default interface EventRepositoryInterface {
  get(eventIds: string[]): Promise<Document[]>;
  insert(event: Event): Promise<InsertOneResult<Document>>;
  insertCollection(eventsJSON: Event[]): Promise<InsertOneResult<Document>>;
}

export default class EventRepository implements EventRepositoryInterface {
  private eventsCollection: Collection<Document>;
  private eventsJSONCollection: Collection<Document>;

  /**
   * Constructs an EventRepository.
   * @param {Db} db - MongoDB database instance.
   */
  constructor(db: Db) {
    this.eventsCollection = db.collection(EVENTS_COLLECTION);
    this.eventsJSONCollection = db.collection(EVENTS_JSON_COLLECTION);
  }

  /**
   * Retrieve events by their IDs.
   * @param {string[]} eventIds - Array of event IDs to retrieve.
   * @returns {Promise<Document[]>} A promise that resolves with an array of documents.
   */
  async get(eventIds: string[]): Promise<Document[]> {
    try {
      return await this.eventsCollection
        .find({ _id: { $in: eventIds } })
        .limit(100)
        .toArray();
    } catch (error) {
      console.error(`Error fetching events: ${error}`);
      throw new Error("Failed to fetch events");
    }
  }

  /**
   * Insert a single event.
   * @param {Event} event - The event to be inserted.
   * @returns {Promise<InsertOneResult<Document>>} A promise that resolves with the insertion result.
   */
  async insert(event: Event): Promise<InsertOneResult<Document>> {
    try {
      const result = await this.eventsCollection.insertOne(event);
      console.log(`Added a new event with id ${result.insertedId}`);
      return result;
    } catch (error) {
      console.error(`Error inserting event: ${error}`);
      throw new Error("Failed to insert event");
    }
  }

  /**
   * Insert a collection of events in JSON format.
   * This is used to track the historical events for a given datetime (not yet visible in the UI)
   * @param {Event[]} eventsJSON - Array of events in JSON format.
   * @returns {Promise<InsertOneResult<Document>>} A promise that resolves with the insertion result.
   */
  async insertCollection(
    eventsJSON: Event[]
  ): Promise<InsertOneResult<Document>> {
    try {
      const result = await this.eventsJSONCollection.insertOne({
        timestamp: Date.now(),
        events: eventsJSON,
      });
      console.log(`Added a new event collection for time ${Date.now()}`);
      return result;
    } catch (error) {
      console.error(`Error inserting event collection: ${error}`);
      throw new Error("Failed to insert event collection");
    }
  }
}
