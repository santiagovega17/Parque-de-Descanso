import { BOULEVARD, BOULEVARD_SIDE_GAP } from "../layout";
import type { MapCoordinates } from "../types";

/** Marcador fijo en la calle principal (marrón) junto a la base del boulevard. */
export const NAV_START_POINT: MapCoordinates = [
  BOULEVARD.y + BOULEVARD.height,
  BOULEVARD.x - BOULEVARD_SIDE_GAP / 2,
];

export const ROUTE_STROKE = "#c0392b";
export const ROUTE_STROKE_WIDTH = 6;
export const ROUTE_START_FILL = "#c0392b";
export const ROUTE_START_RADIUS = 14;

/** Tolerancia vertical para detectar la base de los pasillos del boulevard. */
export const BOULEVARD_BOTTOM_Y_TOLERANCE = 8;
