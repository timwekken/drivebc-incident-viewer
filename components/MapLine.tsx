import React, { FC } from "react";
import { Source, Layer } from "react-map-gl";
import polyline from "@mapbox/polyline";

const MapLine: FC<{
  lineString: string | null;
  selected?: boolean;
  hasSelected?: boolean;
}> = ({ lineString, selected, hasSelected = false }): JSX.Element => {
  const coordinates: [number, number][] = polyline.decode(lineString || "");

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
      "line-color": selected || !hasSelected ? "#d00" : "#142228",
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
