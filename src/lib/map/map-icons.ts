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
import { PASILLO_DIAMOND_HALF, type PasilloIntersection } from "./pasillo-config";
import { BLOCK_HEIGHT, BLOCK_WIDTH } from "./parcel-config";

export type MapIcon = {
  id: string;
  src: string;
  x: number;
  y: number;
  width: number;
  height: number;
};

const PORTONES_ICON_WIDTH = 400;
const PORTONES_ICON_HEIGHT = 304;
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

/** Destino tipo rombo: estacionamiento. */
export const AUTO_DESTINATION: PasilloIntersection = {
  id: "auto",
  centerX: AUTO_ICON_CENTER_X,
  centerY: AUTO_ICON_CENTER_Y,
  label: "Estacionamiento",
  iconSrc: "/icons/auto.svg",
  iconZoom: 0.85,
  iconOffsetY: -7,
  avoidThroughBlockId: "sector-28",
  boulevardSpineSide: "right",
};

/** Destino tipo rombo: salas velatorias. */
export const SALAS_VELATORIAS_DESTINATION: PasilloIntersection = {
  id: "salas-velatorias",
  centerX: ORANGE_BLOCKS_RIGHT_X + SALAS_ICON_GAP + PASILLO_DIAMOND_HALF,
  centerY: ORANGE_PASILLO_INTERSECTION.centerY,
  label: "Salas velatorias",
  iconSrc: "/icons/salas velatorias.svg",
  iconOffsetY: -5,
};

export const MAP_ICONS: MapIcon[] = [
  {
    id: "portones",
    src: "/icons/portones.svg",
    x: BOULEVARD_CENTER_X - PORTONES_ICON_WIDTH / 2,
    y: BOULEVARD_BOTTOM_Y + PORTONES_ICON_GAP,
    width: PORTONES_ICON_WIDTH,
    height: PORTONES_ICON_HEIGHT,
  },
];
