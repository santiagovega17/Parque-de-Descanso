import { PORTONES_ICON_GAP } from "../config";
import type { MapCoordinates } from "../types";
import { BOULEVARD_BOTTOM_Y, BOULEVARD_CENTER_X } from "./corridor-geometry";

/** Marcador fijo entre la base del boulevard y el ícono de portones. */
export const NAV_START_POINT: MapCoordinates = [
  BOULEVARD_BOTTOM_Y + PORTONES_ICON_GAP,
  BOULEVARD_CENTER_X,
];

export const ROUTE_STROKE = "#c0392b";
export const ROUTE_STROKE_WIDTH = 6;
export const ROUTE_START_FILL = "#c0392b";
export const ROUTE_START_RADIUS = 14;

/** Tolerancia vertical para detectar la base de los pasillos del boulevard. */
export const BOULEVARD_BOTTOM_Y_TOLERANCE = 8;
