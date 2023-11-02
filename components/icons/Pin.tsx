import * as React from "react";

import { BASE_PIN_ICON, getSvgIconFromType } from "./PinIcons";

function Pin({
  selected = false,
  hasSelected = false,
  isMajor = false,
  type = "",
  description = "",
  onMouseEnter = () => {},
  onMouseLeave = () => {},
}) {
  const pinDefaultClass = `stroke-background stroke-${selected ? "2" : "1"}`;

  const getPinSvgFromType = () => {
    const svg = getSvgIconFromType(type, description);
    if (svg) {
      return (
        <svg
          height={selected ? 24 : 18}
          viewBox={svg.viewBox}
          className={`
            ${pinDefaultClass}
            fill-background
            opacity-90
            absolute
            w-full
            text-center
            cursor-pointer
            ${selected ? "top-[6px] p-[5px]" : "top-[4px] p-[4px]"}
          `}
        >
          <path d={svg.path} />
        </svg>
      );
    }
    return (
      <p
        className={`
          text-background
          opacity-80
          absolute
          m-0W
          w-full
          text-center
          font-bold
          ${selected ? "top-[8px] text-[18px]" : "top-[4px] text-[15px]"}
        `}
      >
        !
      </p>
    );
  };

  return (
    <div onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
      <svg
        height={selected ? 40 : 30}
        viewBox={BASE_PIN_ICON.viewBox}
        className={`${pinDefaultClass} ${
          selected || !hasSelected
            ? isMajor
              ? "fill-major"
              : "fill-warning"
            : "fill-default"
        }`}
      >
        <path d={BASE_PIN_ICON.path} />
      </svg>
      {getPinSvgFromType()}
    </div>
  );
}

export default React.memo(Pin);
