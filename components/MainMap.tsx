import React, {
  FC,
  Fragment,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import Map, { Marker, Popup } from "react-map-gl";
import { Event } from "../types/Event";
import Pin from "./Pin";
import MapLine from "./MapLine";
import Loader from "./Loader";
import TitleLogo from "./TitleLogo";
import AboutBlurb from "./AboutBlurb";

interface MainMapProps {
  aboutBlurb: JSX.Element;
  events: Event[];
  hoveredEvent: Event | null;
  setHoveredEvent: (event: Event | null) => void;
  selectedEvent?: Event | null;
  setSelectedEvent: (event: Event | null) => void;
  isLoading?: boolean;
}

const MainMap: FC<MainMapProps> = ({
  aboutBlurb,
  events,
  hoveredEvent,
  setHoveredEvent,
  selectedEvent,
  setSelectedEvent,
  isLoading = false,
}) => {
  const [aboutIsOpen, setAboutIsOpen] = useState(false);
  const [map, setMap] = useState<any>(null);

  // const [popupInfo, setPopupInfo] = useState<Event | null>(null);

  const flyToCoords = useCallback(
    ([long, lat]: any) => {
      map?.flyTo({ center: [long, lat] });
    },
    [map]
  );

  const fitToBounds = useCallback(
    (bounds: number[], animate: boolean = false) => {
      if (bounds) {
        map?.fitBounds(
          [
            [bounds[0], bounds[1]],
            [bounds[2], bounds[3]],
          ],
          {
            maxZoom: 13,
            padding: 32,
            animate,
          }
        );
      }
    },
    [map]
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

  useEffect(() => {
    if (map) {
      map.on("click", () => {
        setSelectedEvent(null);
      });
    }
  }, [map]);

  useEffect(() => {
    if (map && selectedEvent?.fromURL && selectedEvent?.bbox) {
      fitToBounds(selectedEvent.bbox);
    }
  }, [map, selectedEvent]);

  const viewportBounds = useMemo(() => {
    if (selectedEvent?.bbox) {
      return selectedEvent.bbox;
    } else if (!isLoading) {
      return [-124.822354, 48.052736, -120.49436, 56.567183];
    }
  }, [selectedEvent, isLoading]);

  return (
    <div className="flex-[3] h-full relative">
      <>
        <TitleLogo onClick={() => setAboutIsOpen(true)} />
        <AboutBlurb isOpen={aboutIsOpen} setIsOpen={setAboutIsOpen}>{aboutBlurb}</AboutBlurb>
      </>
      {isLoading || !viewportBounds ? (
        <Loader />
      ) : (
        <Map
          ref={(ref) => setMap(ref)}
          initialViewState={{
            bounds: [
              [viewportBounds[0], viewportBounds[1]],
              [viewportBounds[2], viewportBounds[3]],
            ],
          }}
          mapStyle="mapbox://styles/mapbox/navigation-day-v1"
          mapboxAccessToken={process.env.NEXT_PUBLIC_APP_MAPBOX_TOKEN}
        >
          {events.map((event) => {
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
                    type={event.type}
                    isMajor={event.severity === "Major"}
                    description={event.description}
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
                  <MapLine
                    lineString={line}
                    isMajor={event.severity === "Major"}
                    hasSelected={!!selectedEvent}
                  />
                )}
              </Fragment>
            );
          })}

          {selectedEvent?.line && (
            <MapLine
              lineString={selectedEvent?.line}
              isMajor={selectedEvent.severity === "Major"}
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
