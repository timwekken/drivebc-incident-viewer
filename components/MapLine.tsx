import React, { FC } from "react";
import { Source, Layer } from "react-map-gl";
import polyline from "@mapbox/polyline";
import { theme } from "../tailwind.config.js";

interface MapLineProps {
  lineString: string | null;
  isMajor?: boolean;
  selected?: boolean;
  hasSelected?: boolean;
}

const MapLine: FC<MapLineProps> = ({
  lineString,
  isMajor,
  selected,
  hasSelected = false,
}) => {
  const coordinates: [number, number][] = polyline.decode(lineString || "");
  const colors: Record<string, any> = theme?.extend?.colors || {};
  const typeColor = isMajor ? colors.major : colors.warning;

  return (
    <Source
      type="geojson"
      data={{
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            geometry: {
              type: "LineString",
              coordinates,
            },
            properties: {},
          },
        ],
      }}
    >
      <Layer
        type="line"
        paint={{
          "line-color": selected || !hasSelected ? typeColor : colors.default,
          "line-opacity": !hasSelected ? 0.75 : selected ? 0.9 : 0.5,
          "line-width": selected ? 4 : 3,
        }}
      />
    </Source>
  );
};

export default MapLine;
