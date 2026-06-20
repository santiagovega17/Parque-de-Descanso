import { PORTONES_ICON_GAP } from "../config";
import type { MapCoordinates } from "../types";
import { BOULEVARD_BOTTOM_Y, BOULEVARD_CENTER_X } from "./corridor-geometry";

/** Desplazamiento vertical del punto de inicio respecto al borde inferior del boulevard. */
const NAV_START_POINT_Y_OFFSET = PORTONES_ICON_GAP + 100;

/** Marcador fijo entre la base del boulevard y el ícono de portones. */
export const NAV_START_POINT: MapCoordinates = [
  BOULEVARD_BOTTOM_Y + NAV_START_POINT_Y_OFFSET,
  BOULEVARD_CENTER_X,
];

export const ROUTE_STROKE = "#c0392b";
export const ROUTE_STROKE_WIDTH = 16;
/** Velocidad del trazado animado de la ruta (px/s). */
export const ROUTE_DRAW_SPEED = 500;
export const ROUTE_START_ICON_WIDTH = 90;
export const ROUTE_START_ICON_HEIGHT = 125;

/** Tolerancia vertical para detectar la base de los pasillos del boulevard. */
export const BOULEVARD_BOTTOM_Y_TOLERANCE = 8;
