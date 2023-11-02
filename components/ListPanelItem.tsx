import React, { FC, useRef, useEffect } from "react";
import dayjs from "dayjs";
import { Event } from "../types/Event";
import WarningIcon from "./icons/WarningIcon";
import { getSvgIconFromType } from "./icons/PinIcons";
import next from "next";

interface ListPanelItemProps {
  event: Event;
  isSelected: boolean;
  scrollToListItem?: boolean;
  onClick: () => void;
}

const ListPanelItem: FC<ListPanelItemProps> = ({
  event,
  isSelected,
  scrollToListItem,
  onClick,
}) => {
  const ref = useRef<HTMLLIElement>(null);

  // Get event details to display
  const { id, type, name, time, description } = event;
  const isMajor = event?.severity === "Major";
  const svg = getSvgIconFromType(type, description);
  const [mainDescription, nextUpdateText, nextUpdateTime] = description.split(
    /\b(next update|last updated)\b/i
  );

  // Scroll to the event when it is selected (can be selected via the map)
  const scrollToEvent = () => {
    if (scrollToListItem && ref.current) {
      ref.current.scrollIntoView({
        behavior: "instant", // could have it scroll like this: goToEvent?.fromURL ? "instant" : "smooth",
        block: "start",
      });
    }
  };

  useEffect(() => {
    if (isSelected) {
      scrollToEvent();
    }
  }, [isSelected]);

  return (
    <li key={id} ref={ref}>
      <button
        className={`w-full border-t-[1px] ${
          isSelected
            ? `border-t-[3px] p-6 bg-slate-50 ${
                isMajor ? "border-major" : "border-warning"
              }`
            : "p-4 pl-6 pr-6 border-slate-200"
        } hover:bg-slate-50 text-left`}
        onClick={() => onClick()}
      >
        <div className={isSelected ? "text-black" : "text-slate-800"}>
          <h2
            className={`text-lg font-bold ${
              isSelected && `${isMajor ? "text-major" : "text-warning"}`
            }`}
          >
            <span className="float-left mr-2 mt-[2px]">
              {svg ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox={svg.viewBox}
                  strokeWidth="1.5"
                  stroke="none"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d={svg.path}
                  />
                </svg>
              ) : (
                <WarningIcon />
              )}
            </span>
            {name}
          </h2>
          <i className="text-slate-600">
            {dayjs(time).format("MMMM D, YYYY h:mm A")}
          </i>
        </div>
        {isSelected && (
          <>
            <p className="pt-2">{mainDescription}</p>
            {nextUpdateTime && (
              <p className="pt-2 italic text-slate-600">
                {nextUpdateText}
                {nextUpdateTime}
              </p>
            )}
          </>
        )}
      </button>
    </li>
  );
};

export default ListPanelItem;
