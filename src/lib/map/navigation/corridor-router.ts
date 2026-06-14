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
import {
  orthogonalizePath,
  removeSpuriousJogs,
  simplifyPath,
} from "./route-utils";
import { wrapRouteAroundPasillos } from "./pasillo-route";

type BlockApproach = "south" | "north" | "east" | "west";

/** Orden de preferencia: abajo → costados → arriba. */
const APPROACH_PRIORITY: BlockApproach[] = ["south", "east", "west", "north"];

/** Fila superior: siempre entrar por arriba. */
const TOP_ROW_APPROACH_PRIORITY: BlockApproach[] = [
  "north",
  "south",
  "east",
  "west",
];

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
  const priority =
    row === 0 ? TOP_ROW_APPROACH_PRIORITY : APPROACH_PRIORITY;
  let best: BlockApproach = priority[0];
  let bestCount = Infinity;

  for (const approach of priority) {
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

/** Desde la calle principal, entra al bloque en línea recta (atravesando parcelas si hace falta). */
function routeFromMainStreetToParcel(
  points: MapCoordinates[],
  block: ParcelBlock,
  approach: BlockApproach,
  spineX: number,
  parcelX: number,
  parcelY: number,
) {
  const southY = getBlockSouthCorridorY(block);
  const northY = getBlockNorthCorridorY(block);
  const eastX = getBlockEastCorridorX(block);
  const westX = getBlockWestCorridorX(block);

  switch (approach) {
    case "south":
      if (Math.abs(spineX - parcelX) > 1) {
        pushPoint(points, [southY, parcelX]);
      }

      pushPoint(points, [parcelY, parcelX]);
      break;
    case "north":
      if (Math.abs(spineX - parcelX) > 1) {
        pushPoint(points, [northY, parcelX]);
      }

      pushPoint(points, [parcelY, parcelX]);
      break;
    case "east":
      pushPoint(points, [southY, eastX]);
      pushPoint(points, [parcelY, eastX]);

      if (Math.abs(parcelX - eastX) > 1) {
        pushPoint(points, [parcelY, parcelX]);
      }

      break;
    case "west":
      pushPoint(points, [southY, westX]);
      pushPoint(points, [parcelY, westX]);

      if (Math.abs(parcelX - westX) > 1) {
        pushPoint(points, [parcelY, parcelX]);
      }

      break;
  }
}

function finalizeRoute(points: MapCoordinates[]): MapCoordinates[] {
  const simplified = removeSpuriousJogs(simplifyPath(orthogonalizePath(points)));

  return wrapRouteAroundPasillos(simplified);
}

function buildParcelRoute(
  parcel: Parcel,
  block: ParcelBlock,
  approach: BlockApproach,
): MapCoordinates[] {
  const [parcelY, parcelX] = getParcelDestination(parcel, block, approach);
  const spineX = getBoulevardSpineX(block);
  const mainStreetY = getMainStreetTargetY(approach, block);

  const points: MapCoordinates[] = [NAV_START_POINT];

  routeAlongMainStreet(points, spineX, mainStreetY);
  routeFromMainStreetToParcel(
    points,
    block,
    approach,
    spineX,
    parcelX,
    parcelY,
  );

  return finalizeRoute(points);
}

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
  const blockCenterY = block.origin[0] + BLOCK_HEIGHT / 2;

  const points: MapCoordinates[] = [NAV_START_POINT];

  routeAlongMainStreet(points, spineX, streetY);
  pushPoint(points, [streetY, streetX]);
  pushPoint(points, [blockCenterY, streetX]);

  return finalizeRoute(points);
}

export function routeToPasillo(
  centerY: number,
  centerX: number,
  spineX: number,
): MapCoordinates[] {
  const points: MapCoordinates[] = [NAV_START_POINT];

  routeAlongMainStreet(points, spineX, centerY);

  if (Math.abs(spineX - centerX) > 1) {
    pushPoint(points, [centerY, centerX]);
  }

  return finalizeRoute(points);
}
