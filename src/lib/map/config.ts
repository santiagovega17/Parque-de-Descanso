/** Dimensiones del plano en píxeles (orientación vertical). */
export const MAP_IMAGE_WIDTH = 2652;
export const MAP_IMAGE_HEIGHT = 2100;

/** Límites del mapa en coordenadas simples [y, x]. */
export const MAP_BOUNDS: [[number, number], [number, number]] = [
  [0, 0],
  [MAP_IMAGE_HEIGHT, MAP_IMAGE_WIDTH],
];

export const MAP_DEFAULT_ZOOM = -1;
export const MAP_MAX_ZOOM = 2;

/** Margen en px al encuadrar el mapa completo (aleja un poco el zoom base). */
export const MAP_FIT_PADDING = 48;
