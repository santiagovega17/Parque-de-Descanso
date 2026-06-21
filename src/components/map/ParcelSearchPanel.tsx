"use client";

import { useCallback, useId, useMemo, useRef, useState } from "react";
import { filterParcelSearch } from "@/lib/map/parcel-search";
import { MapPanelCard, searchPanelSizers } from "./MapPanelCard";
import { useHelpRequest } from "./HelpRequestContext";
import { useMapSelection } from "./MapSelectionContext";
import { useParcelSearch } from "./ParcelSearchContext";

export function ParcelSearchPanel() {
  const listboxId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const { helpActive } = useHelpRequest();
  const { isOpen, closeSearch, requestParcelFocus } = useParcelSearch();
  const { selectParcel } = useMapSelection();
  const [query, setQuery] = useState("");

  const suggestions = useMemo(() => filterParcelSearch(query), [query]);
  const trimmedQuery = query.trim();
  const showNoResults = trimmedQuery.length > 0 && suggestions.length === 0;

  const handleSelect = useCallback(
    (parcelId: string) => {
      selectParcel(parcelId);
      requestParcelFocus(parcelId);
      setQuery("");
      closeSearch();
    },
    [selectParcel, requestParcelFocus, closeSearch],
  );

  const handleClose = useCallback(() => {
    setQuery("");
    closeSearch();
  }, [closeSearch]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && suggestions.length > 0) {
      event.preventDefault();
      handleSelect(suggestions[0].parcelId);
    }

    if (event.key === "Escape") {
      event.preventDefault();
      handleClose();
    }
  };

  if (helpActive || !isOpen) {
    return null;
  }

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-6 z-[1000] flex justify-center px-4">
      <MapPanelCard sizers={searchPanelSizers()} onClose={handleClose}>
        <div className="min-w-[min(100%,16rem)]">
          <input
            ref={inputRef}
            type="search"
            role="combobox"
            aria-expanded={suggestions.length > 0}
            aria-controls={listboxId}
            aria-autocomplete="list"
            autoComplete="off"
            enterKeyHint="search"
            placeholder="Buscar por nombre..."
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={handleKeyDown}
            className="map-search-input w-full rounded-xl border border-emerald-900/15 bg-white px-3 py-2 text-base text-emerald-950 outline-none placeholder:text-emerald-800/45"
          />

          {showNoResults ? (
            <p className="map-search-no-results mt-2 text-sm text-red-800/80">
              No se encontró ninguna parcela
            </p>
          ) : null}

          {suggestions.length > 0 ? (
            <ul
              id={listboxId}
              role="listbox"
              className="map-search-suggestions mt-2 max-h-40 overflow-y-auto rounded-xl border border-emerald-900/10"
            >
              {suggestions.map((entry) => (
                <li key={entry.parcelId} role="option">
                  <button
                    type="button"
                    className="map-search-suggestion w-full px-3 py-2 text-left text-base text-emerald-950 transition hover:bg-emerald-50 active:bg-emerald-100"
                    onClick={() => handleSelect(entry.parcelId)}
                  >
                    {entry.name}
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </MapPanelCard>
    </div>
  );
}
