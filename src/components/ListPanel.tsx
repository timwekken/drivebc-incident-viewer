import React, { useState, useEffect, useRef, useCallback, FC } from "react";
import {
  EmailShareButton,
  EmailIcon,
  FacebookShareButton,
  TwitterShareButton,
  RedditShareButton,
  TwitterIcon,
  FacebookIcon,
} from "react-share";
import { MajorEvent } from "../types/MajorEvent";
import dayjs from "dayjs";
import WarningIcon from "./WarningIcon";
import Loader from "./Loader";

interface ListPanelProps {
  majorEvents: MajorEvent[];
  hoveredEvent: MajorEvent | null;
  setHoveredEvent: (event: MajorEvent | null) => void;
  selectedEvent?: MajorEvent | null;
  setSelectedEvent: (event: MajorEvent | null) => void;
  isLoading?: boolean;
}

const ListPanel: FC<ListPanelProps> = ({
  majorEvents,
  hoveredEvent,
  setHoveredEvent,
  selectedEvent,
  setSelectedEvent,
  isLoading,
}) => {
  const refs = majorEvents.reduce((acc: any, event: MajorEvent) => {
    acc[event.id] = React.createRef();
    return acc;
  }, {});

  useEffect(() => {
    const goToEvent = hoveredEvent || selectedEvent;
    if (goToEvent?.scrollToListItem) {
      refs[goToEvent.id].current.scrollIntoView({
        behavior: goToEvent?.fromURL ? "instant" : "smooth",
        block: "start",
      });
    }
  }, [hoveredEvent, selectedEvent]);

  return (
    <div
      className="flex-1 w-full h-full shadow-lg border-slate-200 border-l-[1px] overflow-auto md:max-w-md sm:border-top-[1px]"
      style={{ zIndex: 1 }}
    >
      {isLoading ? (
        <Loader />
      ) : (
        <ul className="w-full h-full">
          {majorEvents.map((event) => {
            const { id, name, time, description } = event;
            const isSelected =
              selectedEvent?.id === event?.id || hoveredEvent?.id === event?.id;

            return (
              <li key={id} ref={refs[event.id]}>
                <button
                  className={`w-full border-t-[1px] ${
                    isSelected
                      ? "border-t-[3px] p-6 bg-slate-50 border-[#d00]"
                      : "p-4 pl-6 pr-6 border-slate-200"
                  } hover:bg-slate-50 text-left`}
                  onClick={() => setSelectedEvent(event)}
                  // onMouseEnter={() => setHoveredEvent(event)}
                  // onMouseLeave={() => setHoveredEvent(null)}
                >
                  <div className={isSelected ? "text-black" : "text-slate-800"}>
                    <h2
                      className={`text-lg font-bold ${
                        isSelected && "text-[#d00]"
                      }`}
                    >
                      <span className="float-left mr-2 mt-[2px]">
                        <WarningIcon />
                      </span>
                      {name}
                      {/* <span className="float-right mr-2 mt-[2px]">
                      <EmailShareButton
                        url={window.location.href}
                        subject={name}
                        body={description}
                      >
                        <EmailIcon
                          size={32}
                          round
                          bgStyle={{ fill: "none" }}
                          iconFillColor="rgb(71 85 105)"
                        />
                      </EmailShareButton>
                      <TwitterShareButton url={window.location.href}>
                        <TwitterIcon
                          size={32}
                          round
                          bgStyle={{ fill: "none" }}
                          iconFillColor="rgb(71 85 105)"
                        />
                      </TwitterShareButton>
                      <FacebookShareButton url={window.location.href}>
                        <FacebookIcon
                          size={32}
                          round
                          bgStyle={{ fill: "none" }}
                          iconFillColor="rgb(71 85 105)"
                        />
                      </FacebookShareButton>
                    </span> */}
                    </h2>
                    <i className="text-slate-600">
                      {dayjs(time).format("MMMM D, YYYY h:mm A")}
                    </i>
                  </div>
                  {isSelected && <p className="pt-2">{description}</p>}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default ListPanel;
