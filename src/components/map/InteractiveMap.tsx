"use client";

import { useEffect } from "react";
import { MapContainer, useMap } from "react-leaflet";
import L from "leaflet";
import {
  MAP_BOUNDS,
  MAP_DEFAULT_ZOOM,
  MAP_MAX_ZOOM,
} from "@/lib/map/config";
import {
  applyMapViewLimits,
  fitFullMap,
} from "@/lib/map/map-limits";
import { MapControls } from "./MapControls";
import { ParcelBlocksLayer } from "./ParcelBlocksLayer";

function MapViewLimits() {
  const map = useMap();

  useEffect(() => {
    fitFullMap(map, false);

    const syncLimits = () => {
      applyMapViewLimits(map);
    };

    map.on("resize", syncLimits);
    window.addEventListener("resize", syncLimits);

    return () => {
      map.off("resize", syncLimits);
      window.removeEventListener("resize", syncLimits);
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
      minZoom={MAP_DEFAULT_ZOOM}
      maxZoom={MAP_MAX_ZOOM}
      maxBounds={MAP_BOUNDS}
      maxBoundsViscosity={1}
      zoomSnap={0.25}
      zoomDelta={0.5}
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
