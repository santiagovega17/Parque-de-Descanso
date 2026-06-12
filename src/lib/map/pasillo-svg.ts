import {
  PASILLO_CHAMFER,
  PASILLO_DIAMOND_FILL,
  PASILLO_DIAMOND_HALF,
  type PasilloIntersection,
} from "./pasillo-config";
import { ORANGE_PASILLO_INTERSECTION } from "./orange-pasillo";
import { SOLID_YELLOW_PASILLO_INTERSECTION } from "./solid-yellow-pasillo";
import { YELLOW_PASILLO_INTERSECTION } from "./yellow-pasillo";
import { BLOCK_HEIGHT, BLOCK_WIDTH } from "./parcel-config";
import type { PasilloInnerCorner } from "./types";

const PASILLO_INTERSECTIONS: PasilloIntersection[] = [
  SOLID_YELLOW_PASILLO_INTERSECTION,
  YELLOW_PASILLO_INTERSECTION,
  ORANGE_PASILLO_INTERSECTION,
];

function getChamferedBlockPoints(corner: PasilloInnerCorner): string {
  const w = BLOCK_WIDTH;
  const h = BLOCK_HEIGHT;
  const c = PASILLO_CHAMFER;

  switch (corner) {
    case "bottom-right":
      return `0,0 ${w},0 ${w},${h - c} ${w - c},${h} 0,${h}`;
    case "bottom-left":
      return `0,0 ${w},0 ${w},${h} ${c},${h} 0,${h - c}`;
    case "top-right":
      return `0,0 ${w - c},0 ${w},${c} ${w},${h} 0,${h}`;
    case "top-left":
      return `0,${c} ${c},0 ${w},0 ${w},${h} 0,${h}`;
  }
}

function appendPasilloDiamond(
  svg: SVGSVGElement,
  { centerX, centerY }: PasilloIntersection,
) {
  const half = PASILLO_DIAMOND_HALF;
  const diamond = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
  diamond.setAttribute(
    "points",
    [
      `${centerX},${centerY - half}`,
      `${centerX + half},${centerY}`,
      `${centerX},${centerY + half}`,
      `${centerX - half},${centerY}`,
    ].join(" "),
  );
  diamond.setAttribute("fill", PASILLO_DIAMOND_FILL);
  diamond.setAttribute("stroke", "#d8d0b0");
  diamond.setAttribute("stroke-width", "2");
  svg.appendChild(diamond);
}

export function appendPasillos(svg: SVGSVGElement) {
  for (const intersection of PASILLO_INTERSECTIONS) {
    appendPasilloDiamond(svg, intersection);
  }
}

export function getPasilloBlockPoints(corner: PasilloInnerCorner): string {
  return getChamferedBlockPoints(corner);
}

export function appendPasilloClipPath(
  svg: SVGSVGElement,
  blockId: string,
  corner: PasilloInnerCorner,
): string {
  let defs = svg.querySelector("defs");
  if (!defs) {
    defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
    svg.insertBefore(defs, svg.firstChild);
  }

  const clipId = `clip-${blockId}`;
  const clipPath = document.createElementNS("http://www.w3.org/2000/svg", "clipPath");
  clipPath.setAttribute("id", clipId);

  const polygon = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
  polygon.setAttribute("points", getChamferedBlockPoints(corner));
  clipPath.appendChild(polygon);
  defs.appendChild(clipPath);

  return clipId;
}
