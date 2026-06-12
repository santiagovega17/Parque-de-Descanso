import type { MapCoordinates, Parcel, ParcelBlock } from "../types";
import { BLOCK_HEIGHT } from "../parcel-config";
import { NAV_START_POINT } from "./config";
import {
  getBlockSouthStreetStop,
  getBoulevardSpineX,
  getParcelDestination,
  getParcelSouthStreetStop,
} from "./corridor-geometry";
import { simplifyPath } from "./route-utils";

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

/**
 * Ruta por pasillos con entrada siempre por la calle de abajo del bloque:
 * boulevard → calle sur → sube por la columna de la parcela → centro.
 */
export function routeToParcel(
  parcel: Parcel,
  block: ParcelBlock,
): MapCoordinates[] {
  const [streetY, streetX] = getParcelSouthStreetStop(parcel, block);
  const [parcelY, parcelX] = getParcelDestination(parcel);
  const spineX = getBoulevardSpineX(block);
  const [startY] = NAV_START_POINT;

  const points: MapCoordinates[] = [NAV_START_POINT];

  pushPoint(points, [startY, spineX]);
  pushPoint(points, [streetY, spineX]);
  pushPoint(points, [streetY, streetX]);
  pushPoint(points, [parcelY, streetX]);

  if (Math.abs(streetX - parcelX) > 1) {
    pushPoint(points, [parcelY, parcelX]);
  }

  return simplifyPath(points);
}

export function routeToBlock(block: ParcelBlock): MapCoordinates[] {
  const [streetY, streetX] = getBlockSouthStreetStop(block);
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
