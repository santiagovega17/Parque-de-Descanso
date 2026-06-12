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

/**
 * Calcula el zoom de encuadre sin el tope de minZoom del contenedor.
 * Leaflet clampea fitBounds al minZoom actual; si es -1, el padding no tiene efecto.
 */
function measureFitView(map: L.Map, animate = false): number {
  map.invalidateSize({ animate: false });
  map.setMinZoom(MAP_ABSOLUTE_MIN_ZOOM);
  map.fitBounds(boundsLatLng, getFitBoundsOptions(map, animate));
  applyFitZoomOffset(map, animate);
  return map.getZoom();
}

/** Zoom mínimo para que el mapa completo quepa en el contenedor actual. */
export function getMapFitZoom(map: L.Map): number {
  const center = map.getCenter();
  const zoom = map.getZoom();
  const fitZoom = measureFitView(map, false);
  map.setView(center, zoom, { animate: false });
  return fitZoom;
}

/** Aplica límites de pan y zoom: la vista de fitBounds es el tamaño máximo. */
export function applyMapViewLimits(map: L.Map): void {
  const fitZoom = getMapFitZoom(map);
  map.setMinZoom(fitZoom);
  map.setMaxBounds(boundsLatLng);

  if (map.getZoom() < fitZoom) {
    map.setZoom(fitZoom);
  }
}

/** Centra el mapa completo (equivalente al botón "Ver mapa completo"). */
export function fitFullMap(map: L.Map, animate = true): void {
  const fitZoom = measureFitView(map, animate);
  map.setMinZoom(fitZoom);
  map.setMaxBounds(boundsLatLng);
}
