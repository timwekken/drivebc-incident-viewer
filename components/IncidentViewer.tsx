import React, { FC, useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Event } from "../types/Event";
import {
  getEventsFromDriveBC,
  getEventPolylinesFromDB,
} from "../services/getEvents";
import MainMap from "./MainMap";
import ListPanel from "./ListPanel";

interface IncidentViewerProps {
  aboutBlurb: JSX.Element;
  showDemo?: boolean;
}

const IncidentViewer: FC<IncidentViewerProps> = ({ aboutBlurb, showDemo }) => {
  const router = useRouter();
  const { eventId } = router.query;

  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>();

  // Get events from DriveBC and polylines from DB
  // Ensure any event from the URL is selected
  const fetchEvents = async () => {
    const latestEvents = await getEventsFromDriveBC();
    setEvents(latestEvents);
    const latestEventsWithPolylineData = await getEventPolylinesFromDB(
      latestEvents
    );
    setEvents(latestEventsWithPolylineData);
    const selectedEvent = latestEventsWithPolylineData.find(
      ({ id }) => id === eventId
    );
    setSelectedEvent(
      selectedEvent
        ? { ...selectedEvent, scrollToListItem: true, fromURL: true }
        : null
    );
  };

  useEffect(() => {
    if (router.isReady) {
      fetchEvents();
    }
  }, [router.isReady]);

  useEffect(() => {
    if (selectedEvent) {
      if (selectedEvent?.id && selectedEvent?.id !== eventId) {
        // set the url to the selected event
        router.push(
          `/${showDemo ? "dec24demo/" : ""}?eventId=${selectedEvent?.id}`,
          undefined,
          { shallow: true }
        );
      }
    } else if (selectedEvent === null) {
      router.push(`/${showDemo ? "dec24demo/" : ""}`, undefined, {
        shallow: true,
      });
    }
  }, [selectedEvent]);

  const isLoading =
    !router.isReady ||
    !events.length ||
    !!(eventId && selectedEvent === undefined);

  return (
    <div className="flex flex-col sm:flex-row h-full max-h-full">
      <MainMap
        aboutBlurb={aboutBlurb}
        events={events}
        selectedEvent={selectedEvent}
        setSelectedEvent={setSelectedEvent}
        isLoading={isLoading}
      />
      <ListPanel
        events={events}
        selectedEvent={selectedEvent}
        setSelectedEvent={setSelectedEvent}
        isLoading={!events.length}
      />
    </div>
  );
};

export default IncidentViewer;
