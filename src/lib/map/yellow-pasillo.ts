import { LEFT_ORIGIN_X, YELLOW_TIER_Y, gridOrigin } from "./layout";
import { BLOCK_HEIGHT, BLOCK_WIDTH } from "./parcel-config";
import { PASILLO_CROSS_GAP, type PasilloIntersection } from "./pasillo-config";
import type { ParcelBlock, PasilloInnerCorner } from "./types";

/** Origen del 2×2 amarillo con pasillo (columnas 1 y 2 del sector amarillo). */
export const YELLOW_PASILLO_ORIGIN = gridOrigin(YELLOW_TIER_Y, LEFT_ORIGIN_X, 0, 1);
export const YELLOW_PASILLO_ORIGIN_Y = YELLOW_PASILLO_ORIGIN[0];
export const YELLOW_PASILLO_ORIGIN_X = YELLOW_PASILLO_ORIGIN[1];

export const YELLOW_PASILLO_INTERSECTION: PasilloIntersection = {
  id: "yellow",
  centerX: YELLOW_PASILLO_ORIGIN_X + BLOCK_WIDTH + PASILLO_CROSS_GAP / 2,
  centerY: YELLOW_PASILLO_ORIGIN_Y + BLOCK_HEIGHT + PASILLO_CROSS_GAP / 2,
};

function pasilloOrigin(row: number, col: number): [number, number] {
  return [
    YELLOW_PASILLO_ORIGIN_Y + row * (BLOCK_HEIGHT + PASILLO_CROSS_GAP),
    YELLOW_PASILLO_ORIGIN_X + col * (BLOCK_WIDTH + PASILLO_CROSS_GAP),
  ];
}

function createPasilloBlock(
  id: string,
  index: number,
  row: number,
  col: number,
  pasilloInnerCorner: PasilloInnerCorner,
): ParcelBlock {
  return {
    id,
    label: `Bloque ${index}`,
    variant: "yellow",
    origin: pasilloOrigin(row, col),
    pasilloInnerCorner,
  };
}

/** Bloques amarillos centrales con intersección tipo pasillo (12, 13, 15, 16). */
export const YELLOW_PASILLO_BLOCKS: ParcelBlock[] = [
  createPasilloBlock("bloque-12", 12, 0, 0, "bottom-right"),
  createPasilloBlock("bloque-13", 13, 0, 1, "bottom-left"),
  createPasilloBlock("bloque-15", 15, 1, 0, "top-right"),
  createPasilloBlock("bloque-16", 16, 1, 1, "top-left"),
];

/** Bloques amarillos laterales con pasillo hacia los bloques verdes lisos (11 y 14). */
export const YELLOW_SIDE_BLOCKS: ParcelBlock[] = [
  {
    id: "bloque-11",
    label: "Bloque 11",
    variant: "yellow",
    origin: gridOrigin(YELLOW_TIER_Y, LEFT_ORIGIN_X, 0, 0),
    pasilloInnerCorner: "bottom-left",
  },
  {
    id: "bloque-14",
    label: "Bloque 14",
    variant: "yellow",
    origin: gridOrigin(YELLOW_TIER_Y, LEFT_ORIGIN_X, 1, 0),
    pasilloInnerCorner: "top-left",
  },
];
