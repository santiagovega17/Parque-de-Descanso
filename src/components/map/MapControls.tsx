"use client";

import { Bell, Home, Minus, Plus, Search } from "lucide-react";
import { useMap } from "react-leaflet";
import { fitFullMap } from "@/lib/map/map-limits";
import { useHelpRequest } from "./HelpRequestContext";
import { useMapSelection } from "./MapSelectionContext";
import { useParcelSearch } from "./ParcelSearchContext";

function ControlButton({
  label,
  onClick,
  className = "",
  pressed,
  disabled,
  variant = "default",
  children,
}: {
  label: string;
  onClick?: () => void;
  className?: string;
  pressed?: boolean;
  disabled?: boolean;
  variant?: "default" | "help";
  children: React.ReactNode;
}) {
  const variantClassName =
    variant === "help"
      ? "bg-red-600 text-white ring-red-900/20 active:bg-red-700"
      : "bg-white/95 text-emerald-900 ring-emerald-900/10 active:bg-emerald-50";

  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={pressed}
      disabled={disabled}
      onClick={onClick}
      className={`map-control-btn flex h-16 w-16 items-center justify-center rounded-2xl text-2xl font-semibold shadow-lg ring-1 transition active:scale-95 ${variantClassName} ${className}`}
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
  const { isOpen: searchOpen, toggleSearch, closeSearch } = useParcelSearch();

  const handleHelpClick = () => {
    closeSearch();
    clearSelection();
    openHelpConfirm();
  };

  return (
    <div className="pointer-events-none absolute right-6 bottom-8 z-[1000] flex flex-col gap-3">
      <div className="pointer-events-auto flex flex-col gap-3">
        <ControlButton
          label="Buscar parcela"
          pressed={searchOpen}
          disabled={helpActive}
          onClick={toggleSearch}
          className={`${
            searchOpen ? "ring-2 ring-emerald-300" : ""
          } ${helpActive ? "cursor-not-allowed opacity-50" : ""}`}
        >
          <Search aria-hidden="true" className={controlIconClass} />
        </ControlButton>
        <ControlButton
          label="Pedir ayuda"
          variant="help"
          pressed={helpActive}
          onClick={handleHelpClick}
          className={helpActive ? "ring-2 ring-red-300" : ""}
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
