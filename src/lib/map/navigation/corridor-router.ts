import { BLOCK_HEIGHT, BLOCK_WIDTH, PARCELS_PER_SIDE } from "../parcel-config";
import { getParcelGridPosition } from "../parcel-utils";
import type { MapCoordinates, Parcel, ParcelBlock } from "../types";
import { NAV_START_POINT } from "./config";
import {
  getBlockEastCorridorX,
  getBlockNorthCorridorY,
  getBlockSouthCorridorY,
  getBlockWestCorridorX,
  getBoulevardSpineX,
  getParcelDestination,
} from "./corridor-geometry";
import { simplifyPath } from "./route-utils";

type BlockApproach = "south" | "north" | "east" | "west";

/** Orden de preferencia: abajo → costados → arriba. */
const APPROACH_PRIORITY: BlockApproach[] = ["south", "east", "west", "north"];

function pushPoint(points: MapCoordinates[], point: MapCoordinates) {
  const previous = points[points.length - 1];

  if (
    previous &&
    Math.abs(previous[0] - point[0]) < 1 &&
    Math.abs(previous[1] - point[1]) < 1
  ) {
    return;
  }

  points.push(point);
}

function countParcelsCrossed(
  row: number,
  col: number,
  approach: BlockApproach,
): number {
  switch (approach) {
    case "south":
      return PARCELS_PER_SIDE - 1 - row;
    case "north":
      return row;
    case "east":
      return PARCELS_PER_SIDE - 1 - col;
    case "west":
      return col;
  }
}

function pickBestApproach(row: number, col: number): BlockApproach {
  let best: BlockApproach = "south";
  let bestCount = Infinity;

  for (const approach of APPROACH_PRIORITY) {
    const count = countParcelsCrossed(row, col, approach);

    if (count < bestCount) {
      bestCount = count;
      best = approach;
    }
  }

  return best;
}

/**
 * Llega al punto de entrada rodeando el bloque por el perímetro,
 * priorizando siempre pasar primero por abajo, luego costados y por último arriba.
 */
function routeAlongPerimeterToEntry(
  points: MapCoordinates[],
  block: ParcelBlock,
  spineX: number,
  approach: BlockApproach,
  parcelX: number,
  parcelY: number,
) {
  const southY = getBlockSouthCorridorY(block);
  const northY = getBlockNorthCorridorY(block);
  const eastX = getBlockEastCorridorX(block);
  const westX = getBlockWestCorridorX(block);
  const blockCenterX = block.origin[1] + BLOCK_WIDTH / 2;

  pushPoint(points, [southY, spineX]);

  switch (approach) {
    case "south":
      pushPoint(points, [southY, parcelX]);
      break;
    case "west":
      pushPoint(points, [southY, westX]);
      pushPoint(points, [parcelY, westX]);
      break;
    case "east":
      pushPoint(points, [southY, eastX]);
      pushPoint(points, [parcelY, eastX]);
      break;
    case "north": {
      const useWestSide = parcelX <= blockCenterX;
      if (useWestSide) {
        pushPoint(points, [southY, westX]);
        pushPoint(points, [northY, westX]);
        pushPoint(points, [northY, parcelX]);
      } else {
        pushPoint(points, [southY, eastX]);
        pushPoint(points, [northY, eastX]);
        pushPoint(points, [northY, parcelX]);
      }
      break;
    }
  }
}

function buildParcelRoute(
  parcel: Parcel,
  block: ParcelBlock,
  approach: BlockApproach,
): MapCoordinates[] {
  const [parcelY, parcelX] = getParcelDestination(parcel);
  const spineX = getBoulevardSpineX(block);
  const [startY] = NAV_START_POINT;

  const points: MapCoordinates[] = [NAV_START_POINT];

  pushPoint(points, [startY, spineX]);
  routeAlongPerimeterToEntry(
    points,
    block,
    spineX,
    approach,
    parcelX,
    parcelY,
  );
  pushPoint(points, [parcelY, parcelX]);

  return simplifyPath(points);
}

/**
 * Ruta por pasillos eligiendo el lado que atraviesa menos parcelas
 * y rodeando el bloque por el perímetro antes de entrar.
 */
export function routeToParcel(
  parcel: Parcel,
  block: ParcelBlock,
): MapCoordinates[] {
  const { row, col } = getParcelGridPosition(parcel.number);
  const approach = pickBestApproach(row, col);

  return buildParcelRoute(parcel, block, approach);
}

export function routeToBlock(block: ParcelBlock): MapCoordinates[] {
  const streetY = getBlockSouthCorridorY(block);
  const streetX = block.origin[1] + BLOCK_WIDTH / 2;
  const spineX = getBoulevardSpineX(block);
  const [startY] = NAV_START_POINT;
  const blockCenterY = block.origin[0] + BLOCK_HEIGHT / 2;

  const points: MapCoordinates[] = [NAV_START_POINT];

  pushPoint(points, [startY, spineX]);
  pushPoint(points, [streetY, spineX]);
  pushPoint(points, [streetY, streetX]);
  pushPoint(points, [blockCenterY, streetX]);

  return simplifyPath(points);
}
