import { BOULEVARD } from "./layout";

const TREE_SRC = "/icons/arbol.svg";
const TREE_ASPECT = 342.33 / 354.62;
const TREE_WIDTH = 40;
const TREE_HEIGHT = TREE_WIDTH * TREE_ASPECT;
const TREE_COUNT = 32;
const TREE_EDGE_MARGIN = 90;

export function appendBoulevardTrees(svg: SVGSVGElement) {
  const centerX = BOULEVARD.x + BOULEVARD.width / 2;
  const span = BOULEVARD.height - 2 * TREE_EDGE_MARGIN;
  const step = TREE_COUNT > 1 ? span / (TREE_COUNT - 1) : 0;

  for (let i = 0; i < TREE_COUNT; i += 1) {
    const centerY = BOULEVARD.y + TREE_EDGE_MARGIN + i * step;
    const image = document.createElementNS("http://www.w3.org/2000/svg", "image");

    image.setAttribute("href", TREE_SRC);
    image.setAttribute("x", String(centerX - TREE_WIDTH / 2));
    image.setAttribute("y", String(centerY - TREE_HEIGHT / 2));
    image.setAttribute("width", String(TREE_WIDTH));
    image.setAttribute("height", String(TREE_HEIGHT));
    image.setAttribute("preserveAspectRatio", "xMidYMid meet");
    image.setAttribute("pointer-events", "none");
    svg.appendChild(image);
  }
}
