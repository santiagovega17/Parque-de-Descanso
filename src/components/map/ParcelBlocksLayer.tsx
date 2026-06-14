"use client";

import { useEffect, useRef } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import { MAP_BOUNDS } from "@/lib/map/config";
import { buildMapSvg } from "@/lib/map/block-svg";
import { findRouteToParcel, findRouteToPasillo } from "@/lib/map/navigation/find-route";
import { syncRouteOverlay } from "@/lib/map/navigation/route-svg";
import { PARCEL_BLOCKS } from "@/lib/map/parcels";
import { useMapSelection } from "./MapSelectionContext";

function syncParcelSelection(svg: SVGSVGElement, selectedParcelId: string | null) {
  svg.querySelectorAll<SVGGElement>(".map-parcel").forEach((parcel) => {
    const isSelected = parcel.dataset.parcelId === selectedParcelId;
    parcel.classList.toggle("map-parcel--selected", isSelected);
    parcel.setAttribute("aria-pressed", String(isSelected));
  });
}

function syncPasilloSelection(svg: SVGSVGElement, selectedPasilloId: string | null) {
  svg.querySelectorAll<SVGGElement>(".map-pasillo[data-pasillo-selectable]").forEach(
    (pasillo) => {
      const isSelected = pasillo.dataset.pasilloId === selectedPasilloId;
      pasillo.classList.toggle("map-pasillo--selected", isSelected);
      pasillo.setAttribute("aria-pressed", String(isSelected));
    },
  );
}

function bindParcelInteractions(
  svg: SVGSVGElement,
  selectParcel: (parcelId: string) => void,
) {
  const cleanups: Array<() => void> = [];

  svg.querySelectorAll<SVGGElement>(".map-parcel").forEach((parcel) => {
    const stopMapDrag = L.DomEvent.stopPropagation;

    const handleActivate = (event: Event) => {
      if (!parcel.dataset.parcelId) {
        return;
      }

      stopMapDrag(event);
      selectParcel(parcel.dataset.parcelId);
    };

    const parcelElement = parcel as unknown as HTMLElement;

    L.DomEvent.on(parcelElement, "mousedown", stopMapDrag);
    L.DomEvent.on(parcelElement, "touchstart", stopMapDrag);
    L.DomEvent.on(parcelElement, "click", handleActivate);

    cleanups.push(() => {
      L.DomEvent.off(parcelElement, "mousedown", stopMapDrag);
      L.DomEvent.off(parcelElement, "touchstart", stopMapDrag);
      L.DomEvent.off(parcelElement, "click", handleActivate);
    });
  });

  return () => {
    cleanups.forEach((cleanup) => cleanup());
  };
}

function bindPasilloInteractions(
  svg: SVGSVGElement,
  selectPasillo: (pasilloId: string) => void,
) {
  const cleanups: Array<() => void> = [];

  svg.querySelectorAll<SVGGElement>(".map-pasillo[data-pasillo-selectable]").forEach(
    (pasillo) => {
      const stopMapDrag = L.DomEvent.stopPropagation;

      const handleActivate = (event: Event) => {
        if (!pasillo.dataset.pasilloId) {
          return;
        }

        stopMapDrag(event);
        selectPasillo(pasillo.dataset.pasilloId);
      };

      const pasilloElement = pasillo as unknown as HTMLElement;

      L.DomEvent.on(pasilloElement, "mousedown", stopMapDrag);
      L.DomEvent.on(pasilloElement, "touchstart", stopMapDrag);
      L.DomEvent.on(pasilloElement, "click", handleActivate);

      cleanups.push(() => {
        L.DomEvent.off(pasilloElement, "mousedown", stopMapDrag);
        L.DomEvent.off(pasilloElement, "touchstart", stopMapDrag);
        L.DomEvent.off(pasilloElement, "click", handleActivate);
      });
    },
  );

  return () => {
    cleanups.forEach((cleanup) => cleanup());
  };
}

export function ParcelBlocksLayer() {
  const map = useMap();
  const { selectedParcel, selectedPasillo, selectParcel, selectPasillo } =
    useMapSelection();
  const overlayRef = useRef<L.SVGOverlay | null>(null);

  useEffect(() => {
    const svg = buildMapSvg(PARCEL_BLOCKS);
    const overlay = L.svgOverlay(svg, MAP_BOUNDS);
    overlay.addTo(map);
    overlayRef.current = overlay;

    const unbindParcelInteractions = bindParcelInteractions(svg, selectParcel);
    const unbindPasilloInteractions = bindPasilloInteractions(svg, selectPasillo);

    return () => {
      unbindParcelInteractions();
      unbindPasilloInteractions();
      map.removeLayer(overlay);
      overlayRef.current = null;
    };
  }, [map, selectParcel, selectPasillo]);

  useEffect(() => {
    const svg = overlayRef.current?.getElement();

    if (!(svg instanceof SVGSVGElement)) {
      return;
    }

    syncParcelSelection(svg, selectedParcel?.id ?? null);
    syncPasilloSelection(svg, selectedPasillo?.id ?? null);

    const route = selectedParcel
      ? findRouteToParcel(selectedParcel)
      : selectedPasillo
        ? findRouteToPasillo(selectedPasillo)
        : null;
    syncRouteOverlay(svg, route);
  }, [selectedParcel, selectedPasillo]);

  return null;
}
