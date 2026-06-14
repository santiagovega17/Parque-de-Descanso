import {
  PASILLO_CHAMFER,
  PASILLO_DIAMOND_FILL,
  PASILLO_DIAMOND_HALF,
  PASILLO_DIAMOND_ICON_ZOOM,
  type PasilloIntersection,
} from "./pasillo-config";
import { PASILLO_INTERSECTIONS } from "./pasillos";
import { BLOCK_HEIGHT, BLOCK_WIDTH } from "./parcel-config";
import type { PasilloInnerCorner } from "./types";

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

function getDiamondPoints(centerX: number, centerY: number, half: number): string {
  return [
    `${centerX},${centerY - half}`,
    `${centerX + half},${centerY}`,
    `${centerX},${centerY + half}`,
    `${centerX - half},${centerY}`,
  ].join(" ");
}

function ensureDefs(svg: SVGSVGElement): SVGDefsElement {
  let defs = svg.querySelector("defs");

  if (!defs) {
    defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
    svg.insertBefore(defs, svg.firstChild);
  }

  return defs;
}

function appendPasilloDiamondClipPath(
  svg: SVGSVGElement,
  id: string,
  points: string,
): string {
  const clipId = `clip-pasillo-${id}`;
  const defs = ensureDefs(svg);
  const clipPath = document.createElementNS("http://www.w3.org/2000/svg", "clipPath");
  clipPath.setAttribute("id", clipId);

  const polygon = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
  polygon.setAttribute("points", points);
  clipPath.appendChild(polygon);
  defs.appendChild(clipPath);

  return clipId;
}

function appendPasilloIcon(
  group: SVGGElement,
  svg: SVGSVGElement,
  intersection: PasilloIntersection,
  points: string,
) {
  const { id, centerX, centerY, iconSrc, iconOffsetY = 0 } = intersection;

  if (!iconSrc) {
    return;
  }

  const clipId = appendPasilloDiamondClipPath(svg, id, points);
  const diamondSize = PASILLO_DIAMOND_HALF * 2;
  const iconSize = diamondSize * PASILLO_DIAMOND_ICON_ZOOM;
  const iconOffset = iconSize / 2;

  const iconGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
  iconGroup.setAttribute("clip-path", `url(#${clipId})`);

  const image = document.createElementNS("http://www.w3.org/2000/svg", "image");
  image.setAttribute("href", iconSrc);
  image.setAttribute("x", String(centerX - iconOffset));
  image.setAttribute("y", String(centerY - iconOffset + iconOffsetY));
  image.setAttribute("width", String(iconSize));
  image.setAttribute("height", String(iconSize));
  image.setAttribute("preserveAspectRatio", "xMidYMid meet");
  image.setAttribute("pointer-events", "none");
  iconGroup.appendChild(image);
  group.appendChild(iconGroup);
}

function appendPasilloDiamond(
  svg: SVGSVGElement,
  intersection: PasilloIntersection,
) {
  const { id, centerX, centerY, label, iconSrc } = intersection;
  const half = PASILLO_DIAMOND_HALF;
  const points = getDiamondPoints(centerX, centerY, half);

  const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
  group.setAttribute("class", "map-pasillo");
  group.setAttribute("data-pasillo-id", id);

  if (iconSrc) {
    group.setAttribute("data-pasillo-selectable", "true");
    group.setAttribute("role", "button");
    group.setAttribute("aria-label", label ?? id);
  }

  const diamond = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
  diamond.setAttribute("class", "map-pasillo-shape");
  diamond.setAttribute("points", points);
  diamond.setAttribute("fill", PASILLO_DIAMOND_FILL);
  diamond.setAttribute("stroke", "#d8d0b0");
  diamond.setAttribute("stroke-width", "2");
  group.appendChild(diamond);

  appendPasilloIcon(group, svg, intersection, points);

  if (iconSrc) {
    const hitArea = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
    hitArea.setAttribute("class", "map-pasillo-hit");
    hitArea.setAttribute("points", points);
    hitArea.setAttribute("fill", "transparent");
    group.appendChild(hitArea);
  }

  svg.appendChild(group);
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
  const defs = ensureDefs(svg);

  const clipId = `clip-${blockId}`;
  const clipPath = document.createElementNS("http://www.w3.org/2000/svg", "clipPath");
  clipPath.setAttribute("id", clipId);

  const polygon = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
  polygon.setAttribute("points", getChamferedBlockPoints(corner));
  clipPath.appendChild(polygon);
  defs.appendChild(clipPath);

  return clipId;
}
