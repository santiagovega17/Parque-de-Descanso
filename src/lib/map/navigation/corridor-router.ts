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

const BLOCK_APPROACHES: BlockApproach[] = ["south", "north", "east", "west"];

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

  for (const approach of BLOCK_APPROACHES) {
    const count = countParcelsCrossed(row, col, approach);

    if (count < bestCount) {
      bestCount = count;
      best = approach;
    }
  }

  return best;
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

  switch (approach) {
    case "south": {
      const streetY = getBlockSouthCorridorY(block);
      pushPoint(points, [streetY, spineX]);
      pushPoint(points, [streetY, parcelX]);
      pushPoint(points, [parcelY, parcelX]);
      break;
    }
    case "north": {
      const streetY = getBlockNorthCorridorY(block);
      pushPoint(points, [streetY, spineX]);
      pushPoint(points, [streetY, parcelX]);
      pushPoint(points, [parcelY, parcelX]);
      break;
    }
    case "east": {
      const streetX = getBlockEastCorridorX(block);
      pushPoint(points, [parcelY, spineX]);
      pushPoint(points, [parcelY, streetX]);
      if (Math.abs(streetX - parcelX) > 1) {
        pushPoint(points, [parcelY, parcelX]);
      }
      break;
    }
    case "west": {
      const streetX = getBlockWestCorridorX(block);
      pushPoint(points, [parcelY, spineX]);
      pushPoint(points, [parcelY, streetX]);
      if (Math.abs(streetX - parcelX) > 1) {
        pushPoint(points, [parcelY, parcelX]);
      }
      break;
    }
  }

  return simplifyPath(points);
}

/**
 * Ruta por pasillos eligiendo el lado del bloque que atraviesa menos parcelas.
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
