import React, {
  Fragment,
  useState,
  useEffect,
  useRef,
  useCallback,
  FC,
  useMemo,
} from "react";
import Map, { Marker, Popup, MapRef } from "react-map-gl";
import mapboxgl from "mapbox-gl";

import { MajorEvent } from "../types/MajorEvent";
import Pin from "./Pin";
import MapLine from "./MapLine";
import Loader from "./Loader";

// TODO:
// Format date with dayjs
// Links in description
// Closest webcams
// Get users location and show that area??

// TODO: SECURE THIS
const REACT_APP_MAPBOX_TOKEN =
  "pk.eyJ1IjoidGltd2Vra2VuIiwiYSI6ImNsYzJyYWtudTFqaXgzd21uczF5N2dyYWQifQ.v6I8NiRRsrO8DtH8GvY6dQ";

interface MainMapProps {
  majorEvents: MajorEvent[];
  hoveredEvent: MajorEvent | null;
  setHoveredEvent: (event: MajorEvent | null) => void;
  selectedEvent?: MajorEvent | null;
  setSelectedEvent: (event: MajorEvent | null) => void;
  isLoading?: boolean;
}

const MainMap: FC<MainMapProps> = ({
  majorEvents,
  hoveredEvent,
  setHoveredEvent,
  selectedEvent,
  setSelectedEvent,
  isLoading = false,
}) => {
  const mapRef = useRef<MapRef>();

  // const [popupInfo, setPopupInfo] = useState<MajorEvent | null>(null);

  const getBoundsFromCoords = ([swLong, swLat, neLon, neLat]: number[]) => {
    const sw = new mapboxgl.LngLat(swLong, swLat);
    const ne = new mapboxgl.LngLat(neLon, neLat);
    return new mapboxgl.LngLatBounds(sw, ne);
  };

  const flyToCoords = useCallback(([long, lat]: any) => {
    mapRef.current?.flyTo({ center: [long, lat] });
  }, []);

  const fitToBounds = useCallback(
    (bounds: number[], animate: boolean = false) => {
      if (bounds)
        mapRef.current?.fitBounds(getBoundsFromCoords(bounds), {
          maxZoom: 13,
          padding: 32,
          animate,
        });
    },
    []
  );

  useEffect(() => {
    if (selectedEvent && !selectedEvent?.fromURL) {
      if (selectedEvent.bbox) {
        fitToBounds(selectedEvent.bbox, !selectedEvent.fromURL);
      } else {
        flyToCoords([selectedEvent.long, selectedEvent.lat]);
      }
    }
  }, [selectedEvent]);

  const handleMarkerClick = (e: any, event: any) => {
    e.originalEvent.stopPropagation();
    setSelectedEvent({ ...event, scrollToListItem: true });
  };

  if (mapRef?.current) {
    mapRef.current.on("click", () => {
      setSelectedEvent(null);
    });
  }

  const viewportBounds = useMemo(() => {
    if (selectedEvent?.bbox) {
      return getBoundsFromCoords(selectedEvent.bbox);
    } else {
      return getBoundsFromCoords([
        -124.822354, 48.052736, -120.49436, 56.567183,
      ]);
    }
  }, [selectedEvent]);

  return (
    <div className="flex-1 h-[50vh] md:h-screen">
      {isLoading || !viewportBounds ? (
        <Loader />
      ) : (
        <Map
          ref={mapRef as any}
          initialViewState={{
            padding: { left: 32, right: 32, top: 32, bottom: 32 },
            bounds: viewportBounds,
          }}
          mapStyle="mapbox://styles/mapbox/navigation-day-v1"
          mapboxAccessToken={REACT_APP_MAPBOX_TOKEN}
        >
          {majorEvents.map((event) => {
            const { id, long, lat, line } = event;
            const hovered = hoveredEvent?.id === event.id;
            const selected = selectedEvent?.id === event.id;
            let zIndex = 10;
            if (selected) {
              zIndex = 11;
            } else if (hovered) {
              zIndex = 12;
            }

            return (
              <Fragment key={`event-${id}`}>
                <Marker
                  pitchAlignment={"map"}
                  longitude={long}
                  latitude={lat}
                  anchor="bottom"
                  style={{ cursor: "pointer", zIndex }}
                  onClick={(e) => handleMarkerClick(e, event)}
                >
                  <Pin
                    selected={hovered || selected}
                    hasSelected={!!selectedEvent}
                    // onMouseEnter={() => {
                    //   setHoveredEvent({ ...event, scrollToListItem: true });
                    // }}
                    // onMouseLeave={() => {
                    //   setHoveredEvent(null);
                    // }}
                  />
                </Marker>
                {line && (
                  <MapLine lineString={line} hasSelected={!!selectedEvent} />
                )}
              </Fragment>
            );
          })}

          {selectedEvent?.line && (
            <MapLine
              lineString={selectedEvent?.line}
              selected
              hasSelected={!!selectedEvent}
            />
          )}

          {/* {popupInfo && (
          <Popup
            anchor="top"
            longitude={popupInfo.long}
            latitude={popupInfo.lat}
            onClose={() => setPopupInfo(null)}
          >
            <div>
              <h3>{popupInfo.name}</h3>
              <p>
                <i>{popupInfo.time}</i>
              </p>
              <p>{popupInfo.description}</p>
            </div>
          </Popup>
        )} */}
        </Map>
      )}
    </div>
  );
};

export default MainMap;
