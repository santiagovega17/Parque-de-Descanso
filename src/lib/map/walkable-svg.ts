import { MAP_IMAGE_HEIGHT, MAP_IMAGE_WIDTH } from "./config";
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

  appendRect(
    group,
    { x: 0, y: 0, width: MAP_IMAGE_WIDTH, height: MAP_IMAGE_HEIGHT },
    WALKABLE_FILL,
  );

  for (const rect of getWalkableRects()) {
    appendRect(group, rect, WALKABLE_FILL);
  }

  svg.appendChild(group);
}
