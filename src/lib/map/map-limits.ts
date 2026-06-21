import L from "leaflet";
import {
  MAP_ABSOLUTE_MIN_ZOOM,
  MAP_BOUNDS,
  MAP_FIT_PADDING_BOTTOM,
  MAP_FIT_PADDING_TOP,
  MAP_FIT_PADDING_X,
  MAP_FIT_ZOOM_OFFSET,
  MAP_HOME_BOUNDS,
  MAP_MAX_ZOOM,
  MAP_TABLET_HOME_ZOOM_IN_STEPS,
  MAP_TABLET_MAX_WIDTH,
  MAP_TABLET_MIN_WIDTH,
  MAP_ZOOM_DELTA,
  PARCEL_FOCUS_PADDING_DESKTOP,
} from "./config";
import type { Parcel } from "./types";
import { getParcelCenter } from "./parcel-utils";

const boundsLatLng = L.latLngBounds(MAP_BOUNDS);
const homeBoundsLatLng = L.latLngBounds(MAP_HOME_BOUNDS);

let suppressFitUntil = 0;

/** Evita que fitFullMap pise un flyTo reciente (p. ej. al cerrar el teclado). */
export function suppressFitFullMap(ms: number): void {
  suppressFitUntil = Math.max(suppressFitUntil, Date.now() + ms);
}

function shouldSuppressFitFullMap(): boolean {
  return Date.now() < suppressFitUntil;
}

type HomeView = {
  center: L.LatLng;
  zoom: number;
  minZoom: number;
};

/** Padding asimétrico: más margen abajo empuja el mapa hacia arriba. */
function getHomeFitOptions(map: L.Map): L.FitBoundsOptions {
  const { x: width, y: height } = map.getSize();
  let padX = MAP_FIT_PADDING_X;
  let padTop = MAP_FIT_PADDING_TOP;
  let padBottom = MAP_FIT_PADDING_BOTTOM;

  if (height > width) {
    padX = Math.max(padX, Math.round(width * 0.34));
    padTop = Math.max(padTop, Math.round(height * 0.08));
    padBottom = Math.max(padBottom, Math.round(height * 0.22));
  }

  return {
    paddingTopLeft: L.point(padX, padTop),
    paddingBottomRight: L.point(padX, padBottom),
    animate: false,
  };
}

function isTabletViewport(width: number): boolean {
  return width >= MAP_TABLET_MIN_WIDTH && width < MAP_TABLET_MAX_WIDTH;
}

/** Offset de zoom home según el dispositivo. */
function getHomeZoomOffset(width: number): number {
  if (isTabletViewport(width)) {
    return (
      MAP_FIT_ZOOM_OFFSET + MAP_TABLET_HOME_ZOOM_IN_STEPS * MAP_ZOOM_DELTA
    );
  }

  return MAP_FIT_ZOOM_OFFSET;
}

/** Calcula la vista home de forma síncrona (sin animaciones intermedias). */
function computeHomeView(map: L.Map): HomeView {
  const center = map.getCenter();
  const zoom = map.getZoom();
  const { x: width } = map.getSize();

  map.invalidateSize({ animate: false });
  map.setMinZoom(MAP_ABSOLUTE_MIN_ZOOM);
  map.fitBounds(homeBoundsLatLng, getHomeFitOptions(map));

  const minZoom = map.getZoom();
  const homeCenter = map.getCenter();
  const homeZoom = minZoom + getHomeZoomOffset(width);

  map.setView(center, zoom, { animate: false });

  return { center: homeCenter, zoom: homeZoom, minZoom };
}

/** Zoom con el mapa completo encuadrado (sin el offset de vista preferida). */
function measurePaddedFitZoom(map: L.Map): number {
  const center = map.getCenter();
  const zoom = map.getZoom();

  map.invalidateSize({ animate: false });
  map.setMinZoom(MAP_ABSOLUTE_MIN_ZOOM);
  map.fitBounds(homeBoundsLatLng, getHomeFitOptions(map));
  const minZoom = map.getZoom();

  map.setView(center, zoom, { animate: false });
  return minZoom;
}

/** Zoom mínimo permitido (más alejado que la vista inicial). */
export function getMapMinZoom(map: L.Map): number {
  return measurePaddedFitZoom(map);
}

/** Zoom de la vista inicial preferida. */
export function getMapFitZoom(map: L.Map): number {
  return computeHomeView(map).zoom;
}

/** Padding en píxeles del área visible al centrar una parcela buscada. */
function getParcelFocusPadding(map: L.Map): {
  top: number;
  right: number;
  bottom: number;
  left: number;
} {
  const { x: width, y: height } = map.getSize();

  if (width >= height) {
    return { ...PARCEL_FOCUS_PADDING_DESKTOP };
  }

  return {
    top: Math.max(180, Math.round(height * 0.24)),
    right: Math.max(120, Math.round(width * 0.34)),
    bottom: Math.round(height * 0.04),
    left: Math.round(width * 0.08),
  };
}

/** Punto de pantalla donde debe quedar la parcela buscada. */
function getParcelFocusScreenPoint(map: L.Map): L.Point {
  const { x: width, y: height } = map.getSize();
  const padding = getParcelFocusPadding(map);

  return L.point(
    padding.left + (width - padding.left - padding.right) / 2,
    padding.top + (height - padding.top - padding.bottom) / 2,
  );
}

/** Centra una parcela en el área visible, compensando cartel superior y controles. */
export function focusMapOnParcel(
  map: L.Map,
  parcel: Parcel,
  animate = true,
): void {
  suppressFitFullMap(900);

  map.invalidateSize({ animate: false });

  let zoom = Math.min(
    getMapFitZoom(map) + MAP_ZOOM_DELTA * 2,
    MAP_MAX_ZOOM,
  );
  const minZoom = getMapMinZoom(map);
  let zoomStepsOut = 0;
  const maxZoomStepsOut = 2;

  const [y, x] = getParcelCenter(parcel);
  const parcelLatLng = L.latLng(y, x);
  const targetScreenPoint = getParcelFocusScreenPoint(map);

  const alignParcelOnScreen = () => {
    const currentPoint = map.latLngToContainerPoint(parcelLatLng);
    const panOffset = currentPoint.subtract(targetScreenPoint);
    const error = Math.hypot(panOffset.x, panOffset.y);

    if (
      error > 32 &&
      zoom > minZoom &&
      zoomStepsOut < maxZoomStepsOut
    ) {
      zoomStepsOut += 1;
      zoom -= MAP_ZOOM_DELTA;
      map.once("moveend", alignParcelOnScreen);
      map.setView(parcelLatLng, zoom, { animate: false });
      return;
    }

    if (error > 2) {
      map.panBy(panOffset, { animate, duration: animate ? 0.35 : 0 });
    }
  };

  map.once("moveend", alignParcelOnScreen);
  map.flyTo(parcelLatLng, zoom, { duration: animate ? 0.6 : 0 });
}

/** Aplica límites de pan; el zoom mínimo permite alejar más allá de la vista inicial. */
export function applyMapViewLimits(map: L.Map): void {
  map.setMinZoom(getMapMinZoom(map));
  map.setMaxBounds(boundsLatLng);
}

/** Restaura la vista home fija (carga inicial y botón ⌂). */
export function fitFullMap(map: L.Map, animate = true): void {
  if (shouldSuppressFitFullMap()) {
    return;
  }

  const { center, zoom, minZoom } = computeHomeView(map);
  map.setView(center, zoom, { animate });
  map.setMinZoom(minZoom);
  map.setMaxBounds(boundsLatLng);
}
