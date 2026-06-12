import {
  NAV_START_POINT,
  ROUTE_START_FILL,
  ROUTE_START_RADIUS,
  ROUTE_STROKE,
  ROUTE_STROKE_WIDTH,
} from "./config";
import type { MapCoordinates } from "../types";

export function syncRouteOverlay(
  svg: SVGSVGElement,
  route: MapCoordinates[] | null,
) {
  let group = svg.querySelector<SVGGElement>("#map-route");

  if (!group) {
    group = document.createElementNS("http://www.w3.org/2000/svg", "g");
    group.setAttribute("id", "map-route");
    group.setAttribute("pointer-events", "none");
    svg.appendChild(group);
  }

  group.replaceChildren();

  if (!route || route.length < 2) {
    return;
  }

  const polyline = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
  polyline.setAttribute(
    "points",
    route.map(([y, x]) => `${x},${y}`).join(" "),
  );
  polyline.setAttribute("fill", "none");
  polyline.setAttribute("stroke", ROUTE_STROKE);
  polyline.setAttribute("stroke-width", String(ROUTE_STROKE_WIDTH));
  polyline.setAttribute("stroke-linecap", "round");
  polyline.setAttribute("stroke-linejoin", "round");
  polyline.setAttribute("opacity", "0.92");
  group.appendChild(polyline);

  const [startY, startX] = NAV_START_POINT;
  const startRing = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  startRing.setAttribute("cx", String(startX));
  startRing.setAttribute("cy", String(startY));
  startRing.setAttribute("r", String(ROUTE_START_RADIUS));
  startRing.setAttribute("fill", ROUTE_START_FILL);
  startRing.setAttribute("stroke", "#ffffff");
  startRing.setAttribute("stroke-width", "3");
  group.appendChild(startRing);
}
