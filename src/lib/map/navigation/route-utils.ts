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
      const deltaX = Math.abs(targetX - prevX);
      const deltaY = Math.abs(targetY - prevY);

      if (deltaY >= deltaX) {
        result.push([targetY, prevX]);
      } else {
        result.push([prevY, targetX]);
      }
    }

    result.push(points[i]);
  }

  return result;
}

/**
 * Elimina escalones en Z: un desvío horizontal o vertical breve entre dos
 * tramos rectos colineales.
 */
export function removeSpuriousJogs(points: MapCoordinates[]): MapCoordinates[] {
  let result = [...points];
  let changed = true;

  while (changed && result.length >= 3) {
    changed = false;
    const next: MapCoordinates[] = [result[0]];

    for (let i = 1; i < result.length - 1; i += 1) {
      const [py, px] = next[next.length - 1];
      const [cy, cx] = result[i];
      const [ny, nx] = result[i + 1];

      const verticalJog =
        Math.abs(px - nx) < 1 &&
        Math.abs(px - cx) > 1 &&
        (cy - py) * (ny - cy) > 0;

      const horizontalJog =
        Math.abs(py - ny) < 1 &&
        Math.abs(py - cy) > 1 &&
        (cx - px) * (nx - cx) > 0;

      if (verticalJog || horizontalJog) {
        changed = true;
        continue;
      }

      next.push(result[i]);
    }

    next.push(result[result.length - 1]);
    result = next;
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
