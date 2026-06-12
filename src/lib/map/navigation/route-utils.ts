import type { MapCoordinates } from "../types";

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
