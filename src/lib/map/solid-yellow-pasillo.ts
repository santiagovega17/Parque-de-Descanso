import {
  BLOCK_GAP,
  SOLID_BLOCK_STRIDE,
  SOLID_LEFT_ORIGIN_X,
  VIOLET_TIER_Y,
} from "./layout";
import { BLOCK_HEIGHT, BLOCK_WIDTH } from "./parcel-config";
import { PASILLO_CROSS_GAP, type PasilloIntersection } from "./pasillo-config";

/** Esquina superior izquierda del 2×2 (bloque verde liso abajo). */
export const SOLID_YELLOW_PASILLO_ORIGIN_Y =
  VIOLET_TIER_Y + BLOCK_HEIGHT + BLOCK_GAP;
export const SOLID_YELLOW_PASILLO_ORIGIN_X =
  SOLID_LEFT_ORIGIN_X + SOLID_BLOCK_STRIDE;

export const SOLID_YELLOW_PASILLO_INTERSECTION: PasilloIntersection = {
  id: "solid-yellow",
  centerX: SOLID_YELLOW_PASILLO_ORIGIN_X + BLOCK_WIDTH + PASILLO_CROSS_GAP / 2,
  centerY: SOLID_YELLOW_PASILLO_ORIGIN_Y + BLOCK_HEIGHT + PASILLO_CROSS_GAP / 2,
};
