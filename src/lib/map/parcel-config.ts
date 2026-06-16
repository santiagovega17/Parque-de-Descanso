import type { ParcelBlockVariant } from "./types";

/** Cantidad de parcelas por fila y columna en cada bloque. */
export const PARCELS_PER_SIDE = 5;

/** Tamaño de cada parcela (cuadrada) en píxeles del plano. */
export const PARCEL_SIZE = 50;

/** Separación entre parcelas y borde del bloque. */
export const PARCEL_GAP = 8;

/** Tamaño del número dentro de cada parcela. */
export const PARCEL_LABEL_FONT_SIZE = 15;

export const BLOCK_PADDING = PARCEL_GAP;

const BLOCK_GRID_SIZE =
  PARCELS_PER_SIDE * PARCEL_SIZE + (PARCELS_PER_SIDE - 1) * PARCEL_GAP;

export const BLOCK_WIDTH = BLOCK_GRID_SIZE + 2 * BLOCK_PADDING;
export const BLOCK_HEIGHT = BLOCK_GRID_SIZE + 2 * BLOCK_PADDING;

/** Colores según diseño de referencia. */
export const BLOCK_COLORS: Record<
  ParcelBlockVariant,
  { background: string; parcel: string }
> = {
  blue: {
    background: "#4a8bc2",
    parcel: "#b8e0f0",
  },
  green: {
    background: "#4a8c5c",
    parcel: "#b8e8c0",
  },
  greenDark: {
    background: "#2a5c3a",
    parcel: "#2a5c3a",
  },
  yellow: {
    background: "#c4a832",
    parcel: "#f0e8a8",
  },
  orange: {
    background: "#c47a32",
    parcel: "#f0d0a8",
  },
  pink: {
    background: "#c45a8c",
    parcel: "#f0b8d8",
  },
  violet: {
    background: "#7a5ac4",
    parcel: "#c8b8f0",
  },
};

/** Nombre temático de cada sector según su color. */
export const SECTOR_NAMES_BY_VARIANT: Partial<
  Record<ParcelBlockVariant, string>
> = {
  pink: "Sector Rosas",
  yellow: "Sector Girasoles",
  green: "Sector Jazmines",
  blue: "Sector Lavandas",
  violet: "Sector Lirios",
  orange: "Sector Tulipanes",
};
