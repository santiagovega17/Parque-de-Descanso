"use client";

import { useMap } from "react-leaflet";
import { fitFullMap } from "@/lib/map/map-limits";

function ControlButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="map-control-btn flex h-16 w-16 items-center justify-center rounded-2xl bg-white/95 text-2xl font-semibold text-emerald-900 shadow-lg ring-1 ring-emerald-900/10 transition active:scale-95 active:bg-emerald-50"
    >
      {children}
    </button>
  );
}

export function MapControls() {
  const map = useMap();

  return (
    <div className="pointer-events-none absolute right-6 bottom-8 z-[1000] flex flex-col gap-3">
      <div className="pointer-events-auto flex flex-col gap-3">
        <ControlButton label="Acercar" onClick={() => map.zoomIn()}>
          +
        </ControlButton>
        <ControlButton label="Alejar" onClick={() => map.zoomOut()}>
          −
        </ControlButton>
        <ControlButton
          label="Ver mapa completo"
          onClick={() => fitFullMap(map, true)}
        >
          ⌂
        </ControlButton>
      </div>
    </div>
  );
}
