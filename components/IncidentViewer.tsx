import React, { useState, useEffect } from "react";
import axios from "axios";
import dayjs from "dayjs";
import { Event } from "../types/Event";
import MainMap from "./MainMap";
import ListPanel from "./ListPanel";
import { useRouter } from "next/router";

const IncidentViewer = ({ showDemo }: { showDemo?: boolean }) => {
  const router = useRouter();
  const { eventId } = router.query;

  const [events, setEvents] = useState<Event[]>([]);
  const [hoveredEvent, setHoveredEvent] = useState<Event | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<Event | null | undefined>(
    undefined
  );

  useEffect(() => {
    if (router.isReady) {
      axios
        .get(
          showDemo
            ? "/testData.json"
            : "https://www.drivebc.ca/data/events.json"
        )
        .then(({ data }) => {
          if (data) {
            console.log(data.filter((event: any) => event[0] === "INCIDENT"));
            const latestEvents = data
              .filter((event: any) => event[0] === "INCIDENT")
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
                ]: any) => {
                  return {
                    id: String(eventCode),
                    type: type_caps,
                    lat: Number(lat),
                    long: Number(long),
                    name: `${name} ${direction}`,
                    time: dayjs(String(time)),
                    description: String(description),
                    severity,
                  };
                }
              )
              .sort((a: Event, b: Event) => {
                return a?.time.diff(b?.time) > 0 ? -1 : 1;
              });
            setEvents(latestEvents);
            const latestEventsIds = latestEvents.map(
              (event: Event) => event.id
            );
            axios
              .get("/api/get_events_with_polylines", {
                params: { eventIds: latestEventsIds },
              })
              .then(({ data }) => {
                let hasSelectedEvent = false;
                const updatedEventsWithLines = latestEvents.map(
                  (event: Event) => {
                    const { _id, bbox, line } = data.find(
                      (data: any) => data._id == event.id
                    );
                    const updatedEvent = {
                      ...event,
                      bbox,
                      line,
                    };
                    if (_id === eventId) {
                      hasSelectedEvent = true;
                      setSelectedEvent({
                        ...updatedEvent,
                        scrollToListItem: true,
                        fromURL: true,
                      });
                    }
                    return updatedEvent;
                  }
                );
                setEvents(updatedEventsWithLines);
                if (!hasSelectedEvent) {
                  setSelectedEvent(null);
                }
              });
          }
        });
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
        events={events}
        hoveredEvent={hoveredEvent}
        setHoveredEvent={setHoveredEvent}
        selectedEvent={selectedEvent}
        setSelectedEvent={setSelectedEvent}
        isLoading={isLoading}
      />
      <ListPanel
        events={events}
        hoveredEvent={hoveredEvent}
        setHoveredEvent={setHoveredEvent}
        selectedEvent={selectedEvent}
        setSelectedEvent={setSelectedEvent}
        isLoading={!events.length}
      />
    </div>
  );
};

export default IncidentViewer;
