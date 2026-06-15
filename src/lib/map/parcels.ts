import {
  BLUE_TIER_Y,
  GREEN_TIER_Y,
  LEFT_COLUMNS,
  LEFT_ORIGIN_X,
  PINK_TIER_Y,
  RIGHT_COLUMNS,
  RIGHT_ORIGIN_X,
  VIOLET_ABOVE_PINK_COL,
  VIOLET_TIER_Y,
  VIOLET_TOP_TIER_Y,
  gridOrigin,
} from "./layout";
import { ORANGE_PASILLO_BLOCKS } from "./orange-pasillo";
import { SOLID_GREEN_BLOCKS } from "./solid-green-sector";
import { YELLOW_PASILLO_BLOCKS, YELLOW_SIDE_BLOCKS } from "./yellow-pasillo";
import { createParcelBlock } from "./parcel-utils";
import type { Parcel, ParcelBlock, ParcelBlockVariant } from "./types";

function createGridBlocks(
  prefix: string,
  labelPrefix: string,
  variant: ParcelBlockVariant,
  baseY: number,
  baseX: number,
  rows: number,
  cols: number,
  startIndex: number,
): ParcelBlock[] {
  const blocks: ParcelBlock[] = [];
  let index = startIndex;

  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < cols; col += 1) {
      blocks.push({
        id: `${prefix}-${index}`,
        label: `${labelPrefix} ${index}`,
        variant,
        origin: gridOrigin(baseY, baseX, row, col),
      });
      index += 1;
    }
  }

  return blocks;
}

function createBlock(
  id: string,
  label: string,
  variant: ParcelBlockVariant,
  origin: [number, number],
  options?: Pick<ParcelBlock, "solid" | "pasilloInnerCorner">,
): ParcelBlock {
  return { id, label, variant, origin, ...options };
}

/** Sectores de parcelas definidos en el plano. */
export const PARCEL_BLOCKS: ParcelBlock[] = [
  ...SOLID_GREEN_BLOCKS,
  createBlock(
    "sector-28",
    "Sector 28",
    "violet",
    gridOrigin(VIOLET_TOP_TIER_Y, LEFT_ORIGIN_X, 0, VIOLET_ABOVE_PINK_COL),
  ),
  ...createGridBlocks(
    "sector",
    "Sector",
    "violet",
    VIOLET_TIER_Y,
    LEFT_ORIGIN_X,
    1,
    LEFT_COLUMNS,
    21,
  ),
  ...createGridBlocks(
    "sector",
    "Sector",
    "pink",
    PINK_TIER_Y,
    RIGHT_ORIGIN_X,
    2,
    RIGHT_COLUMNS,
    24,
  ),
  ...YELLOW_SIDE_BLOCKS,
  ...YELLOW_PASILLO_BLOCKS,
  ...ORANGE_PASILLO_BLOCKS,
  ...createGridBlocks(
    "sector",
    "Sector",
    "green",
    GREEN_TIER_Y,
    LEFT_ORIGIN_X,
    2,
    LEFT_COLUMNS,
    5,
  ),
  ...createGridBlocks(
    "sector",
    "Sector",
    "blue",
    BLUE_TIER_Y,
    RIGHT_ORIGIN_X,
    2,
    RIGHT_COLUMNS,
    1,
  ),
];

/** Todas las parcelas del plano, derivadas de los sectores definidos. */
export const ALL_PARCELS: Parcel[] = PARCEL_BLOCKS.flatMap(createParcelBlock);

const BLOCK_BY_ID = new Map(PARCEL_BLOCKS.map((block) => [block.id, block]));

const PARCEL_BY_ID = new Map(ALL_PARCELS.map((parcel) => [parcel.id, parcel]));

export function getParcelById(id: string): Parcel | undefined {
  return PARCEL_BY_ID.get(id);
}

export function getBlockById(id: string): ParcelBlock | undefined {
  return BLOCK_BY_ID.get(id);
}

export function getParcelLabel(parcel: Parcel): string {
  const block = BLOCK_BY_ID.get(parcel.blockId);
  return `${block?.label ?? parcel.blockId} · Parcela ${parcel.number}`;
}

export function getBlockLabel(block: ParcelBlock): string {
  return block.label;
}
