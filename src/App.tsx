import React, { useState, useEffect } from "react";
import axios from "axios";

import dayjs, { Dayjs } from "dayjs";
import { MajorEvent } from "./types/MajorEvent";
import MainMap from "./components/MainMap";
import ListPanel from "./components/ListPanel";
import { useNavigate, useParams } from "react-router";
import Loader from "./components/Loader";

// TODO:
// Links in description
// Closest webcams
// Get users location and show that area??

const App = ({ showDemo }: { showDemo?: boolean }) => {
  const navigate = useNavigate();
  const { eventId } = useParams();
  const [majorEvents, setMajorEvents] = useState<MajorEvent[]>([]);
  const [hoveredEvent, setHoveredEvent] = useState<MajorEvent | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<
    MajorEvent | null | undefined
  >(undefined);

  useEffect(() => {
    axios
      .get(
        showDemo ? "/testData.json" : "https://www.drivebc.ca/data/events.json"
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
            .get("/api/v1/get_polylines", {
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
  }, []);

  useEffect(() => {
    if (selectedEvent) {
      if (selectedEvent?.id && selectedEvent?.id !== eventId) {
        // set the url to the selected event
        navigate(`/${showDemo ? "demo/" : ""}${selectedEvent?.id}`);
      }
    } else if (selectedEvent === null) {
      navigate(`/${showDemo ? "demo/" : ""}`);
    }
  }, [selectedEvent]);

  const isLoading =
    !majorEvents.length || !!(eventId && selectedEvent === undefined);

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

export default App;
