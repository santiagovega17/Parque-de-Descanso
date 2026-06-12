import { getWalkableRects } from "./walkable-areas";
import { WALKABLE_FILL, type WalkableRect } from "./walkable-config";

function appendRect(parent: SVGGElement, rect: WalkableRect, fill: string) {
  const shape = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  shape.setAttribute("x", String(rect.x));
  shape.setAttribute("y", String(rect.y));
  shape.setAttribute("width", String(rect.width));
  shape.setAttribute("height", String(rect.height));
  shape.setAttribute("fill", fill);
  parent.appendChild(shape);
}

export function appendWalkableAreas(svg: SVGSVGElement) {
  const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
  group.setAttribute("id", "walkable-areas");

  for (const rect of getWalkableRects()) {
    appendRect(group, rect, WALKABLE_FILL);
  }

  svg.appendChild(group);
}
