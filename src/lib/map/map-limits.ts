import L from "leaflet";
import {
  MAP_ABSOLUTE_MIN_ZOOM,
  MAP_BOUNDS,
  MAP_FIT_PADDING,
  MAP_FIT_ZOOM_OFFSET,
} from "./config";

const boundsLatLng = L.latLngBounds(MAP_BOUNDS);

/** Más margen en pantallas verticales o estrechas para que quepa todo el mapa. */
function getFitPadding(map: L.Map): L.PointExpression {
  const { x: width, y: height } = map.getSize();
  let pad = MAP_FIT_PADDING;

  if (height > width) {
    pad = Math.max(pad, Math.round(width * 0.34), Math.round(height * 0.14));
  }

  return [pad, pad];
}

function applyFitZoomOffset(map: L.Map, animate = false): void {
  if (MAP_FIT_ZOOM_OFFSET === 0) return;
  map.setZoom(map.getZoom() + MAP_FIT_ZOOM_OFFSET, { animate });
}

function getFitBoundsOptions(map: L.Map, animate = false): L.FitBoundsOptions {
  return {
    padding: getFitPadding(map),
    animate,
  };
}

/** Zoom con el mapa completo encuadrado (sin el offset de vista preferida). */
function measurePaddedFitZoom(map: L.Map, animate = false): number {
  map.invalidateSize({ animate: false });
  map.setMinZoom(MAP_ABSOLUTE_MIN_ZOOM);
  map.fitBounds(boundsLatLng, getFitBoundsOptions(map, animate));
  return map.getZoom();
}

/**
 * Zoom de vista inicial (encuadre + offset).
 * Mide sin el tope de minZoom del contenedor; si es -1, el padding no tiene efecto.
 */
function measureFitView(map: L.Map, animate = false): number {
  measurePaddedFitZoom(map, animate);
  applyFitZoomOffset(map, animate);
  return map.getZoom();
}

/** Zoom mínimo permitido (más alejado que la vista inicial). */
export function getMapMinZoom(map: L.Map): number {
  const center = map.getCenter();
  const zoom = map.getZoom();
  const minZoom = measurePaddedFitZoom(map, false);
  map.setView(center, zoom, { animate: false });
  return minZoom;
}

/** Zoom de la vista inicial preferida. */
export function getMapFitZoom(map: L.Map): number {
  const center = map.getCenter();
  const zoom = map.getZoom();
  const fitZoom = measureFitView(map, false);
  map.setView(center, zoom, { animate: false });
  return fitZoom;
}

/** Aplica límites de pan; el zoom mínimo permite alejar más allá de la vista inicial. */
export function applyMapViewLimits(map: L.Map): void {
  map.setMinZoom(getMapMinZoom(map));
  map.setMaxBounds(boundsLatLng);
}

/** Centra el mapa en la vista inicial preferida (botón "Ver mapa completo"). */
export function fitFullMap(map: L.Map, animate = true): void {
  map.invalidateSize({ animate: false });
  map.setMinZoom(MAP_ABSOLUTE_MIN_ZOOM);
  map.fitBounds(boundsLatLng, getFitBoundsOptions(map, animate));
  const minZoom = map.getZoom();
  applyFitZoomOffset(map, animate);
  map.setMinZoom(minZoom);
  map.setMaxBounds(boundsLatLng);
}
