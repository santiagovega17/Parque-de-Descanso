import { AUTO_DESTINATION, SALAS_VELATORIAS_DESTINATION } from "./map-icons";
import { ORANGE_PASILLO_INTERSECTION } from "./orange-pasillo";
import { SOLID_YELLOW_PASILLO_INTERSECTION } from "./solid-yellow-pasillo";
import { YELLOW_PASILLO_INTERSECTION } from "./yellow-pasillo";
import type { PasilloIntersection } from "./pasillo-config";

export const PASILLO_INTERSECTIONS: PasilloIntersection[] = [
  SOLID_YELLOW_PASILLO_INTERSECTION,
  YELLOW_PASILLO_INTERSECTION,
  ORANGE_PASILLO_INTERSECTION,
  AUTO_DESTINATION,
  SALAS_VELATORIAS_DESTINATION,
];

export function getPasilloById(id: string): PasilloIntersection | undefined {
  return PASILLO_INTERSECTIONS.find((pasillo) => pasillo.id === id);
}
