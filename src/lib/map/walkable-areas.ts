import {
  BLOCK_GAP,
  BOULEVARD,
  BOULEVARD_SIDE_GAP,
  GREEN_TIER_Y,
  LEFT_COLUMNS,
  LEFT_GRID_WIDTH,
  LEFT_ORIGIN_X,
  ORANGE_TIER_Y,
  PINK_TIER_Y,
  RIGHT_COLUMNS,
  RIGHT_GRID_WIDTH,
  RIGHT_ORIGIN_X,
  SOLID_LEFT_ORIGIN_X,
  TIER_GAP,
  VIOLET_TIER_Y,
  VIOLET_TOP_TIER_Y,
} from "./layout";
import { BLOCK_HEIGHT, BLOCK_WIDTH } from "./parcel-config";
import {
  ORANGE_PASILLO_ORIGIN_X,
  ORANGE_PASILLO_ORIGIN_Y,
} from "./orange-pasillo";
import {
  YELLOW_PASILLO_ORIGIN_X,
  YELLOW_PASILLO_ORIGIN_Y,
} from "./yellow-pasillo";
import type { WalkableRect } from "./walkable-config";

function addColumnGaps(
  rects: WalkableRect[],
  baseY: number,
  baseX: number,
  rows: number,
  cols: number,
  gap = BLOCK_GAP,
) {
  const rowSpan = rows * BLOCK_HEIGHT + (rows - 1) * gap;

  for (let col = 0; col < cols - 1; col += 1) {
    rects.push({
      x: baseX + (col + 1) * BLOCK_WIDTH + col * gap,
      y: baseY,
      width: gap,
      height: rowSpan,
    });
  }
}

function addRowGaps(
  rects: WalkableRect[],
  baseY: number,
  baseX: number,
  rows: number,
  cols: number,
  gap = BLOCK_GAP,
) {
  const colSpan = cols * BLOCK_WIDTH + (cols - 1) * gap;

  for (let row = 0; row < rows - 1; row += 1) {
    rects.push({
      x: baseX,
      y: baseY + (row + 1) * BLOCK_HEIGHT + row * gap,
      width: colSpan,
      height: gap,
    });
  }
}

function addGridGaps(
  rects: WalkableRect[],
  baseY: number,
  baseX: number,
  rows: number,
  cols: number,
  gap = BLOCK_GAP,
) {
  addColumnGaps(rects, baseY, baseX, rows, cols, gap);
  addRowGaps(rects, baseY, baseX, rows, cols, gap);
}

function addTierGap(
  rects: WalkableRect[],
  y: number,
  segments: Array<{ x: number; width: number }>,
) {
  for (const segment of segments) {
    rects.push({
      x: segment.x,
      y,
      width: segment.width,
      height: TIER_GAP,
    });
  }
}

function addBoulevardSidePaths(rects: WalkableRect[]) {
  rects.push({
    x: BOULEVARD.x - BOULEVARD_SIDE_GAP,
    y: BOULEVARD.y,
    width: BOULEVARD_SIDE_GAP,
    height: BOULEVARD.height,
  });
  rects.push({
    x: BOULEVARD.x + BOULEVARD.width,
    y: BOULEVARD.y,
    width: BOULEVARD_SIDE_GAP,
    height: BOULEVARD.height,
  });
}

function addLeftSectorWidthTierGap(rects: WalkableRect[], y: number) {
  addTierGap(rects, y, [
    {
      x: SOLID_LEFT_ORIGIN_X,
      width: LEFT_ORIGIN_X + LEFT_GRID_WIDTH - SOLID_LEFT_ORIGIN_X,
    },
  ]);
}

function addRightSectorWidthTierGap(rects: WalkableRect[], y: number) {
  addTierGap(rects, y, [
    {
      x: RIGHT_ORIGIN_X,
      width: RIGHT_GRID_WIDTH,
    },
  ]);
}

/** Rectángulos de todas las zonas caminables del plano. */
export function getWalkableRects(): WalkableRect[] {
  const rects: WalkableRect[] = [];

  addBoulevardSidePaths(rects);

  // Sector verde liso izquierdo (2×3).
  addGridGaps(rects, VIOLET_TIER_Y, SOLID_LEFT_ORIGIN_X, 3, 2);

  // Pasillo entre bloques lisos y grilla de parcelas.
  rects.push({
    x: SOLID_LEFT_ORIGIN_X + 2 * BLOCK_WIDTH + BLOCK_GAP,
    y: VIOLET_TIER_Y,
    width: BLOCK_GAP,
    height: 3 * BLOCK_HEIGHT + 2 * BLOCK_GAP,
  });

  // Bloque 28 (solo fila superior violeta).
  // Sin gaps internos.

  // Fila violeta (1×3).
  addGridGaps(rects, VIOLET_TIER_Y, LEFT_ORIGIN_X, 1, LEFT_COLUMNS);

  // Sector rosa derecho (2×2).
  addGridGaps(rects, PINK_TIER_Y, RIGHT_ORIGIN_X, 2, RIGHT_COLUMNS);

  // Sector amarillo: columna lateral + pasillo 2×2.
  addRowGaps(rects, YELLOW_PASILLO_ORIGIN_Y, LEFT_ORIGIN_X, 2, 1);
  addGridGaps(rects, YELLOW_PASILLO_ORIGIN_Y, YELLOW_PASILLO_ORIGIN_X, 2, 2);
  rects.push({
    x: LEFT_ORIGIN_X + BLOCK_WIDTH,
    y: YELLOW_PASILLO_ORIGIN_Y,
    width: BLOCK_GAP,
    height: 2 * BLOCK_HEIGHT + BLOCK_GAP,
  });

  // Sector naranja: pasillo 2×2.
  addGridGaps(rects, ORANGE_PASILLO_ORIGIN_Y, ORANGE_PASILLO_ORIGIN_X, 2, 2);

  // Sector verde inferior (2×3).
  addGridGaps(rects, GREEN_TIER_Y, LEFT_ORIGIN_X, 2, LEFT_COLUMNS);

  // Sector azul inferior (2×2).
  addGridGaps(rects, GREEN_TIER_Y, RIGHT_ORIGIN_X, 2, RIGHT_COLUMNS);

  // Pasillos horizontales entre niveles.
  addLeftSectorWidthTierGap(rects, VIOLET_TOP_TIER_Y + BLOCK_HEIGHT);
  addRightSectorWidthTierGap(rects, VIOLET_TOP_TIER_Y + BLOCK_HEIGHT);

  addLeftSectorWidthTierGap(rects, VIOLET_TIER_Y + BLOCK_HEIGHT);
  addRightSectorWidthTierGap(rects, VIOLET_TIER_Y + BLOCK_HEIGHT);

  addLeftSectorWidthTierGap(rects, ORANGE_TIER_Y + 2 * BLOCK_HEIGHT + BLOCK_GAP);
  addRightSectorWidthTierGap(rects, ORANGE_TIER_Y + 2 * BLOCK_HEIGHT + BLOCK_GAP);

  // Pasillos laterales del boulevard en cada cruce de nivel.
  const boulevardTierGaps = [
    VIOLET_TOP_TIER_Y + BLOCK_HEIGHT,
    VIOLET_TIER_Y + BLOCK_HEIGHT,
    ORANGE_TIER_Y + 2 * BLOCK_HEIGHT + BLOCK_GAP,
  ];

  for (const y of boulevardTierGaps) {
    addTierGap(rects, y, [
      { x: BOULEVARD.x - BOULEVARD_SIDE_GAP, width: BOULEVARD_SIDE_GAP },
      {
        x: BOULEVARD.x + BOULEVARD.width,
        width: BOULEVARD_SIDE_GAP,
      },
    ]);
  }

  return rects;
}
