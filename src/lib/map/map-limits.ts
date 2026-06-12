import L from "leaflet";
import { MAP_BOUNDS, MAP_FIT_PADDING } from "./config";

const boundsLatLng = L.latLngBounds(MAP_BOUNDS);

/** Más margen en pantallas verticales o estrechas para que quepa todo el mapa. */
function getFitPadding(map: L.Map): L.PointExpression {
  const { x: width, y: height } = map.getSize();
  let pad = MAP_FIT_PADDING;

  if (height > width) {
    pad = Math.round(pad * 1.6);
  }
  if (width < 900) {
    pad = Math.round(pad * 1.2);
  }

  return [pad, pad];
}

function getFitBoundsOptions(map: L.Map, animate = false): L.FitBoundsOptions {
  return {
    padding: getFitPadding(map),
    animate,
  };
}

/** Zoom mínimo para que el mapa completo quepa en el contenedor actual. */
export function getMapFitZoom(map: L.Map): number {
  const center = map.getCenter();
  const zoom = map.getZoom();
  map.fitBounds(boundsLatLng, getFitBoundsOptions(map));
  const fitZoom = map.getZoom();
  map.setView(center, zoom, { animate: false });
  return fitZoom;
}

/** Aplica límites de pan y zoom: la vista de fitBounds es el tamaño máximo. */
export function applyMapViewLimits(map: L.Map): void {
  map.setMaxBounds(boundsLatLng);
  const fitZoom = getMapFitZoom(map);
  map.setMinZoom(fitZoom);

  if (map.getZoom() < fitZoom) {
    map.setZoom(fitZoom);
  }
}

/** Centra el mapa completo (equivalente al botón "Ver mapa completo"). */
export function fitFullMap(map: L.Map, animate = true): void {
  applyMapViewLimits(map);
  map.fitBounds(MAP_BOUNDS, getFitBoundsOptions(map, animate));
}
