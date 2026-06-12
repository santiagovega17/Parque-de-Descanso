import { BLOCK_GAP, ORANGE_TIER_Y, RIGHT_ORIGIN_X } from "./layout";
import { BLOCK_HEIGHT, BLOCK_WIDTH } from "./parcel-config";
import { PASILLO_CROSS_GAP, type PasilloIntersection } from "./pasillo-config";
import type { ParcelBlock, PasilloInnerCorner } from "./types";

export const ORANGE_PASILLO_ORIGIN_X = RIGHT_ORIGIN_X;
export const ORANGE_PASILLO_ORIGIN_Y = ORANGE_TIER_Y;

export const ORANGE_PASILLO_INTERSECTION: PasilloIntersection = {
  id: "orange",
  centerX: ORANGE_PASILLO_ORIGIN_X + BLOCK_WIDTH + PASILLO_CROSS_GAP / 2,
  centerY: ORANGE_PASILLO_ORIGIN_Y + BLOCK_HEIGHT + PASILLO_CROSS_GAP / 2,
};

function pasilloOrigin(row: number, col: number): [number, number] {
  return [
    ORANGE_PASILLO_ORIGIN_Y + row * (BLOCK_HEIGHT + PASILLO_CROSS_GAP),
    ORANGE_PASILLO_ORIGIN_X + col * (BLOCK_WIDTH + PASILLO_CROSS_GAP),
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
    variant: "orange",
    origin: pasilloOrigin(row, col),
    pasilloInnerCorner,
  };
}

/** Bloques naranjas con intersección tipo pasillo. */
export const ORANGE_PASILLO_BLOCKS: ParcelBlock[] = [
  createPasilloBlock("bloque-17", 17, 0, 0, "bottom-right"),
  createPasilloBlock("bloque-18", 18, 0, 1, "bottom-left"),
  createPasilloBlock("bloque-19", 19, 1, 0, "top-right"),
  createPasilloBlock("bloque-20", 20, 1, 1, "top-left"),
];
