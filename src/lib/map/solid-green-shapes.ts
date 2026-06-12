import { applyBlockOutline } from "./block-outline";
import { BLOCK_HEIGHT, BLOCK_WIDTH } from "./parcel-config";

/** Ancho de la base inferior respecto al ancho total (≈ un tercio en la referencia). */
export const TRAPEZOID_BOTTOM_WIDTH_RATIO = 0.33;

/**
 * Trapecio rectángulo: borde izquierdo diagonal, base inferior más corta.
 * Vértices: sup-izq → sup-der → inf-der → inf-izq (centro) → cierre.
 */
export function getTrapezoidLeftStepPath(): string {
  const w = BLOCK_WIDTH;
  const h = BLOCK_HEIGHT;
  const bottomLeftX = w * (1 - TRAPEZOID_BOTTOM_WIDTH_RATIO);

  return [`M 0 0`, `L ${w} 0`, `L ${w} ${h}`, `L ${bottomLeftX} ${h}`, `Z`].join(" ");
}

export function appendTrapezoidLeftStepPath(group: SVGGElement, fill: string) {
  const shape = document.createElementNS("http://www.w3.org/2000/svg", "path");
  shape.setAttribute("d", getTrapezoidLeftStepPath());
  shape.setAttribute("fill", fill);
  applyBlockOutline(shape);
  group.appendChild(shape);
}
