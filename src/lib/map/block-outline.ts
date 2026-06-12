import { WALKABLE_MARGIN_FILL } from "./walkable-config";

/** Ancho visible del contorno blanco alrededor de cada bloque. */
export const BLOCK_OUTLINE_WIDTH = 15;

/** Grosor SVG del trazo (el borde se dibuja mitad adentro, mitad afuera). */
export const BLOCK_OUTLINE_STROKE = BLOCK_OUTLINE_WIDTH * 2;

export function applyBlockOutline(element: SVGElement) {
  element.setAttribute("stroke", WALKABLE_MARGIN_FILL);
  element.setAttribute("stroke-width", String(BLOCK_OUTLINE_STROKE));
  element.setAttribute("paint-order", "stroke fill");
}
