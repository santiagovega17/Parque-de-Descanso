"use client";

import { Bell, Home, Minus, Plus } from "lucide-react";
import { useMap } from "react-leaflet";
import { fitFullMap } from "@/lib/map/map-limits";
import { useHelpRequest } from "./HelpRequestContext";
import { useMapSelection } from "./MapSelectionContext";

function ControlButton({
  label,
  onClick,
  className,
  pressed,
  children,
}: {
  label: string;
  onClick?: () => void;
  className?: string;
  pressed?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={pressed}
      onClick={onClick}
      className={`map-control-btn flex h-16 w-16 items-center justify-center rounded-2xl shadow-lg ring-1 transition active:scale-95 ${
        className ??
        "bg-white/95 text-2xl font-semibold text-emerald-900 ring-emerald-900/10 active:bg-emerald-50"
      }`}
    >
      {children}
    </button>
  );
}

const controlIconClass = "h-8 w-8";

export function MapControls() {
  const map = useMap();
  const { helpActive, openHelpConfirm } = useHelpRequest();
  const { clearSelection } = useMapSelection();

  const handleHelpClick = () => {
    clearSelection();
    openHelpConfirm();
  };

  return (
    <div className="pointer-events-none absolute right-6 bottom-8 z-[1000] flex flex-col gap-3">
      <div className="pointer-events-auto flex flex-col gap-3">
        <ControlButton
          label="Pedir ayuda"
          pressed={helpActive}
          onClick={handleHelpClick}
          className={`bg-red-600 text-white ring-red-900/20 active:bg-red-700 ${
            helpActive ? "ring-2 ring-red-300" : ""
          }`}
        >
          <Bell aria-hidden="true" className={controlIconClass} />
        </ControlButton>
        <ControlButton label="Acercar" onClick={() => map.zoomIn()}>
          <Plus aria-hidden="true" className={controlIconClass} />
        </ControlButton>
        <ControlButton label="Alejar" onClick={() => map.zoomOut()}>
          <Minus aria-hidden="true" className={controlIconClass} />
        </ControlButton>
        <ControlButton
          label="Ver mapa completo"
          onClick={() => fitFullMap(map, true)}
        >
          <Home aria-hidden="true" className={controlIconClass} />
        </ControlButton>
      </div>
    </div>
  );
}
