import { getBlockById } from "../parcels";
import type { PasilloIntersection } from "../pasillo-config";
import type { MapCoordinates, Parcel, ParcelBlock } from "../types";
import {
  BOULEVARD_CENTER_X,
  BOULEVARD_LEFT_SPINE_X,
  BOULEVARD_RIGHT_SPINE_X,
} from "./corridor-geometry";
import { routeToBlock, routeToParcel, routeToPasillo } from "./corridor-router";

export { NAV_START_POINT } from "./config";

function getPasilloSpineX(centerX: number): number {
  return centerX < BOULEVARD_CENTER_X
    ? BOULEVARD_LEFT_SPINE_X
    : BOULEVARD_RIGHT_SPINE_X;
}

/** Ruta por pasillos hasta el bloque. */
export function findRouteToBlock(block: ParcelBlock): MapCoordinates[] | null {
  const route = routeToBlock(block);

  return route.length >= 2 ? route : null;
}

/** Ruta por pasillos hasta la parcela (sin cruzar el interior del bloque). */
export function findRouteToParcel(parcel: Parcel): MapCoordinates[] | null {
  const block = getBlockById(parcel.blockId);

  if (!block) {
    return null;
  }

  const route = routeToParcel(parcel, block);

  return route.length >= 2 ? route : null;
}

/** Ruta por pasillos hasta una intersección del mapa. */
export function findRouteToPasillo(
  pasillo: PasilloIntersection,
): MapCoordinates[] | null {
  const spineX = getPasilloSpineX(pasillo.centerX);
  const route = routeToPasillo(pasillo.centerY, pasillo.centerX, spineX);

  return route.length >= 2 ? route : null;
}
