import * as React from "react";

const PRIMARY_COLOR = "#f00";
const SECONDARY_COLOR = "#FFF";
const TERTIARY_COLOR = "#142228";

const ICON = `M20.2,15.7L20.2,15.7c1.1-1.6,1.8-3.6,1.8-5.7c0-5.6-4.5-10-10-10S2,4.5,2,10c0,2,0.6,3.9,1.6,5.4c0,0.1,0.1,0.2,0.2,0.3
  c0,0,0.1,0.1,0.1,0.2c0.2,0.3,0.4,0.6,0.7,0.9c2.6,3.1,7.4,7.6,7.4,7.6s4.8-4.5,7.4-7.5c0.2-0.3,0.5-0.6,0.7-0.9
  C20.1,15.8,20.2,15.8,20.2,15.7z`;

const pinStyle = {
  cursor: "pointer",
  stroke: SECONDARY_COLOR,
};

function Pin({
  selected = false,
  hasSelected = false,
  onMouseEnter = () => {},
  onMouseLeave = () => {},
}) {
  return (
    <div onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
      <svg
        height={selected ? 34 : 24}
        viewBox="0 -3 24 29"
        style={{
          ...pinStyle,
          strokeWidth: selected ? "2px" : "1px",
          fill: selected || !hasSelected ? PRIMARY_COLOR : TERTIARY_COLOR,
          stroke: SECONDARY_COLOR,
          opacity: 1,
        }}
      >
        <path d={ICON} />
      </svg>
      <p
        style={{
          color: SECONDARY_COLOR,
          opacity: 0.8,
          position: "absolute",
          top: selected ? "6px" : "2px",
          margin: 0,
          width: "100%",
          textAlign: "center",
          fontWeight: "bold",
          fontSize: selected ? "14px" : "11px",
        }}
      >
        !
      </p>
    </div>
  );
}

export default React.memo(Pin);
