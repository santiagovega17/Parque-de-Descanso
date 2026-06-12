import L from "leaflet";
import { MAP_BOUNDS, MAP_FIT_PADDING } from "./config";

const boundsLatLng = L.latLngBounds(MAP_BOUNDS);
const fitPadding: L.PointExpression = [MAP_FIT_PADDING, MAP_FIT_PADDING];
const fitBoundsOptions: L.FitBoundsOptions = {
  padding: fitPadding,
  animate: false,
};

/** Zoom mínimo para que el mapa completo quepa en el contenedor actual. */
export function getMapFitZoom(map: L.Map): number {
  const center = map.getCenter();
  const zoom = map.getZoom();
  map.fitBounds(boundsLatLng, fitBoundsOptions);
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
  map.fitBounds(MAP_BOUNDS, { animate, padding: fitPadding });
}
