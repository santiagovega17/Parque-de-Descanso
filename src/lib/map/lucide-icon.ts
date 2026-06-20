import { createElement, type IconNode } from "lucide";

export type LucideSvgIconOptions = {
  width: number;
  height: number;
  color?: string;
  fill?: string;
  strokeWidth?: number;
  className?: string;
};

export function createLucideSvgIcon(
  icon: IconNode,
  {
    width,
    height,
    color = "currentColor",
    fill = "none",
    strokeWidth = 2,
    className,
  }: LucideSvgIconOptions,
): SVGElement {
  return createElement(icon, {
    width,
    height,
    stroke: color,
    fill,
    "stroke-width": strokeWidth,
    ...(className ? { class: className } : {}),
  });
}
