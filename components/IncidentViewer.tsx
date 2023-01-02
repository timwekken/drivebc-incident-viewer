import React, { useState, useEffect } from "react";
import axios from "axios";
import dayjs from "dayjs";
import { MajorEvent } from "../types/MajorEvent";
import MainMap from "./MainMap";
import ListPanel from "./ListPanel";
import { useRouter } from "next/router";

const IncidentViewer = ({ showDemo }: { showDemo?: boolean }) => {
  const router = useRouter();
  const { eventId } = router.query;
  const [majorEvents, setMajorEvents] = useState<MajorEvent[]>([]);
  const [hoveredEvent, setHoveredEvent] = useState<MajorEvent | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<
    MajorEvent | null | undefined
  >(undefined);

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
            const latestEvents = data
              .filter((event: any) => event[7] === "Major")
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
                    lat: Number(lat),
                    long: Number(long),
                    name: `${name} ${direction}`,
                    time: dayjs(String(time)),
                    description: String(description),
                  };
                }
              )
              .sort((a: MajorEvent, b: MajorEvent) => {
                return a?.time.diff(b?.time) > 0 ? -1 : 1;
              });
            setMajorEvents(latestEvents);
            const latestEventsIds = latestEvents.map(
              (event: MajorEvent) => event.id
            );
            axios
              .get("/api/get_events_with_polylines", {
                params: { eventIds: latestEventsIds },
              })
              .then(({ data }) => {
                const updatedEventsWithLines = latestEvents.map(
                  (event: MajorEvent) => {
                    const { _id, bbox, line } = data.find(
                      (data: any) => data._id == event.id
                    );
                    const updatedEvent = {
                      ...event,
                      bbox,
                      line,
                    };
                    if (_id === eventId) {
                      setSelectedEvent({
                        ...updatedEvent,
                        scrollToListItem: true,
                        fromURL: true,
                      });
                    }
                    return updatedEvent;
                  }
                );
                setMajorEvents(updatedEventsWithLines);
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
    !majorEvents.length ||
    !!(eventId && selectedEvent === undefined);

  return (
    <div className="flex flex-col sm:flex-row h-full max-h-screen">
      <MainMap
        majorEvents={majorEvents}
        hoveredEvent={hoveredEvent}
        setHoveredEvent={setHoveredEvent}
        selectedEvent={selectedEvent}
        setSelectedEvent={setSelectedEvent}
        isLoading={isLoading}
      />
      <ListPanel
        majorEvents={majorEvents}
        hoveredEvent={hoveredEvent}
        setHoveredEvent={setHoveredEvent}
        selectedEvent={selectedEvent}
        setSelectedEvent={setSelectedEvent}
        isLoading={isLoading}
      />
    </div>
  );
};

export default IncidentViewer;
