import { applyBlockOutline } from "./block-outline";
import { BLOCK_GAP, BLOCK_ROW_GAP, GREEN_TIER_Y, SOLID_LEFT_ORIGIN_X, VIOLET_TIER_Y } from "./layout";
import { PASILLO_CHAMFER } from "./pasillo-config";
import { BLOCK_HEIGHT, BLOCK_WIDTH } from "./parcel-config";

/** Ancho de la base inferior respecto al ancho total (mayor = diagonal más vertical). */
export const TRAPEZOID_BOTTOM_WIDTH_RATIO = 0.5;

/** Desplazamiento horizontal del borde diagonal a una altura dada desde el tope del escalón. */
export function getDiagonalLeftX(offsetY: number): number {
  const bottomLeftX = BLOCK_WIDTH * (1 - TRAPEZOID_BOTTOM_WIDTH_RATIO);
  return bottomLeftX * (offsetY / BLOCK_HEIGHT);
}

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

/**
 * Bloque inferior derecho: continúa el escalón diagonal del bloque superior izquierdo,
 * incluye el pasillo vertical y el chaflán superior derecho del pasillo.
 */
export function getBottomPasilloStepPath(): string {
  const h = BLOCK_HEIGHT;
  const totalW = 2 * BLOCK_WIDTH + BLOCK_GAP;
  const c = PASILLO_CHAMFER;
  const topLeftX = getDiagonalLeftX(h + BLOCK_ROW_GAP);
  const bottomLeftX = getDiagonalLeftX(2 * h + BLOCK_ROW_GAP);

  return [
    `M ${topLeftX} 0`,
    `L ${totalW - c} 0`,
    `L ${totalW} ${c}`,
    `L ${totalW} ${h}`,
    `L ${bottomLeftX} ${h}`,
    `Z`,
  ].join(" ");
}

export function appendBottomPasilloStepPath(group: SVGGElement, fill: string) {
  const shape = document.createElementNS("http://www.w3.org/2000/svg", "path");
  shape.setAttribute("d", getBottomPasilloStepPath());
  shape.setAttribute("fill", fill);
  applyBlockOutline(shape);
  group.appendChild(shape);
}

/** Tope del escalón diagonal superior (referencia de la pendiente). */
export const ESCALON_TOP_Y = VIOLET_TIER_Y + BLOCK_HEIGHT + BLOCK_ROW_GAP;

/**
 * Triángulo al nivel del primer sector de parcelas verdes: continúa la pendiente
 * del escalón diagonal hasta el borde derecho del sector verde liso (mismo pasillo
 * que entre el bloque verde y la grilla de parcelas).
 */
export function getDiagonalStepTrianglePath(): string {
  const topLeftX = getDiagonalLeftX(GREEN_TIER_Y - ESCALON_TOP_Y);
  const bottomLeftX =
    getDiagonalLeftX(GREEN_TIER_Y + BLOCK_HEIGHT - ESCALON_TOP_Y) - topLeftX;
  const rightX = SOLID_LEFT_ORIGIN_X + 2 * BLOCK_WIDTH + BLOCK_GAP;
  const triWidth = rightX - SOLID_LEFT_ORIGIN_X - topLeftX;
  const triHeight = BLOCK_HEIGHT;

  return [
    `M 0 0`,
    `L ${triWidth} 0`,
    `L ${triWidth} ${triHeight}`,
    `L ${bottomLeftX} ${triHeight}`,
    `Z`,
  ].join(" ");
}

/** Origen [y, x] del triángulo alineado al primer sector verde de parcelas. */
export function getDiagonalStepTriangleOrigin(): [number, number] {
  const topLeftX = getDiagonalLeftX(GREEN_TIER_Y - ESCALON_TOP_Y);
  return [GREEN_TIER_Y, SOLID_LEFT_ORIGIN_X + topLeftX];
}

export function appendDiagonalStepTrianglePath(group: SVGGElement, fill: string) {
  const shape = document.createElementNS("http://www.w3.org/2000/svg", "path");
  shape.setAttribute("d", getDiagonalStepTrianglePath());
  shape.setAttribute("fill", fill);
  applyBlockOutline(shape);
  group.appendChild(shape);
}
