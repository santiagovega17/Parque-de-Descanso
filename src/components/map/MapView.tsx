"use client";

import dynamic from "next/dynamic";
import { HelpRequestPanel } from "./HelpRequestPanel";
import { HelpRequestProvider } from "./HelpRequestContext";
import { MapSelectionProvider } from "./MapSelectionContext";
import { ParcelSelectionPanel } from "./ParcelSelectionPanel";

const InteractiveMap = dynamic(
  () =>
    import("./InteractiveMap").then((mod) => mod.InteractiveMap),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full w-full items-center justify-center bg-background text-lg text-foreground">
        Cargando mapa...
      </div>
    ),
  },
);

export function MapView() {
  return (
    <HelpRequestProvider>
      <MapSelectionProvider>
        <div className="relative h-full w-full overflow-hidden bg-background">
          <InteractiveMap />
          <ParcelSelectionPanel />
          <HelpRequestPanel />
        </div>
      </MapSelectionProvider>
    </HelpRequestProvider>
  );
}
