import axios from "axios";
import dayjs from "dayjs";
import { Event, DriveBCRawEvent } from "../types/Event";

const CURRENT_EVENTS_URL = "https://www.drivebc.ca/data/events.json";
const DEMO_EVENTS_URL = "/testData.json";

/**
 * Get the current events from DriveBC
 * @param showDemo
 * @returns current events from DriveBC
 */
export const getEventsFromDriveBC = async (
  showDemo?: boolean
): Promise<Event[]> => {
  const { data } = await axios.get(
    showDemo ? DEMO_EVENTS_URL : CURRENT_EVENTS_URL
  );
  if (!data) {
    console.error("No data returned from DriveBC");
    return [];
  }
  return data
    .filter((event: DriveBCRawEvent) => event[0] === "INCIDENT") // TODO: Could expand beyond incidents?
    .map(
      ([
        type_caps,
        lat,
        long,
        area,
        name,
        direction,
        type,
        severity,
        time,
        description,
        eventCode,
      ]: DriveBCRawEvent) => ({
        id: String(eventCode),
        type: type_caps,
        lat: Number(lat),
        long: Number(long),
        name: `${name} ${direction}`,
        time: dayjs(String(time)),
        description: String(description),
        severity,
      })
    )
    .sort((a: Event, b: Event) => {
      return a?.time.diff(b?.time) > 0 ? -1 : 1;
    });
};

/**
 * Get the current event polylines from the DB
 * @param events
 * @returns Current events with attached polylines
 */
export const getEventPolylinesFromDB = async (
  events: Event[]
): Promise<Event[]> => {
  const eventIds = events.map((event: Event) => event.id);
  const { data } = await axios.get("/api/get_events_with_polylines", {
    params: { eventIds },
  });
  if (!data) {
    console.error("No polylines returned from DB");
    return events;
  }
  return events.map((event: Event) => {
    const { bbox, line } = data.find(
      (data: { _id: string }) => data._id == event.id
    );
    const updatedEvent = {
      ...event,
      bbox,
      line,
    };
    return updatedEvent;
  });
};
