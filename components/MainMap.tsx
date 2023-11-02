import React, {
  FC,
  Fragment,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import Map, { Marker, MapRef, MapboxEvent } from "react-map-gl";
import { Event } from "../types/Event";
import { formatBoundsForMap } from "../utils/mapUtils";
import Pin from "./icons/Pin";
import MapLine from "./MapLine";
import Loader from "./Loader";
import TitleLogo from "./TitleLogo";
import AboutBlurb from "./AboutBlurb";

const DEFAULT_VIEWPORT_BOUNDS = [-124.822354, 48.052736, -120.49436, 56.567183];

interface MainMapProps {
  aboutBlurb: JSX.Element;
  events: Event[];
  selectedEvent?: Event | null;
  setSelectedEvent: (event: Event | null) => void;
  isLoading?: boolean;
}

const MainMap: FC<MainMapProps> = ({
  aboutBlurb,
  events,
  selectedEvent,
  setSelectedEvent,
  isLoading = false,
}) => {
  const [aboutIsOpen, setAboutIsOpen] = useState(false);
  const [map, setMap] = useState<MapRef | null>(null);

  const flyToCoords = useCallback(
    ([long, lat]: [number, number]) => {
      map?.flyTo({ center: [long, lat] });
    },
    [map]
  );

  const fitToBounds = useCallback(
    (bounds: number[], animate: boolean = false) => {
      if (bounds) {
        map?.fitBounds(formatBoundsForMap(bounds), {
          maxZoom: 13,
          padding: 32,
          animate,
        });
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

  const handleMarkerClick = (e: MapboxEvent<MouseEvent>, event: Event) => {
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
      return DEFAULT_VIEWPORT_BOUNDS;
    }
  }, [selectedEvent, isLoading]);

  return (
    <div className="flex-[3] h-full relative">
      <>
        <TitleLogo onClick={() => setAboutIsOpen(true)} />
        <AboutBlurb isOpen={aboutIsOpen} setIsOpen={setAboutIsOpen}>
          {aboutBlurb}
        </AboutBlurb>
      </>
      {isLoading || !viewportBounds ? (
        <Loader />
      ) : (
        <Map
          ref={(ref) => setMap(ref)}
          initialViewState={{
            bounds: formatBoundsForMap(viewportBounds),
          }}
          mapStyle="mapbox://styles/mapbox/navigation-day-v1"
          mapboxAccessToken={process.env.NEXT_PUBLIC_APP_MAPBOX_TOKEN}
        >
          {events.map((event) => {
            const { id, long, lat, line } = event;
            const selected = selectedEvent?.id === event.id;
            const isMajor = event.severity === "Major";
            return (
              <Fragment key={`event-${id}`}>
                <Marker
                  pitchAlignment={"map"}
                  longitude={long}
                  latitude={lat}
                  anchor="bottom"
                  style={{ zIndex: selected ? 11 : 10 }}
                  onClick={(e) => handleMarkerClick(e, event)}
                >
                  <Pin
                    selected={selected}
                    type={event.type}
                    isMajor={isMajor}
                    description={event.description}
                    hasSelected={!!selectedEvent}
                  />
                </Marker>
                {line && (
                  <MapLine
                    lineString={line}
                    isMajor={isMajor}
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
        </Map>
      )}
    </div>
  );
};

export default MainMap;
