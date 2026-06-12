import {
  BLOCK_HEIGHT,
  BLOCK_PADDING,
  BLOCK_WIDTH,
  PARCEL_GAP,
  PARCEL_SIZE,
  PARCELS_PER_SIDE,
} from "./parcel-config";
import type { MapBounds, MapCoordinates, Parcel, ParcelBlock } from "./types";

/** Número de parcela: fila superior, de derecha a izquierda (1–25). */
export function getParcelNumber(row: number, col: number): number {
  return row * PARCELS_PER_SIDE + (PARCELS_PER_SIDE - col);
}

/** Fila y columna (0-based) de una parcela dentro de su bloque. */
export function getParcelGridPosition(number: number): {
  row: number;
  col: number;
} {
  const row = Math.floor((number - 1) / PARCELS_PER_SIDE);
  const col = PARCELS_PER_SIDE - 1 - ((number - 1) % PARCELS_PER_SIDE);

  return { row, col };
}

export function createParcelBounds(
  origin: MapCoordinates,
  row: number,
  col: number,
): MapBounds {
  const [originY, originX] = origin;
  const y = originY + BLOCK_PADDING + row * (PARCEL_SIZE + PARCEL_GAP);
  const x = originX + BLOCK_PADDING + col * (PARCEL_SIZE + PARCEL_GAP);

  return [
    [y, x],
    [y + PARCEL_SIZE, x + PARCEL_SIZE],
  ];
}

export function createParcelBlock(block: ParcelBlock): Parcel[] {
  if (block.solid) {
    return [];
  }

  const parcels: Parcel[] = [];

  for (let row = 0; row < PARCELS_PER_SIDE; row += 1) {
    for (let col = 0; col < PARCELS_PER_SIDE; col += 1) {
      const number = getParcelNumber(row, col);

      parcels.push({
        id: `${block.id}-${number}`,
        blockId: block.id,
        number,
        bounds: createParcelBounds(block.origin, row, col),
      });
    }
  }

  return parcels;
}

export function getBlockBounds(origin: MapCoordinates): MapBounds {
  const [originY, originX] = origin;

  return [
    [originY, originX],
    [originY + BLOCK_HEIGHT, originX + BLOCK_WIDTH],
  ];
}

export function getParcelCenter(parcel: Parcel): MapCoordinates {
  const [[y1, x1], [y2, x2]] = parcel.bounds;
  return [(y1 + y2) / 2, (x1 + x2) / 2];
}

/** Coordenada X del pasillo vertical entre la columna `col` y `col + 1`. */
export function getColGapX(origin: MapCoordinates, col: number): number {
  const [, originX] = origin;

  return (
    originX +
    BLOCK_PADDING +
    (col + 1) * (PARCEL_SIZE + PARCEL_GAP) -
    PARCEL_GAP / 2
  );
}

/** Coordenada Y del pasillo horizontal entre la fila `row` y `row + 1`. */
export function getRowGapY(origin: MapCoordinates, row: number): number {
  const [originY] = origin;

  return (
    originY +
    BLOCK_PADDING +
    (row + 1) * (PARCEL_SIZE + PARCEL_GAP) -
    PARCEL_GAP / 2
  );
}
