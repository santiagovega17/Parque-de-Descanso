import { BLOCK_GAP } from "./layout";
import { WALKABLE_FILL } from "./walkable-config";

/** Espacio central entre bloques en intersección tipo pasillo. */
export const PASILLO_CROSS_GAP = BLOCK_GAP;

/** Recorte triangular en esquina interior (~mitad de parcela en la esquina). */
export const PASILLO_CHAMFER = 90;

/** Separación entre el diamante y el borde recortado de los bloques. */
export const PASILLO_DIAMOND_MARGIN = 6;

/** Radio del diamante hasta cada vértice. */
export const PASILLO_DIAMOND_HALF =
  PASILLO_CROSS_GAP / 2 + PASILLO_CHAMFER - PASILLO_DIAMOND_MARGIN;

export const PASILLO_DIAMOND_FILL = WALKABLE_FILL;

export type PasilloIntersection = {
  id: string;
  centerX: number;
  centerY: number;
};
