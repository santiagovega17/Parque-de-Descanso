export type MapCoordinates = [number, number];

export type MapBounds = [MapCoordinates, MapCoordinates];

export type ParcelBlockVariant =
  | "blue"
  | "green"
  | "greenDark"
  | "yellow"
  | "orange"
  | "pink"
  | "violet";

export type PasilloInnerCorner =
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right";

export type ParcelBlock = {
  id: string;
  label: string;
  variant: ParcelBlockVariant;
  /** Esquina superior izquierda del bloque en coordenadas [y, x]. */
  origin: MapCoordinates;
  pasilloInnerCorner?: PasilloInnerCorner;
  /** Bloque sin grilla de parcelas (solo color sólido). */
  solid?: boolean;
  /** Recorte superior tipo rotonda (bloques verdes superiores). */
  solidRoundabout?: "left" | "right";
  /** Forma sólida personalizada (bloques verdes). */
  solidShape?: "trapezoid-left-step" | "bottom-pasillo-step" | "diagonal-step-triangle";
};

export type Parcel = {
  id: string;
  blockId: string;
  /** Número de parcela dentro del bloque (1–25). */
  number: number;
  bounds: MapBounds;
};
