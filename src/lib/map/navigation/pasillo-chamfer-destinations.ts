import { PASILLO_CHAMFER } from "../pasillo-config";
import {
  BLOCK_HEIGHT,
  BLOCK_WIDTH,
  PARCEL_GAP,
  PARCEL_SIZE,
  PARCELS_PER_SIDE,
} from "../parcel-config";
import { getParcelCenter, getParcelGridPosition } from "../parcel-utils";
import type { MapCoordinates, Parcel, ParcelBlock, PasilloInnerCorner } from "../types";

const PARCEL_STEP = PARCEL_SIZE + PARCEL_GAP;

function getChamferDiagonal(
  block: ParcelBlock,
): [MapCoordinates, MapCoordinates] | null {
  const corner = block.pasilloInnerCorner;

  if (!corner) {
    return null;
  }

  const [originY, originX] = block.origin;
  const chamfer = PASILLO_CHAMFER;

  switch (corner) {
    case "top-right":
      return [
        [originY, originX + BLOCK_WIDTH - chamfer],
        [originY + chamfer, originX + BLOCK_WIDTH],
      ];
    case "top-left":
      return [
        [originY + chamfer, originX],
        [originY, originX + chamfer],
      ];
    case "bottom-right":
      return [
        [originY + BLOCK_HEIGHT - chamfer, originX + BLOCK_WIDTH],
        [originY + BLOCK_HEIGHT, originX + BLOCK_WIDTH - chamfer],
      ];
    case "bottom-left":
      return [
        [originY + BLOCK_HEIGHT, originX + chamfer],
        [originY + BLOCK_HEIGHT - chamfer, originX],
      ];
  }
}

function intersectDiagonalAtY(
  diagonal: [MapCoordinates, MapCoordinates],
  y: number,
): MapCoordinates | null {
  const [[y1, x1], [y2, x2]] = diagonal;

  if (Math.abs(y2 - y1) < 1) {
    return null;
  }

  const t = (y - y1) / (y2 - y1);

  if (t < 0 || t > 1) {
    return null;
  }

  return [y, x1 + t * (x2 - x1)];
}

function intersectDiagonalAtX(
  diagonal: [MapCoordinates, MapCoordinates],
  x: number,
): MapCoordinates | null {
  const [[y1, x1], [y2, x2]] = diagonal;

  if (Math.abs(x2 - x1) < 1) {
    return null;
  }

  const t = (x - x1) / (x2 - x1);

  if (t < 0 || t > 1) {
    return null;
  }

  return [y1 + t * (y2 - y1), x];
}

function getChamferAffectedRows(corner: PasilloInnerCorner): number[] {
  const rowCount = Math.ceil(PASILLO_CHAMFER / PARCEL_STEP);
  const maxRow = PARCELS_PER_SIDE - 1;

  if (corner === "top-right" || corner === "top-left") {
    return Array.from({ length: rowCount }, (_, index) => index);
  }

  return Array.from(
    { length: rowCount },
    (_, index) => maxRow - rowCount + 1 + index,
  );
}

function getChamferEdgeColumn(corner: PasilloInnerCorner): number {
  return corner === "top-right" || corner === "bottom-right"
    ? PARCELS_PER_SIDE - 1
    : 0;
}

export function isPasilloChamferParcel(
  parcel: Parcel,
  block: ParcelBlock,
): boolean {
  const corner = block.pasilloInnerCorner;

  if (!corner) {
    return false;
  }

  const { row, col } = getParcelGridPosition(parcel.number);

  return (
    col === getChamferEdgeColumn(corner) &&
    getChamferAffectedRows(corner).includes(row)
  );
}

function clampToDiagonalY(
  diagonal: [MapCoordinates, MapCoordinates],
  y: number,
): number {
  const [[y1], [y2]] = diagonal;

  return Math.max(Math.min(y1, y2), Math.min(Math.max(y1, y2), y));
}

function clampToDiagonalX(
  diagonal: [MapCoordinates, MapCoordinates],
  x: number,
): number {
  const [[, x1], [, x2]] = diagonal;

  return Math.max(Math.min(x1, x2), Math.min(Math.max(x1, x2), x));
}

type BlockApproach = "south" | "north" | "east" | "west";

/** Punto de corte en el chaflán del pasillo; la ruta termina ahí sin entrar a la parcela. */
export function getPasilloChamferDestination(
  parcel: Parcel,
  block: ParcelBlock,
  approach: BlockApproach,
): MapCoordinates | null {
  if (!isPasilloChamferParcel(parcel, block)) {
    return null;
  }

  const corner = block.pasilloInnerCorner;
  const diagonal = getChamferDiagonal(block);

  if (!corner || !diagonal) {
    return null;
  }

  const [centerY, centerX] = getParcelCenter(parcel);

  if (approach === "east" || approach === "west") {
    return intersectDiagonalAtY(
      diagonal,
      clampToDiagonalY(diagonal, centerY),
    );
  }

  return intersectDiagonalAtX(
    diagonal,
    clampToDiagonalX(diagonal, centerX),
  );
}
