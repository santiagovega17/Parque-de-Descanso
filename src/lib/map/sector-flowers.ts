import type { ParcelBlockVariant } from "./types";

export const SECTOR_FLOWER_ICONS: Partial<Record<ParcelBlockVariant, string>> = {
  pink: "/flores/rosa.svg",
  yellow: "/flores/girasol.svg",
  green: "/flores/jazmin.svg",
  blue: "/flores/lavanda.svg",
  violet: "/flores/lirio.svg",
  orange: "/flores/tuli.svg",
};

export function getSectorFlowerIcon(
  variant: ParcelBlockVariant,
): string | null {
  return SECTOR_FLOWER_ICONS[variant] ?? null;
}
