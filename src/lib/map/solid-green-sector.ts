import {
  BLOCK_GAP,
  SOLID_BLOCK_STRIDE,
  SOLID_LEFT_ORIGIN_X,
  VIOLET_TIER_Y,
} from "./layout";
import { BLOCK_COLORS, BLOCK_HEIGHT, BLOCK_WIDTH } from "./parcel-config";
import {
  ROUNDABOUT_CENTER_Y,
  ROUNDABOUT_RADIUS,
} from "./solid-green-roundabout";
import type { ParcelBlock } from "./types";

function solidOrigin(row: number, col: number): [number, number] {
  return [
    VIOLET_TIER_Y + row * (BLOCK_HEIGHT + BLOCK_GAP),
    SOLID_LEFT_ORIGIN_X + col * SOLID_BLOCK_STRIDE,
  ];
}

/** Isla verde central de la rotonda (coordenadas globales). */
export const SOLID_GREEN_PIN = {
  cx: SOLID_LEFT_ORIGIN_X + BLOCK_WIDTH + BLOCK_GAP / 2,
  cy: VIOLET_TIER_Y + ROUNDABOUT_CENTER_Y,
  r: ROUNDABOUT_RADIUS,
  fill: BLOCK_COLORS.greenDark.background,
};

/**
 * Sector verde oscuro izquierdo según plano de referencia:
 * fila 0: dos cuadrados + pin
 * filas 1–2: escalones con recorte inferior izquierdo y pasillo inferior derecho
 */
export const SOLID_GREEN_BLOCKS: ParcelBlock[] = [
  {
    id: "bloque-verde-liso-izquierda",
    label: "Sector verde",
    variant: "greenDark",
    origin: solidOrigin(0, 0),
    solid: true,
    solidRoundabout: "left",
  },
  {
    id: "bloque-verde-liso",
    label: "Sector verde",
    variant: "greenDark",
    origin: solidOrigin(0, 1),
    solid: true,
    solidRoundabout: "right",
  },
  {
    id: "bloque-verde-liso-escalon-1",
    label: "Sector verde",
    variant: "greenDark",
    origin: solidOrigin(1, 0),
    solid: true,
    solidShape: "trapezoid-left-step",
  },
  {
    id: "bloque-verde-liso-abajo",
    label: "Sector verde",
    variant: "greenDark",
    origin: solidOrigin(1, 1),
    solid: true,
    pasilloInnerCorner: "bottom-right",
  },
  {
    id: "bloque-verde-liso-escalon-2",
    label: "Sector verde",
    variant: "greenDark",
    origin: solidOrigin(2, 0),
    solid: true,
    pasilloInnerCorner: "bottom-left",
  },
  {
    id: "bloque-verde-liso-pasillo",
    label: "Sector verde",
    variant: "greenDark",
    origin: solidOrigin(2, 1),
    solid: true,
    pasilloInnerCorner: "top-right",
  },
];
