import { MAP_IMAGE_HEIGHT, MAP_IMAGE_WIDTH } from "./config";
import {
  BLOCK_COLORS,
  BLOCK_HEIGHT,
  BLOCK_PADDING,
  BLOCK_WIDTH,
  PARCEL_GAP,
  PARCEL_LABEL_FONT_SIZE,
  PARCEL_SIZE,
  PARCELS_PER_SIDE,
} from "./parcel-config";
import { applyBlockOutline, BLOCK_OUTLINE_STROKE } from "./block-outline";
import { BOULEVARD } from "./layout";
import { MAP_ICONS } from "./map-icons";
import { appendPasilloClipPath, appendPasillos, getPasilloBlockPoints } from "./pasillo-svg";
import {
  appendRoundaboutBlockPath,
  appendRoundaboutIsland,
} from "./solid-green-roundabout";
import { appendTrapezoidLeftStepPath } from "./solid-green-shapes";
import { getParcelNumber } from "./parcel-utils";
import { appendWalkableAreas } from "./walkable-svg";
import { appendRouteForegroundLayer, appendRouteLayer } from "./navigation/route-svg";
import { WALKABLE_MARGIN_FILL } from "./walkable-config";
import type { ParcelBlock, PasilloInnerCorner } from "./types";

function appendMapIcons(svg: SVGSVGElement) {
  for (const icon of MAP_ICONS) {
    const image = document.createElementNS("http://www.w3.org/2000/svg", "image");
    image.setAttribute("href", icon.src);
    image.setAttribute("x", String(icon.x));
    image.setAttribute("y", String(icon.y));
    image.setAttribute("width", String(icon.width));
    image.setAttribute("height", String(icon.height));
    image.setAttribute("preserveAspectRatio", "xMidYMid meet");
    svg.appendChild(image);
  }
}

function appendBoulevard(svg: SVGSVGElement) {
  const boulevard = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  boulevard.setAttribute("x", String(BOULEVARD.x));
  boulevard.setAttribute("y", String(BOULEVARD.y));
  boulevard.setAttribute("width", String(BOULEVARD.width));
  boulevard.setAttribute("height", String(BOULEVARD.height));
  boulevard.setAttribute("fill", BOULEVARD.fill);
  boulevard.setAttribute("stroke", BOULEVARD.border);
  boulevard.setAttribute("stroke-width", "2");
  svg.appendChild(boulevard);
}

function appendSolidGreenPin(svg: SVGSVGElement) {
  appendRoundaboutIsland(svg);
}

function appendBlockBackground(group: SVGGElement, fill: string, outlined = true) {
  const background = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  background.setAttribute("width", String(BLOCK_WIDTH));
  background.setAttribute("height", String(BLOCK_HEIGHT));
  background.setAttribute("fill", fill);
  if (outlined) {
    applyBlockOutline(background);
  }
  group.appendChild(background);
}

function appendPasilloBlockOutline(
  svg: SVGSVGElement,
  originX: number,
  originY: number,
  corner: PasilloInnerCorner,
) {
  const outline = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
  outline.setAttribute("points", getPasilloBlockPoints(corner));
  outline.setAttribute("fill", "none");
  outline.setAttribute("stroke", WALKABLE_MARGIN_FILL);
  outline.setAttribute("stroke-width", String(BLOCK_OUTLINE_STROKE));
  outline.setAttribute("transform", `translate(${originX}, ${originY})`);
  svg.appendChild(outline);
}

function appendBlock(svg: SVGSVGElement, block: ParcelBlock) {
  const [originY, originX] = block.origin;
  const colors = BLOCK_COLORS[block.variant];
  const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
  group.setAttribute("transform", `translate(${originX}, ${originY})`);

  if (block.pasilloInnerCorner) {
    appendPasilloBlockOutline(svg, originX, originY, block.pasilloInnerCorner);
    const clipId = appendPasilloClipPath(svg, block.id, block.pasilloInnerCorner);
    group.setAttribute("clip-path", `url(#${clipId})`);
  }

  if (block.solid && block.solidRoundabout) {
    appendRoundaboutBlockPath(group, block.solidRoundabout, colors.background);
    svg.appendChild(group);
    return;
  }

  if (block.solid && block.solidShape === "trapezoid-left-step") {
    appendTrapezoidLeftStepPath(group, colors.background);
    svg.appendChild(group);
    return;
  }

  appendBlockBackground(group, colors.background, !block.pasilloInnerCorner);

  if (block.solid) {
    svg.appendChild(group);
    return;
  }

  for (let row = 0; row < PARCELS_PER_SIDE; row += 1) {
    for (let col = 0; col < PARCELS_PER_SIDE; col += 1) {
      const parcelNumber = getParcelNumber(row, col);
      const x = BLOCK_PADDING + col * (PARCEL_SIZE + PARCEL_GAP);
      const y = BLOCK_PADDING + row * (PARCEL_SIZE + PARCEL_GAP);

      const parcelGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
      parcelGroup.setAttribute("class", "map-parcel");
      parcelGroup.setAttribute("data-parcel-id", `${block.id}-${parcelNumber}`);
      parcelGroup.setAttribute("role", "button");
      parcelGroup.setAttribute("aria-label", `Parcela ${parcelNumber}`);

      const parcel = document.createElementNS("http://www.w3.org/2000/svg", "rect");
      parcel.setAttribute("class", "map-parcel-cell");
      parcel.setAttribute("x", String(x));
      parcel.setAttribute("y", String(y));
      parcel.setAttribute("width", String(PARCEL_SIZE));
      parcel.setAttribute("height", String(PARCEL_SIZE));
      parcel.setAttribute("fill", colors.parcel);
      parcelGroup.appendChild(parcel);

      const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
      label.setAttribute("class", "map-parcel-label");
      label.setAttribute("x", String(x + 6));
      label.setAttribute("y", String(y + 18));
      label.setAttribute("fill", "#000000");
      label.setAttribute("font-size", String(PARCEL_LABEL_FONT_SIZE));
      label.setAttribute("font-family", "Arial, Helvetica, sans-serif");
      label.setAttribute("pointer-events", "none");
      label.textContent = String(parcelNumber);
      parcelGroup.appendChild(label);

      group.appendChild(parcelGroup);
    }
  }

  svg.appendChild(group);
}

export function buildMapSvg(blocks: ParcelBlock[]): SVGSVGElement {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", `0 0 ${MAP_IMAGE_WIDTH} ${MAP_IMAGE_HEIGHT}`);
  svg.setAttribute("overflow", "hidden");

  appendWalkableAreas(svg);
  appendBoulevard(svg);

  for (const block of blocks) {
    appendBlock(svg, block);
  }

  appendRouteLayer(svg);
  appendPasillos(svg);
  appendRouteForegroundLayer(svg);
  appendSolidGreenPin(svg);
  appendMapIcons(svg);

  return svg;
}
