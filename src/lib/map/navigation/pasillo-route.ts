import {
  PASILLO_DIAMOND_HALF,
  type PasilloIntersection,
} from "../pasillo-config";
import { PASILLO_INTERSECTIONS } from "../pasillos";
import type { MapCoordinates } from "../types";

const TOL = 4;

type Cardinal = "north" | "south" | "east" | "west";

type DiamondVertices = Record<Cardinal, MapCoordinates>;

/** Giros y rodeos del rombo. Solo oeste↔este usa el borde inferior. */
const DETOUR_PATH: Partial<Record<`${Cardinal}-${Cardinal}`, Cardinal[]>> = {
  /** Entrada lateral hacia arriba: borde superior. */
  "west-north": ["west", "north"],
  "east-north": ["east", "north"],
  /** Entrada lateral hacia abajo: borde inferior. */
  "west-south": ["west", "south"],
  "east-south": ["east", "south"],
  /** Giros restantes entre vértices adyacentes. */
  "north-west": ["north", "west"],
  "north-east": ["north", "east"],
  "south-west": ["south", "west"],
  "south-east": ["south", "east"],
  /** Atravesar de izquierda a derecha (o viceversa): siempre por abajo. */
  "west-east": ["west", "south", "east"],
  "east-west": ["east", "south", "west"],
  /** Atravesar verticalmente: por arriba (vía este). */
  "north-south": ["north", "east", "south"],
  "south-north": ["south", "east", "north"],
};

function getDiamondVertices(pasillo: PasilloIntersection): DiamondVertices {
  const { centerY, centerX } = pasillo;
  const half = PASILLO_DIAMOND_HALF;

  return {
    north: [centerY - half, centerX],
    south: [centerY + half, centerX],
    east: [centerY, centerX + half],
    west: [centerY, centerX - half],
  };
}

function pointsNear(a: MapCoordinates, b: MapCoordinates): boolean {
  return Math.abs(a[0] - b[0]) < TOL && Math.abs(a[1] - b[1]) < TOL;
}

function pushUnique(points: MapCoordinates[], point: MapCoordinates) {
  const previous = points[points.length - 1];

  if (previous && pointsNear(previous, point)) {
    return;
  }

  points.push(point);
}

function isAtPasilloCenter(
  [y, x]: MapCoordinates,
  { centerY, centerX }: PasilloIntersection,
): boolean {
  return Math.abs(y - centerY) < TOL && Math.abs(x - centerX) < TOL;
}

function isInsideDiamond(
  [y, x]: MapCoordinates,
  { centerY, centerX }: PasilloIntersection,
): boolean {
  const half = PASILLO_DIAMOND_HALF;
  const dx = Math.abs(x - centerX);
  const dy = Math.abs(y - centerY);

  return dx / half + dy / half <= 1.01;
}

function getDirection(from: MapCoordinates, to: MapCoordinates): Cardinal | null {
  const [fromY, fromX] = from;
  const [toY, toX] = to;

  if (Math.abs(fromY - toY) < TOL && Math.abs(fromX - toX) > TOL) {
    return toX > fromX ? "east" : "west";
  }

  if (Math.abs(fromX - toX) < TOL && Math.abs(fromY - toY) > TOL) {
    return toY > fromY ? "south" : "north";
  }

  return null;
}

function getApproachSide(
  from: MapCoordinates,
  pasillo: PasilloIntersection,
): Cardinal {
  const dy = from[0] - pasillo.centerY;
  const dx = from[1] - pasillo.centerX;

  if (Math.abs(dx) >= Math.abs(dy)) {
    return dx < 0 ? "west" : "east";
  }

  return dy < 0 ? "north" : "south";
}

function isPasilloVertexOf(
  point: MapCoordinates,
  pasillo: PasilloIntersection,
): boolean {
  const vertices = getDiamondVertices(pasillo);

  return Object.values(vertices).some((vertex) => pointsNear(point, vertex));
}

function getPasilloTurnExit(
  target: MapCoordinates,
  pasillo: PasilloIntersection,
  approachSide: Cardinal,
  segmentExit: Cardinal,
): Cardinal {
  const [targetY] = target;
  const { centerY } = pasillo;

  if (approachSide === "west") {
    if (segmentExit === "east") {
      return "east";
    }

    return targetY < centerY ? "north" : "south";
  }

  if (approachSide === "east") {
    if (segmentExit === "west") {
      return "west";
    }

    return targetY < centerY ? "north" : "south";
  }

  if (approachSide === "north") {
    return segmentExit === "south" ? "south" : segmentExit;
  }

  return segmentExit;
}

function getDetourVertices(
  entry: Cardinal,
  exit: Cardinal,
  vertices: DiamondVertices,
): MapCoordinates[] {
  const path = DETOUR_PATH[`${entry}-${exit}`];

  if (!path) {
    return [];
  }

  return path.map((name) => vertices[name]);
}

function isPasilloTurn(
  prev: MapCoordinates,
  curr: MapCoordinates,
  next: MapCoordinates,
  pasillo: PasilloIntersection,
): boolean {
  const entry = getDirection(prev, curr);
  const exit = getDirection(curr, next);

  if (!entry || !exit || entry === exit) {
    return false;
  }

  if (isAtPasilloCenter(curr, pasillo) || isInsideDiamond(curr, pasillo)) {
    return true;
  }

  const onCross =
    Math.abs(curr[0] - pasillo.centerY) < TOL &&
    Math.abs(curr[1] - pasillo.centerX) < TOL;

  return onCross;
}

function horizontalCrossesPasillo(
  prev: MapCoordinates,
  curr: MapCoordinates,
  pasillo: PasilloIntersection,
): boolean {
  if (
    Math.abs(prev[0] - pasillo.centerY) > TOL ||
    Math.abs(curr[0] - pasillo.centerY) > TOL
  ) {
    return false;
  }

  if (isPasilloVertexOf(prev, pasillo) || isPasilloVertexOf(curr, pasillo)) {
    return false;
  }

  if (isInsideDiamond(prev, pasillo) || isInsideDiamond(curr, pasillo)) {
    return false;
  }

  const minX = Math.min(prev[1], curr[1]);
  const maxX = Math.max(prev[1], curr[1]);
  const half = PASILLO_DIAMOND_HALF;

  return (
    minX < pasillo.centerX - half - TOL &&
    maxX > pasillo.centerX + half + TOL
  );
}

function verticalCrossesPasillo(
  prev: MapCoordinates,
  curr: MapCoordinates,
  pasillo: PasilloIntersection,
): boolean {
  if (
    Math.abs(prev[1] - pasillo.centerX) > TOL ||
    Math.abs(curr[1] - pasillo.centerX) > TOL
  ) {
    return false;
  }

  if (isPasilloVertexOf(prev, pasillo) || isPasilloVertexOf(curr, pasillo)) {
    return false;
  }

  if (isInsideDiamond(prev, pasillo) || isInsideDiamond(curr, pasillo)) {
    return false;
  }

  const minY = Math.min(prev[0], curr[0]);
  const maxY = Math.max(prev[0], curr[0]);
  const half = PASILLO_DIAMOND_HALF;

  return (
    minY < pasillo.centerY - half - TOL &&
    maxY > pasillo.centerY + half + TOL
  );
}

function wrapPasilloTurns(
  points: MapCoordinates[],
  pasillo: PasilloIntersection,
  vertices: DiamondVertices,
): MapCoordinates[] {
  const result: MapCoordinates[] = [];

  for (let i = 0; i < points.length; i += 1) {
    const curr = points[i];
    const isLast = i === points.length - 1;

    if (isLast && isAtPasilloCenter(curr, pasillo)) {
      pushUnique(result, curr);
      continue;
    }

    if (i > 0 && i < points.length - 1) {
      const prev = points[i - 1];
      const next = points[i + 1];

      if (isPasilloTurn(prev, curr, next, pasillo)) {
        const segmentExit = getDirection(curr, next);
        const approachSide = getApproachSide(prev, pasillo);

        if (segmentExit) {
          const exit = getPasilloTurnExit(
            next,
            pasillo,
            approachSide,
            segmentExit,
          );
          const detour = getDetourVertices(approachSide, exit, vertices);

          if (detour.length > 0) {
            for (const point of detour) {
              pushUnique(result, point);
            }

            continue;
          }
        }
      }
    }

    pushUnique(result, curr);
  }

  return result;
}

function wrapPasilloCrossings(
  points: MapCoordinates[],
  pasillo: PasilloIntersection,
  vertices: DiamondVertices,
): MapCoordinates[] {
  if (points.length < 2) {
    return points;
  }

  const result: MapCoordinates[] = [points[0]];

  for (let i = 1; i < points.length; i += 1) {
    const prev = result[result.length - 1];
    const curr = points[i];
    const entry = getDirection(prev, curr);

    if (entry && horizontalCrossesPasillo(prev, curr, pasillo)) {
      const detour =
        entry === "east"
          ? getDetourVertices("west", "east", vertices)
          : getDetourVertices("east", "west", vertices);

      for (const point of detour) {
        pushUnique(result, point);
      }

      pushUnique(result, curr);
      continue;
    }

    if (entry && verticalCrossesPasillo(prev, curr, pasillo)) {
      const detour =
        entry === "south"
          ? getDetourVertices("north", "south", vertices)
          : getDetourVertices("south", "north", vertices);

      for (const point of detour) {
        pushUnique(result, point);
      }

      pushUnique(result, curr);
      continue;
    }

    pushUnique(result, curr);
  }

  return result;
}

function wrapRouteAroundPasillo(
  points: MapCoordinates[],
  pasillo: PasilloIntersection,
): MapCoordinates[] {
  const vertices = getDiamondVertices(pasillo);
  const withTurns = wrapPasilloTurns(points, pasillo, vertices);

  return wrapPasilloCrossings(withTurns, pasillo, vertices);
}

export function wrapRouteAroundPasillos(
  points: MapCoordinates[],
): MapCoordinates[] {
  let result = points;

  for (const pasillo of PASILLO_INTERSECTIONS) {
    result = wrapRouteAroundPasillo(result, pasillo);
  }

  return orthogonalizePasilloConnectors(result);
}

function getPasilloVertexLabel(
  point: MapCoordinates,
  pasillo: PasilloIntersection,
): Cardinal | null {
  const vertices = getDiamondVertices(pasillo);

  if (pointsNear(point, vertices.west)) {
    return "west";
  }

  if (pointsNear(point, vertices.north)) {
    return "north";
  }

  if (pointsNear(point, vertices.south)) {
    return "south";
  }

  if (pointsNear(point, vertices.east)) {
    return "east";
  }

  return null;
}

function getPasilloVertexLabelAny(point: MapCoordinates): Cardinal | null {
  for (const pasillo of PASILLO_INTERSECTIONS) {
    const label = getPasilloVertexLabel(point, pasillo);

    if (label) {
      return label;
    }
  }

  return null;
}

function getPasilloConnectorCorner(
  prev: MapCoordinates,
  curr: MapCoordinates,
  vertex: Cardinal,
): MapCoordinates {
  const [prevY, prevX] = prev;
  const [currY, currX] = curr;

  switch (vertex) {
    case "south":
    case "north":
      if (Math.abs(currY - prevY) > TOL) {
        return [currY, prevX];
      }

      return [prevY, currX];
    case "west":
    case "east":
      if (Math.abs(currX - prevX) > TOL) {
        return [prevY, currX];
      }

      return [currY, prevX];
  }
}

function orthogonalizePasilloConnectors(
  points: MapCoordinates[],
): MapCoordinates[] {
  if (points.length < 2) {
    return points;
  }

  const result: MapCoordinates[] = [points[0]];

  for (let i = 1; i < points.length; i += 1) {
    const prev = result[result.length - 1];
    const curr = points[i];
    const alignedX = Math.abs(prev[1] - curr[1]) < TOL;
    const alignedY = Math.abs(prev[0] - curr[0]) < TOL;
    const vertexLabel = getPasilloVertexLabelAny(prev);

    if (vertexLabel && !isAnyPasilloVertex(curr) && !alignedX && !alignedY) {
      pushUnique(result, getPasilloConnectorCorner(prev, curr, vertexLabel));
    }

    pushUnique(result, curr);
  }

  return result;
}

function isPasilloVertex(
  point: MapCoordinates,
  pasillo: PasilloIntersection,
): boolean {
  return isPasilloVertexOf(point, pasillo);
}

export function isAnyPasilloVertex(point: MapCoordinates): boolean {
  return PASILLO_INTERSECTIONS.some((pasillo) =>
    isPasilloVertex(point, pasillo),
  );
}

export type RouteSegment = {
  layer: "background" | "foreground";
  points: MapCoordinates[];
};

/** Separa tramos sobre el borde del rombo (adelante) del resto (atrás). */
export function splitRouteLayers(route: MapCoordinates[]): RouteSegment[] {
  const segments: RouteSegment[] = [];

  if (route.length < 2) {
    return segments;
  }

  let backgroundChunk: MapCoordinates[] = [];

  for (let i = 0; i < route.length; i += 1) {
    const point = route[i];

    if (!isAnyPasilloVertex(point)) {
      backgroundChunk.push(point);
      continue;
    }

    if (backgroundChunk.length > 0) {
      backgroundChunk.push(point);

      if (backgroundChunk.length >= 2) {
        segments.push({ layer: "background", points: backgroundChunk });
      }

      backgroundChunk = [];
    }

    const foregroundChunk = [point];

    while (i + 1 < route.length && isAnyPasilloVertex(route[i + 1])) {
      i += 1;
      foregroundChunk.push(route[i]);
    }

    if (foregroundChunk.length >= 2) {
      segments.push({ layer: "foreground", points: foregroundChunk });
      backgroundChunk = [foregroundChunk[foregroundChunk.length - 1]];
    } else {
      backgroundChunk = [point];
    }
  }

  if (backgroundChunk.length >= 2) {
    segments.push({ layer: "background", points: backgroundChunk });
  }

  return segments;
}
