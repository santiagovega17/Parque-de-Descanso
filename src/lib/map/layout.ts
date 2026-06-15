import { BLOCK_HEIGHT, BLOCK_WIDTH } from "./parcel-config";

export const BLOCK_GAP = 48;
/** Separación vertical entre filas de bloques. */
export const BLOCK_ROW_GAP = 100;
export const BOULEVARD_WIDTH = 48;
export const BOULEVARD_SIDE_GAP = 96;
export const TIER_GAP = 100;
/** Margen caminable (marrón) sobre los bloques rosas y violetas. */
export const TOP_WALKABLE_MARGIN = 100;
export const LAYOUT_MARGIN = 40;

export const LEFT_COLUMNS = 3;
export const RIGHT_COLUMNS = 2;

export const LEFT_GRID_WIDTH =
  LEFT_COLUMNS * BLOCK_WIDTH + (LEFT_COLUMNS - 1) * BLOCK_GAP;
export const RIGHT_GRID_WIDTH =
  RIGHT_COLUMNS * BLOCK_WIDTH + (RIGHT_COLUMNS - 1) * BLOCK_GAP;

export const TWO_ROW_TIER_HEIGHT = 2 * BLOCK_HEIGHT + BLOCK_ROW_GAP;
export const ONE_ROW_TIER_HEIGHT = BLOCK_HEIGHT;

const RIGHT_COLUMN_HEIGHT = 3 * TWO_ROW_TIER_HEIGHT + 2 * TIER_GAP;

export const LAYOUT_ORIGIN_X = LAYOUT_MARGIN;

/** Columna de bloques lisos a la izquierda de la grilla de parcelas. */
export const SOLID_BLOCK_STRIDE = BLOCK_WIDTH + BLOCK_GAP;
export const SOLID_LEFT_ORIGIN_X = LAYOUT_MARGIN;
export const LEFT_ORIGIN_X = SOLID_LEFT_ORIGIN_X + 2 * SOLID_BLOCK_STRIDE;

export const LAYOUT_ORIGIN_Y = TOP_WALKABLE_MARGIN;
export const RIGHT_ORIGIN_X =
  LEFT_ORIGIN_X +
  LEFT_GRID_WIDTH +
  BOULEVARD_SIDE_GAP +
  BOULEVARD_WIDTH +
  BOULEVARD_SIDE_GAP;

export const BLUE_TIER_Y = LAYOUT_ORIGIN_Y + 2 * (TWO_ROW_TIER_HEIGHT + TIER_GAP);
export const GREEN_TIER_Y = BLUE_TIER_Y;

export const ORANGE_TIER_Y = LAYOUT_ORIGIN_Y + TWO_ROW_TIER_HEIGHT + TIER_GAP;
export const YELLOW_TIER_Y = ORANGE_TIER_Y;

export const PINK_TIER_Y = LAYOUT_ORIGIN_Y;
export const VIOLET_TIER_Y = ORANGE_TIER_Y - TIER_GAP - ONE_ROW_TIER_HEIGHT;
export const VIOLET_TOP_TIER_Y = VIOLET_TIER_Y - TIER_GAP - BLOCK_HEIGHT;
export const VIOLET_ABOVE_PINK_COL = LEFT_COLUMNS - 1;

const BOULEVARD_TOP_Y = VIOLET_TIER_Y;
const BOULEVARD_BOTTOM_Y = GREEN_TIER_Y + TWO_ROW_TIER_HEIGHT;

export const BOULEVARD = {
  x: LEFT_ORIGIN_X + LEFT_GRID_WIDTH + BOULEVARD_SIDE_GAP,
  y: BOULEVARD_TOP_Y,
  width: BOULEVARD_WIDTH,
  height: BOULEVARD_BOTTOM_Y - BOULEVARD_TOP_Y,
  fill: "#6aab6a",
  border: "#4d8a4d",
};

export function gridOrigin(
  baseY: number,
  baseX: number,
  row: number,
  col: number,
): [number, number] {
  return [
    baseY + row * (BLOCK_HEIGHT + BLOCK_ROW_GAP),
    baseX + col * (BLOCK_WIDTH + BLOCK_GAP),
  ];
}
