import { BLOCK_HEIGHT, BLOCK_WIDTH, PARCELS_PER_SIDE } from "../parcel-config";
import {
  getColGapX,
  getParcelGridPosition,
  getRowGapY,
} from "../parcel-utils";
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

function getMainStreetTargetY(
  approach: BlockApproach,
  block: ParcelBlock,
): number {
  switch (approach) {
    case "south":
      return getBlockSouthCorridorY(block);
    case "north":
      return getBlockNorthCorridorY(block);
    case "east":
    case "west":
      return getBlockSouthCorridorY(block);
  }
}

/** Recorre la calle principal (marrón, spine lateral) sin pisar el boulevard verde. */
function routeAlongMainStreet(
  points: MapCoordinates[],
  spineX: number,
  targetY: number,
) {
  const [, startX] = NAV_START_POINT;

  if (Math.abs(startX - spineX) > 1) {
    pushPoint(points, [NAV_START_POINT[0], spineX]);
  }

  pushPoint(points, [targetY, spineX]);
}

function routeFromMainStreetToBlockEdge(
  points: MapCoordinates[],
  block: ParcelBlock,
  approach: BlockApproach,
  parcelX: number,
  parcelY: number,
  useGapRouting: boolean,
) {
  const southY = getBlockSouthCorridorY(block);
  const northY = getBlockNorthCorridorY(block);
  const eastX = getBlockEastCorridorX(block);
  const westX = getBlockWestCorridorX(block);
  const bottomEntryRow = PARCELS_PER_SIDE - 2;

  switch (approach) {
    case "south":
      pushPoint(points, [southY, parcelX]);
      break;
    case "north":
      pushPoint(points, [northY, parcelX]);
      break;
    case "east":
      pushPoint(points, [southY, eastX]);
      if (useGapRouting) {
        pushPoint(points, [getRowGapY(block.origin, bottomEntryRow), eastX]);
      } else {
        pushPoint(points, [parcelY, eastX]);
      }
      break;
    case "west":
      pushPoint(points, [southY, westX]);
      if (useGapRouting) {
        pushPoint(points, [getRowGapY(block.origin, bottomEntryRow), westX]);
      } else {
        pushPoint(points, [parcelY, westX]);
      }
      break;
  }
}

/**
 * Dentro del bloque, sigue los pasillos entre parcelas (sin pisar el centro de otras).
 */
function routeThroughParcelGaps(
  points: MapCoordinates[],
  block: ParcelBlock,
  row: number,
  col: number,
  approach: BlockApproach,
) {
  const bottomEntryRow = PARCELS_PER_SIDE - 2;

  switch (approach) {
    case "east": {
      const aisleX = getColGapX(block.origin, col);
      const entryY = getRowGapY(block.origin, bottomEntryRow);
      const turnY = getRowGapY(block.origin, row);

      pushPoint(points, [entryY, aisleX]);
      pushPoint(points, [turnY, aisleX]);

      if (col > 0) {
        pushPoint(points, [turnY, getColGapX(block.origin, col - 1)]);
      }

      break;
    }
    case "west": {
      const aisleX = getColGapX(block.origin, col - 1);
      const entryY = getRowGapY(block.origin, bottomEntryRow);
      const turnY = getRowGapY(block.origin, row);

      pushPoint(points, [entryY, aisleX]);
      pushPoint(points, [turnY, aisleX]);

      if (col < PARCELS_PER_SIDE - 1) {
        pushPoint(points, [turnY, getColGapX(block.origin, col)]);
      }

      break;
    }
    case "south": {
      const aisleX = getColGapX(block.origin, col - 1);
      const entryY = getRowGapY(block.origin, bottomEntryRow);

      pushPoint(points, [entryY, aisleX]);

      if (row > 0) {
        pushPoint(points, [getRowGapY(block.origin, row - 1), aisleX]);
      }

      break;
    }
    case "north": {
      const aisleX = getColGapX(block.origin, col - 1);
      const entryY = getRowGapY(block.origin, 0);
      const turnY = getRowGapY(block.origin, row - 1);

      pushPoint(points, [entryY, aisleX]);
      pushPoint(points, [turnY, aisleX]);
      break;
    }
  }
}

function buildParcelRoute(
  parcel: Parcel,
  block: ParcelBlock,
  approach: BlockApproach,
  row: number,
  col: number,
): MapCoordinates[] {
  const [parcelY, parcelX] = getParcelDestination(parcel);
  const spineX = getBoulevardSpineX(block);
  const mainStreetY = getMainStreetTargetY(approach, block);
  const parcelsCrossed = countParcelsCrossed(row, col, approach);
  const useGapRouting = parcelsCrossed > 0;

  const points: MapCoordinates[] = [NAV_START_POINT];

  routeAlongMainStreet(points, spineX, mainStreetY);
  routeFromMainStreetToBlockEdge(
    points,
    block,
    approach,
    parcelX,
    parcelY,
    useGapRouting,
  );

  if (useGapRouting) {
    routeThroughParcelGaps(points, block, row, col, approach);
  }

  pushPoint(points, [parcelY, parcelX]);

  return simplifyPath(points);
}

export function routeToParcel(
  parcel: Parcel,
  block: ParcelBlock,
): MapCoordinates[] {
  const { row, col } = getParcelGridPosition(parcel.number);
  const approach = pickBestApproach(row, col);

  return buildParcelRoute(parcel, block, approach, row, col);
}

export function routeToBlock(block: ParcelBlock): MapCoordinates[] {
  const streetY = getBlockSouthCorridorY(block);
  const streetX = block.origin[1] + BLOCK_WIDTH / 2;
  const spineX = getBoulevardSpineX(block);
  const blockCenterY = block.origin[0] + BLOCK_HEIGHT / 2;

  const points: MapCoordinates[] = [NAV_START_POINT];

  routeAlongMainStreet(points, spineX, streetY);
  pushPoint(points, [streetY, streetX]);
  pushPoint(points, [blockCenterY, streetX]);

  return simplifyPath(points);
}
