import { BLOCK_GAP, SOLID_LEFT_ORIGIN_X, VIOLET_TIER_Y } from "./layout";
import { applyBlockOutline } from "./block-outline";
import { BLOCK_COLORS, BLOCK_HEIGHT, BLOCK_WIDTH } from "./parcel-config";

/** Radio del círculo verde central. */
export const ROUNDABOUT_RADIUS = 52;

/** Separación entre el círculo central y el arco cóncavo de los bloques. */
export const ROUNDABOUT_CLEARANCE = BLOCK_GAP / 2;

/** Radio del arco cóncavo (círculo de referencia del hueco). */
export const ROUNDABOUT_CUT_RADIUS = ROUNDABOUT_RADIUS + ROUNDABOUT_CLEARANCE;

/** Centro vertical de la rotonda respecto al borde superior del bloque. */
export const ROUNDABOUT_CENTER_Y = -18;

function circleEdgeOffset(arcRadius: number, axisDistance: number): number {
  return Math.sqrt(arcRadius * arcRadius - axisDistance * axisDistance);
}

export function getRoundaboutCenter(blockTopY: number): { cx: number; cy: number } {
  return {
    cx: SOLID_LEFT_ORIGIN_X + BLOCK_WIDTH + BLOCK_GAP / 2,
    cy: blockTopY + ROUNDABOUT_CENTER_Y,
  };
}

/**
 * Bloque superior izquierdo: esquina superior derecha con arco convexo hacia la rotonda.
 */
export function getRoundaboutLeftBlockPath(): string {
  const w = BLOCK_WIDTH;
  const h = BLOCK_HEIGHT;
  const cx = w + BLOCK_GAP / 2;
  const cy = ROUNDABOUT_CENTER_Y;
  const r = ROUNDABOUT_CUT_RADIUS;

  const topX = cx - circleEdgeOffset(r, cy);
  const rightY = cy + circleEdgeOffset(r, w - cx);

  return [
    `M 0 0`,
    `L ${topX} 0`,
    `A ${r} ${r} 0 0 0 ${w} ${rightY}`,
    `L ${w} ${h}`,
    `L 0 ${h}`,
    `Z`,
  ].join(" ");
}

/**
 * Bloque superior derecho: esquina superior izquierda con arco convexo.
 */
export function getRoundaboutRightBlockPath(): string {
  const w = BLOCK_WIDTH;
  const h = BLOCK_HEIGHT;
  const cx = -BLOCK_GAP / 2;
  const cy = ROUNDABOUT_CENTER_Y;
  const r = ROUNDABOUT_CUT_RADIUS;

  const topX = cx + circleEdgeOffset(r, cy);
  const leftY = cy + circleEdgeOffset(r, cx);

  return [
    `M ${topX} 0`,
    `L ${w} 0`,
    `L ${w} ${h}`,
    `L 0 ${h}`,
    `L 0 ${leftY}`,
    `A ${r} ${r} 0 0 0 ${topX} 0`,
    `Z`,
  ].join(" ");
}

export function appendRoundaboutBlockPath(
  group: SVGGElement,
  side: "left" | "right",
  fill: string,
) {
  const d =
    side === "left"
      ? getRoundaboutLeftBlockPath()
      : getRoundaboutRightBlockPath();

  const shape = document.createElementNS("http://www.w3.org/2000/svg", "path");
  shape.setAttribute("d", d);
  shape.setAttribute("fill", fill);
  applyBlockOutline(shape);
  group.appendChild(shape);
}

/** Isla verde central de la rotonda. */
export function appendRoundaboutIsland(svg: SVGSVGElement) {
  const { cx, cy } = getRoundaboutCenter(VIOLET_TIER_Y);

  const island = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  island.setAttribute("cx", String(cx));
  island.setAttribute("cy", String(cy));
  island.setAttribute("r", String(ROUNDABOUT_RADIUS));
  island.setAttribute("fill", BLOCK_COLORS.greenDark.background);
  applyBlockOutline(island);
  svg.appendChild(island);
}
