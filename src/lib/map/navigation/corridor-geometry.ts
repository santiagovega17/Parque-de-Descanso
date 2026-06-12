import { BLOCK_GAP, BOULEVARD, BOULEVARD_SIDE_GAP } from "../layout";
import { BLOCK_HEIGHT, BLOCK_WIDTH } from "../parcel-config";
import { getBlockBounds, getParcelCenter } from "../parcel-utils";
import type { MapCoordinates, Parcel, ParcelBlock } from "../types";

export const BOULEVARD_CENTER_X = BOULEVARD.x + BOULEVARD.width / 2;
export const BOULEVARD_LEFT_SPINE_X = BOULEVARD.x - BOULEVARD_SIDE_GAP / 2;
export const BOULEVARD_RIGHT_SPINE_X =
  BOULEVARD.x + BOULEVARD.width + BOULEVARD_SIDE_GAP / 2;

export function getBoulevardSpineX(block: ParcelBlock): number {
  const centerX = block.origin[1] + BLOCK_WIDTH / 2;

  return centerX < BOULEVARD_CENTER_X
    ? BOULEVARD_LEFT_SPINE_X
    : BOULEVARD_RIGHT_SPINE_X;
}

/** Calle horizontal justo debajo del bloque. */
export function getBlockSouthCorridorY(block: ParcelBlock): number {
  return block.origin[0] + BLOCK_HEIGHT + BLOCK_GAP / 2;
}

/** Punto en la calle de abajo, alineado con la columna de la parcela. */
export function getParcelSouthStreetStop(
  parcel: Parcel,
  block: ParcelBlock,
): MapCoordinates {
  const [, parcelX] = getParcelCenter(parcel);

  return [getBlockSouthCorridorY(block), parcelX];
}

/** Destino final dentro de la parcela. */
export function getParcelDestination(parcel: Parcel): MapCoordinates {
  return getParcelCenter(parcel);
}

/** Centro del bloque visto desde la calle de abajo. */
export function getBlockSouthStreetStop(block: ParcelBlock): MapCoordinates {
  return [
    getBlockSouthCorridorY(block),
    block.origin[1] + BLOCK_WIDTH / 2,
  ];
}

export function isInsideBlock(
  [y, x]: MapCoordinates,
  block: ParcelBlock,
): boolean {
  const [[by1, bx1], [by2, bx2]] = getBlockBounds(block.origin);

  return x > bx1 && x < bx2 && y > by1 && y < by2;
}
