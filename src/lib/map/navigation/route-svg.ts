import { MapPin } from "lucide";
import {
  NAV_START_POINT,
  ROUTE_DRAW_SPEED,
  ROUTE_START_ICON_HEIGHT,
  ROUTE_START_ICON_WIDTH,
  ROUTE_STROKE,
  ROUTE_STROKE_WIDTH,
} from "./config";
import { createLucideSvgIcon } from "../lucide-icon";
import { splitRouteLayers } from "./pasillo-route";
import type { MapCoordinates } from "../types";

type AnimatedPolyline = {
  element: SVGPolylineElement;
  length: number;
};

const routeAnimationCleanups = new WeakMap<SVGSVGElement, () => void>();

function createRoutePolyline(points: MapCoordinates[]): SVGPolylineElement {
  const polyline = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
  polyline.setAttribute(
    "points",
    points.map(([y, x]) => `${x},${y}`).join(" "),
  );
  polyline.setAttribute("fill", "none");
  polyline.setAttribute("stroke", ROUTE_STROKE);
  polyline.setAttribute("stroke-width", String(ROUTE_STROKE_WIDTH));
  polyline.setAttribute("stroke-linecap", "round");
  polyline.setAttribute("stroke-linejoin", "round");
  polyline.setAttribute("opacity", "0.92");
  return polyline;
}

function startRouteDrawAnimation(polylines: AnimatedPolyline[]): () => void {
  const totalLength = polylines.reduce((sum, item) => sum + item.length, 0);

  if (totalLength === 0) {
    return () => {};
  }

  for (const { element, length } of polylines) {
    element.style.strokeDasharray = `${length}`;
    element.style.strokeDashoffset = `${length}`;
  }

  let rafId = 0;
  let startTime: number | null = null;

  const frame = (timestamp: number) => {
    if (startTime === null) {
      startTime = timestamp;
    }

    const elapsed = timestamp - startTime;
    const distanceDrawn = Math.min((elapsed / 1000) * ROUTE_DRAW_SPEED, totalLength);

    let remaining = distanceDrawn;
    for (const { element, length } of polylines) {
      if (remaining <= 0) {
        element.style.strokeDashoffset = `${length}`;
      } else if (remaining >= length) {
        element.style.strokeDashoffset = "0";
        remaining -= length;
      } else {
        element.style.strokeDashoffset = `${length - remaining}`;
        remaining = 0;
      }
    }

    if (distanceDrawn < totalLength) {
      rafId = requestAnimationFrame(frame);
    }
  };

  rafId = requestAnimationFrame(frame);

  return () => {
    cancelAnimationFrame(rafId);
  };
}

export function appendRouteLayer(svg: SVGSVGElement) {
  const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
  group.setAttribute("id", "map-route");
  group.setAttribute("pointer-events", "none");
  svg.appendChild(group);
}

export function appendRouteForegroundLayer(svg: SVGSVGElement) {
  const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
  group.setAttribute("id", "map-route-foreground");
  group.setAttribute("pointer-events", "none");
  svg.appendChild(group);
}

export function appendRouteStartMarker(svg: SVGSVGElement) {
  const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
  group.setAttribute("id", "map-route-start");
  group.setAttribute("pointer-events", "none");

  const [startY, startX] = NAV_START_POINT;
  const anchor = document.createElementNS("http://www.w3.org/2000/svg", "g");
  anchor.setAttribute("class", "map-route-start-anchor");
  anchor.setAttribute("transform", `translate(${startX} ${startY})`);

  const ripple = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  ripple.setAttribute("class", "map-route-start-ripple");
  ripple.setAttribute("cx", "0");
  ripple.setAttribute("cy", "0");
  ripple.setAttribute("r", String(ROUTE_START_ICON_WIDTH * 0.175));
  ripple.setAttribute("fill", ROUTE_STROKE);
  anchor.appendChild(ripple);

  const iconPosition = document.createElementNS("http://www.w3.org/2000/svg", "g");
  iconPosition.setAttribute(
    "transform",
    `translate(${-ROUTE_START_ICON_WIDTH / 2} ${-ROUTE_START_ICON_HEIGHT})`,
  );

  const iconPulse = document.createElementNS("http://www.w3.org/2000/svg", "g");
  iconPulse.setAttribute("class", "map-route-start-icon-pulse");

  const startIcon = createLucideSvgIcon(MapPin, {
    width: ROUTE_START_ICON_WIDTH,
    height: ROUTE_START_ICON_HEIGHT,
    color: "#ffffff",
    fill: ROUTE_STROKE,
    strokeWidth: 2,
    className: "map-route-start-icon",
  });
  iconPulse.appendChild(startIcon);
  iconPosition.appendChild(iconPulse);
  anchor.appendChild(iconPosition);
  group.appendChild(anchor);
  svg.appendChild(group);
}

export function syncRouteOverlay(
  svg: SVGSVGElement,
  route: MapCoordinates[] | null,
) {
  const backgroundGroup = svg.querySelector<SVGGElement>("#map-route");
  const foregroundGroup = svg.querySelector<SVGGElement>("#map-route-foreground");

  if (!backgroundGroup || !foregroundGroup) {
    return;
  }

  routeAnimationCleanups.get(svg)?.();
  routeAnimationCleanups.delete(svg);

  backgroundGroup.replaceChildren();
  foregroundGroup.replaceChildren();

  if (!route || route.length < 2) {
    return;
  }

  const segments = splitRouteLayers(route);
  const animatedPolylines: AnimatedPolyline[] = [];

  for (const segment of segments) {
    const group =
      segment.layer === "background" ? backgroundGroup : foregroundGroup;
    const polyline = createRoutePolyline(segment.points);
    group.appendChild(polyline);

    const length = polyline.getTotalLength();
    if (length > 0) {
      animatedPolylines.push({ element: polyline, length });
    } else {
      polyline.style.strokeDasharray = "none";
      polyline.style.strokeDashoffset = "0";
    }
  }

  routeAnimationCleanups.set(svg, startRouteDrawAnimation(animatedPolylines));
}
