import { X } from "lucide-react";
import type { ReactNode } from "react";

type MapPanelCardProps = {
  children: ReactNode;
  onClose?: () => void;
  closeLabel?: string;
  sizers: ReactNode;
  className?: string;
  compact?: boolean;
};

export function MapPanelCard({
  children,
  onClose,
  closeLabel = "Cerrar",
  sizers,
  className = "",
  compact = false,
}: MapPanelCardProps) {
  return (
    <div
      className={`pointer-events-auto relative w-fit max-w-[calc(100%-2rem)] rounded-2xl border border-emerald-900/10 bg-white/95 px-4 pr-10 shadow-lg backdrop-blur-sm ${
        compact ? "py-2" : "py-3"
      } ${className}`}
    >
      {onClose ? (
        <button
          type="button"
          aria-label={closeLabel}
          onClick={onClose}
          className="map-control-btn absolute top-2 right-2 flex h-7 w-7 items-center justify-center rounded-lg text-emerald-900/70 transition hover:bg-emerald-50 hover:text-emerald-900"
        >
          <X aria-hidden="true" className="h-4 w-4" />
        </button>
      ) : null}

      <div className="grid">
        {sizers}
        <div className="col-start-1 row-start-1 flex min-w-0 self-stretch items-center">
          {children}
        </div>
      </div>
    </div>
  );
}

export function MapPanelIconSlot({ children }: { children?: ReactNode }) {
  return (
    <span className="flex h-11 w-11 shrink-0 items-center justify-center">
      {children}
    </span>
  );
}

export function MapPanelText({
  title,
  subtitle,
  centered = false,
}: {
  title: string;
  subtitle?: string;
  centered?: boolean;
}) {
  return (
    <div className={centered ? "text-center" : undefined}>
      <p className="text-base font-semibold whitespace-nowrap text-emerald-950">
        {title}
      </p>
      {subtitle ? (
        <p className="text-sm whitespace-nowrap text-emerald-800/75">
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}

const CENTERED_DESTINATION_PASILLO_IDS = new Set([
  "yellow",
  "orange",
  "auto",
  "salas-velatorias",
]);

export function isCenteredDestinationPasillo(pasilloId: string): boolean {
  return CENTERED_DESTINATION_PASILLO_IDS.has(pasilloId);
}

/** Ancho máximo del cartel (parcela con flor), sin aportar altura. */
function selectionPanelWidthSizer() {
  return (
    <div
      aria-hidden="true"
      className="invisible col-start-1 row-start-1 h-0 overflow-hidden"
    >
      <div className="flex items-center gap-3">
        <MapPanelIconSlot />
        <MapPanelText title="Sector Tulipanes" subtitle="Parcela 25" />
      </div>
    </div>
  );
}

/** Sizers para parcela: ancho y alto completos. */
export function selectionPanelParcelSizers() {
  return (
    <>
      {selectionPanelWidthSizer()}
      <div
        aria-hidden="true"
        className="invisible col-start-1 row-start-1 flex items-center gap-3"
      >
        <MapPanelIconSlot />
        <MapPanelText title="Sector Tulipanes" subtitle="Parcela 25" />
      </div>
    </>
  );
}

/** Sizers para destinos: mismo ancho, menos alto. */
export function selectionPanelDestinationSizers() {
  return (
    <>
      {selectionPanelWidthSizer()}
      <div
        aria-hidden="true"
        className="invisible col-start-1 row-start-1 flex w-full items-center justify-center"
      >
        <MapPanelText title="Salas velatorias" centered />
      </div>
    </>
  );
}

/** Contenido invisible que fija el ancho del cartel de búsqueda. */
export function searchPanelSizers() {
  return (
    <div
      aria-hidden="true"
      className="invisible col-start-1 row-start-1 min-w-[min(100%,16rem)]"
    >
      <input
        readOnly
        tabIndex={-1}
        className="w-full rounded-xl border px-3 py-2 text-base"
        defaultValue="Buscar por nombre..."
      />
      <ul className="mt-2 rounded-xl border">
        <li className="px-3 py-2 text-base">Juan Pérez</li>
        <li className="px-3 py-2 text-base">María García</li>
        <li className="px-3 py-2 text-base">Carlos López</li>
      </ul>
    </div>
  );
}

/** Contenido invisible que fija el ancho del cartel de ayuda. */
export function helpPanelSizers() {
  return (
    <div
      aria-hidden="true"
      className="invisible col-start-1 row-start-1 pr-8"
    >
      <p className="text-base font-semibold whitespace-nowrap text-emerald-950">
        ¿Llamar a un administrativo?
      </p>
      <button
        type="button"
        tabIndex={-1}
        className="mt-3 w-full rounded-xl px-3 py-2 text-sm font-medium"
      >
        Llamar
      </button>
    </div>
  );
}
