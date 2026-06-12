import { getBlockById } from "../parcels";
import type { MapCoordinates, Parcel, ParcelBlock } from "../types";
import { routeToBlock, routeToParcel } from "./corridor-router";

export { NAV_START_POINT } from "./config";

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
