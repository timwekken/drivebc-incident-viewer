import React, { useEffect, FC, Ref, useState } from "react";
import { Event } from "../types/Event";
import Loader from "./Loader";
import ListPanelItem from "./ListPanelItem";

interface ListPanelProps {
  events: Event[];
  selectedEvent?: Event | null;
  setSelectedEvent: (event: Event | null) => void;
  isLoading?: boolean;
}

const ListPanel: FC<ListPanelProps> = ({
  events,
  selectedEvent,
  setSelectedEvent,
  isLoading,
}) => (
  <div
    className="flex-[2] w-full h-full shadow-lg 
                border-slate-200 border-l-[1px] overflow-auto 
                md:max-w-md sm:border-top-[1px] z-1"
  >
    {isLoading ? (
      <Loader />
    ) : (
      <ul className="w-full h-full">
        {events.map((event) => (
          <ListPanelItem
            key={event.id}
            event={event}
            isSelected={selectedEvent?.id === event?.id}
            scrollToListItem={selectedEvent?.scrollToListItem}
            onClick={() => setSelectedEvent(event)}
          />
        ))}
      </ul>
    )}
  </div>
);

export default ListPanel;
