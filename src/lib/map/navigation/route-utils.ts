import type { MapCoordinates } from "../types";

/** Inserta un vértice intermedio si hace falta para evitar segmentos diagonales. */
export function orthogonalizePath(points: MapCoordinates[]): MapCoordinates[] {
  if (points.length <= 1) {
    return points;
  }

  const result: MapCoordinates[] = [points[0]];

  for (let i = 1; i < points.length; i += 1) {
    const [prevY, prevX] = result[result.length - 1];
    const [targetY, targetX] = points[i];
    const alignedX = Math.abs(prevX - targetX) < 1;
    const alignedY = Math.abs(prevY - targetY) < 1;

    if (!alignedX && !alignedY) {
      result.push([prevY, targetX]);
    }

    result.push(points[i]);
  }

  return result;
}

export function simplifyPath(points: MapCoordinates[]): MapCoordinates[] {
  if (points.length <= 2) {
    return points;
  }

  const simplified: MapCoordinates[] = [points[0]];

  for (let i = 1; i < points.length - 1; i += 1) {
    const [prevY, prevX] = points[i - 1];
    const [currY, currX] = points[i];
    const [nextY, nextX] = points[i + 1];

    const collinearX =
      Math.abs(prevX - currX) < 1 && Math.abs(currX - nextX) < 1;
    const collinearY =
      Math.abs(prevY - currY) < 1 && Math.abs(currY - nextY) < 1;

    if (!collinearX && !collinearY) {
      simplified.push(points[i]);
    }
  }

  simplified.push(points[points.length - 1]);
  return simplified;
}
