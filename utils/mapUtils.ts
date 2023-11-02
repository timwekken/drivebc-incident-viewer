import { LngLatBoundsLike } from "react-map-gl";

/**
 * Format bounds so that it can be used by react-map-gl
 * @param bounds - 1d array of bounds
 * @returns - 2d array of LngLatBoundsLike
 */
export const formatBoundsForMap = (bounds: number[]): LngLatBoundsLike => {
  return [
    [bounds[0], bounds[1]],
    [bounds[2], bounds[3]],
  ];
};
