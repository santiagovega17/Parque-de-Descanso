"use client";

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

function BellIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-8 w-8"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );
}

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
          <BellIcon />
        </ControlButton>
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
