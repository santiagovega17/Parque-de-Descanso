/** Dimensiones del plano en píxeles (orientación vertical). */
export const MAP_CONTENT_WIDTH = 2652;

/** Espacio extra a la derecha de los bloques naranjas para el ícono de salas velatorias. */
export const MAP_RIGHT_ICON_ZONE = 360;

export const MAP_IMAGE_WIDTH = MAP_CONTENT_WIDTH + MAP_RIGHT_ICON_ZONE;

/** Altura del contenido principal (bloques, boulevard, etc.). */
export const MAP_CONTENT_HEIGHT = 2404;

/** Espacio extra bajo el boulevard para el ícono de portones. */
export const MAP_BOTTOM_ICON_ZONE = 632;

/** Separación entre la base del boulevard y el ícono de portones. */
export const PORTONES_ICON_GAP = 24;

export const MAP_IMAGE_HEIGHT = MAP_CONTENT_HEIGHT + MAP_BOTTOM_ICON_ZONE;

/** Límites del mapa en coordenadas simples [y, x]. */
export const MAP_BOUNDS: [[number, number], [number, number]] = [
  [0, 0],
  [MAP_IMAGE_HEIGHT, MAP_IMAGE_WIDTH],
];

/** Encuadre home: contenido principal sin el margen inferior de iconos. */
export const MAP_HOME_BOUNDS: [[number, number], [number, number]] = [
  [0, 0],
  [MAP_CONTENT_HEIGHT, MAP_IMAGE_WIDTH],
];

export const MAP_DEFAULT_ZOOM = -1;
export const MAP_MAX_ZOOM = 2;

/** Piso de zoom para medir el encuadre (debe ser menor que el zoom real de ajuste). */
export const MAP_ABSOLUTE_MIN_ZOOM = -4;

/** Margen horizontal al encuadrar el mapa (px). */
export const MAP_FIT_PADDING_X = 140;

/** Margen vertical: menos arriba y más abajo eleva el contenido en pantalla. */
export const MAP_FIT_PADDING_TOP = 60;
export const MAP_FIT_PADDING_BOTTOM = 260;

/** Margen base en pantallas verticales (fallback para el cálculo responsivo). */
export const MAP_FIT_PADDING = MAP_FIT_PADDING_X;

/** Zoom extra sobre el encuadre base (3 clics en − desde la vista anterior). */
export const MAP_FIT_ZOOM_OFFSET: number = 0.25;

/** Incremento del botón +/− del mapa (debe coincidir con zoomDelta de Leaflet). */
export const MAP_ZOOM_DELTA = 0.5;

/** Ancho del contenedor considerado tablet (px). */
export const MAP_TABLET_MIN_WIDTH = 768;
export const MAP_TABLET_MAX_WIDTH = 1280;

/** En tablet, la vista home equivale a MAP_FIT_ZOOM_OFFSET + N clics en +. */
export const MAP_TABLET_HOME_ZOOM_IN_STEPS = 3;

/** Márgenes al centrar una parcela buscada (presentación en PC / pantalla ancha). */
export const PARCEL_FOCUS_PADDING_DESKTOP = {
  top: 72,
  right: 112,
  bottom: 112,
  left: 80,
} as const;
