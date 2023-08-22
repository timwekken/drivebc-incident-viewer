import * as React from "react";

import {
  MAJOR_COLOR,
  WARNING_COLOR,
  SECONDARY_COLOR,
  TERTIARY_COLOR,
} from "../styles/colors";
import { getSvgIconFromType } from './Icons';

const BASE_PIN_ICON = {
  viewBox: "0 -3 24 29",
  path: `M20.2,15.7L20.2,15.7c1.1-1.6,1.8-3.6,1.8-5.7c0-5.6-4.5-10-10-10S2,4.5,2,10c0,2,0.6,3.9,1.6,5.4c0,0.1,0.1,0.2,0.2,0.3
  c0,0,0.1,0.1,0.1,0.2c0.2,0.3,0.4,0.6,0.7,0.9c2.6,3.1,7.4,7.6,7.4,7.6s4.8-4.5,7.4-7.5c0.2-0.3,0.5-0.6,0.7-0.9
  C20.1,15.8,20.2,15.8,20.2,15.7z`
};


const pinStyle = {
  cursor: "pointer",
  stroke: SECONDARY_COLOR,
};

function Pin({
  selected = false,
  hasSelected = false,
  isMajor = false,
  type = '',
  description = '',
  onMouseEnter = () => {},
  onMouseLeave = () => {},
}) {
  const mainPinColor = isMajor ? MAJOR_COLOR : WARNING_COLOR;

  const getPinSvgFromType = () => {
    const svg = getSvgIconFromType(type, description);
    if (svg) {
      return (
        <svg
          height={selected ? 24 : 18}
          viewBox={svg.viewBox}
          style={{
            ...pinStyle,
            opacity: 0.9,
            position: "absolute",
            top: selected ? "6px" : "4px",
            padding: selected ? "5px" : "4px",
            width: "100%",
            textAlign: "center",
            strokeWidth: selected ? "2px" : "1px",
            fill: 'white',
            stroke: 'white',
          }}
        >
          <path d={svg.path} />
        </svg>
      );
    }
    return (
      <p
        style={{
          color: SECONDARY_COLOR,
          opacity: 0.8,
          position: "absolute",
          top: selected ? "8px" : "4px",
          margin: 0,
          width: "100%",
          textAlign: "center",
          fontWeight: "bold",
          fontSize: selected ? "18px" : "15px",
        }}
      >
        !
      </p>
    )
  }

  return (
    <div onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
      <svg
        height={selected ? 40 : 30}
        viewBox={BASE_PIN_ICON.viewBox}
        style={{
          ...pinStyle,
          strokeWidth: selected ? "2px" : "1px",
          fill: selected || !hasSelected ? mainPinColor : TERTIARY_COLOR,
          stroke: SECONDARY_COLOR,
          opacity: 1,
        }}
      >
        <path d={BASE_PIN_ICON.path} />
      </svg>
      {getPinSvgFromType()}
    </div>
  );
}

export default React.memo(Pin);
