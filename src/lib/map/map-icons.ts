import { PORTONES_ICON_GAP } from "./config";
import {
  BOULEVARD,
  gridOrigin,
  LEFT_ORIGIN_X,
  RIGHT_GRID_WIDTH,
  RIGHT_ORIGIN_X,
  VIOLET_ABOVE_PINK_COL,
  VIOLET_TIER_Y,
  VIOLET_TOP_TIER_Y,
} from "./layout";
import { ORANGE_PASILLO_INTERSECTION } from "./orange-pasillo";
import {
  PASILLO_DIAMOND_HALF,
  PASILLO_DIAMOND_ICON_ZOOM,
} from "./pasillo-config";
import { BLOCK_HEIGHT, BLOCK_WIDTH } from "./parcel-config";

export type MapIcon = {
  id: string;
  src: string;
  x: number;
  y: number;
  width: number;
  height: number;
};

const PASILLO_ICON_SIZE = PASILLO_DIAMOND_HALF * 2 * PASILLO_DIAMOND_ICON_ZOOM;
const AUTO_ICON_ASPECT = 224.55 / 295.95;
const SALAS_ICON_ASPECT = 224.55 / 295.95;

const AUTO_ICON_WIDTH = PASILLO_ICON_SIZE;
const AUTO_ICON_HEIGHT = AUTO_ICON_WIDTH * AUTO_ICON_ASPECT;

const PORTONES_ICON_WIDTH = 400;
const PORTONES_ICON_HEIGHT = 304;

const SALAS_ICON_WIDTH = PASILLO_ICON_SIZE;
const SALAS_ICON_HEIGHT = SALAS_ICON_WIDTH * SALAS_ICON_ASPECT;
const SALAS_ICON_GAP = 32;

const BOULEVARD_CENTER_X = BOULEVARD.x + BOULEVARD.width / 2;
const BOULEVARD_BOTTOM_Y = BOULEVARD.y + BOULEVARD.height;
const ORANGE_BLOCKS_RIGHT_X = RIGHT_ORIGIN_X + RIGHT_GRID_WIDTH;

const [, bottomVioletLeftX] = gridOrigin(VIOLET_TIER_Y, LEFT_ORIGIN_X, 0, 0);
const [, bottomVioletMidX] = gridOrigin(VIOLET_TIER_Y, LEFT_ORIGIN_X, 0, 1);
const [topVioletRightY] = gridOrigin(
  VIOLET_TOP_TIER_Y,
  LEFT_ORIGIN_X,
  0,
  VIOLET_ABOVE_PINK_COL,
);

const AUTO_ICON_CENTER_X =
  (bottomVioletLeftX + BLOCK_WIDTH + bottomVioletMidX) / 2;
const AUTO_ICON_CENTER_Y = topVioletRightY + BLOCK_HEIGHT / 2;

export const MAP_ICONS: MapIcon[] = [
  {
    id: "auto",
    src: "/icons/auto.svg",
    x: AUTO_ICON_CENTER_X - AUTO_ICON_WIDTH / 2,
    y: AUTO_ICON_CENTER_Y - AUTO_ICON_HEIGHT / 2,
    width: AUTO_ICON_WIDTH,
    height: AUTO_ICON_HEIGHT,
  },
  {
    id: "portones",
    src: "/icons/portones.svg",
    x: BOULEVARD_CENTER_X - PORTONES_ICON_WIDTH / 2,
    y: BOULEVARD_BOTTOM_Y + PORTONES_ICON_GAP,
    width: PORTONES_ICON_WIDTH,
    height: PORTONES_ICON_HEIGHT,
  },
  {
    id: "salas-velatorias",
    src: "/icons/salas velatorias.svg",
    x: ORANGE_BLOCKS_RIGHT_X + SALAS_ICON_GAP,
    y: ORANGE_PASILLO_INTERSECTION.centerY - SALAS_ICON_HEIGHT / 2,
    width: SALAS_ICON_WIDTH,
    height: SALAS_ICON_HEIGHT,
  },
];
