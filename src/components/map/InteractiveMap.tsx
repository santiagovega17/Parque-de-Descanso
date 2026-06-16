"use client";

import { useEffect } from "react";
import { MapContainer, useMap } from "react-leaflet";
import L from "leaflet";
import {
  MAP_BOUNDS,
  MAP_DEFAULT_ZOOM,
  MAP_MAX_ZOOM,
  MAP_ZOOM_DELTA,
} from "@/lib/map/config";
import { fitFullMap } from "@/lib/map/map-limits";
import { MapControls } from "./MapControls";
import { ParcelBlocksLayer } from "./ParcelBlocksLayer";

function MapViewLimits() {
  const map = useMap();

  useEffect(() => {
    const syncView = () => {
      fitFullMap(map, false);
    };

    // Esperar al layout real del contenedor (común en tablet / carga dinámica).
    requestAnimationFrame(() => {
      requestAnimationFrame(syncView);
    });

    map.on("resize", syncView);
    window.addEventListener("resize", syncView);
    window.visualViewport?.addEventListener("resize", syncView);

    return () => {
      map.off("resize", syncView);
      window.removeEventListener("resize", syncView);
      window.visualViewport?.removeEventListener("resize", syncView);
    };
  }, [map]);

  return null;
}

export function InteractiveMap() {
  return (
    <MapContainer
      className="h-full w-full touch-map"
      crs={L.CRS.Simple}
      center={[MAP_BOUNDS[1][0] / 2, MAP_BOUNDS[1][1] / 2]}
      zoom={MAP_DEFAULT_ZOOM}
      maxZoom={MAP_MAX_ZOOM}
      maxBounds={MAP_BOUNDS}
      maxBoundsViscosity={1}
      zoomSnap={0.25}
      zoomDelta={MAP_ZOOM_DELTA}
      attributionControl={false}
      zoomControl={false}
      doubleClickZoom={false}
      scrollWheelZoom
      touchZoom
      dragging
      inertia
      inertiaDeceleration={2000}
      bounceAtZoomLimits={false}
    >
      <ParcelBlocksLayer />
      <MapViewLimits />
      <MapControls />
    </MapContainer>
  );
}
