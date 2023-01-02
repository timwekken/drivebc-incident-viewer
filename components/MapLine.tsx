import React, { FC } from "react";
import { Source, Layer } from "react-map-gl";
import polyline from "@mapbox/polyline";
import { MAJOR_COLOR, WARNING_COLOR, TERTIARY_COLOR } from "../styles/colors";

const MapLine: FC<{
  lineString: string | null;
  isMajor?: boolean;
  selected?: boolean;
  hasSelected?: boolean;
}> = ({ lineString, isMajor, selected, hasSelected = false }): JSX.Element => {
  const coordinates: [number, number][] = polyline.decode(lineString || "");
  const selectedColor = isMajor ? MAJOR_COLOR : WARNING_COLOR;

  const geojson: any = {
    type: "FeatureCollection",
    features: [
      {
        type: "geojson",
        geometry: {
          type: "LineString",
          coordinates,
        },
      },
    ],
  };

  const layerStyle: any = {
    type: "line",
    paint: {
      "line-color": selected || !hasSelected ? selectedColor : TERTIARY_COLOR,
      "line-opacity": !hasSelected ? 0.75 : selected ? 0.9 : 0.5,
      "line-width": selected ? 4 : 3,
    },
  };

  return (
    <Source type="geojson" data={geojson}>
      <Layer {...layerStyle} />
    </Source>
  );
};

export default MapLine;
