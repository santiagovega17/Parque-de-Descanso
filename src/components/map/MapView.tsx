"use client";

import dynamic from "next/dynamic";
import { MapSelectionProvider } from "./MapSelectionContext";
import { ParcelSelectionPanel } from "./ParcelSelectionPanel";

const InteractiveMap = dynamic(
  () =>
    import("./InteractiveMap").then((mod) => mod.InteractiveMap),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full w-full items-center justify-center bg-emerald-50 text-lg text-emerald-800">
        Cargando mapa...
      </div>
    ),
  },
);

export function MapView() {
  return (
    <MapSelectionProvider>
      <div className="relative h-full w-full overflow-hidden bg-emerald-50">
        <InteractiveMap />
        <ParcelSelectionPanel />
      </div>
    </MapSelectionProvider>
  );
}
