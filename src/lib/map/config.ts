/** Dimensiones del plano en píxeles (orientación vertical). */
export const MAP_CONTENT_WIDTH = 2652;

/** Espacio extra a la derecha de los bloques naranjas para el ícono de salas velatorias. */
export const MAP_RIGHT_ICON_ZONE = 360;

export const MAP_IMAGE_WIDTH = MAP_CONTENT_WIDTH + MAP_RIGHT_ICON_ZONE;

/** Altura del contenido principal (bloques, boulevard, etc.). */
export const MAP_CONTENT_HEIGHT = 2320;

/** Espacio extra bajo el boulevard para el ícono de portones. */
export const MAP_BOTTOM_ICON_ZONE = 380;

/** Separación entre la base del boulevard y el ícono de portones. */
export const PORTONES_ICON_GAP = 24;

export const MAP_IMAGE_HEIGHT = MAP_CONTENT_HEIGHT + MAP_BOTTOM_ICON_ZONE;

/** Límites del mapa en coordenadas simples [y, x]. */
export const MAP_BOUNDS: [[number, number], [number, number]] = [
  [0, 0],
  [MAP_IMAGE_HEIGHT, MAP_IMAGE_WIDTH],
];

export const MAP_DEFAULT_ZOOM = -1;
export const MAP_MAX_ZOOM = 2;

/** Piso de zoom para medir el encuadre (debe ser menor que el zoom real de ajuste). */
export const MAP_ABSOLUTE_MIN_ZOOM = -4;

/** Margen base en px al encuadrar el mapa completo (aleja un poco el zoom base). */
export const MAP_FIT_PADDING = 140;

/** +2.5 respecto al encuadre con padding (equivale a 5 pulsaciones de + con zoomDelta 0.5). */
export const MAP_FIT_ZOOM_OFFSET: number = 1.75;
