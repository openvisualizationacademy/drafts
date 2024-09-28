import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

// Parent
const container = document.querySelector("#container");

// Options
const side = 168;
const margin = 24;
const steps = 255;
const segments = 6;
const thickness = 1;
const cell = side / segments;

// Default logo
const from = {
  coords: [cell * 1, cell * 5, cell * 6, cell * 1],
  color: "#f0305d",
};

const to = {
  coords: [cell * 0, cell * 3, cell * 5, cell * 6],
  color: "#ffc20a",
};

// Randomize Coordinates
const generator = d3.randomInt(segments + 1);
const randomCell = () => generator() * cell;

from.coords = [...Array(4)].map(() => randomCell());
to.coords = [...Array(4)].map(() => randomCell());

// Namespace
const ns = "http://www.w3.org/2000/svg";

// Reset
container.replaceChildren();

// Draw

// Create SVG
const svg = document.createElementNS(ns, "svg");

const totalSize = side + margin * 2;

svg.setAttribute("viewBox", `${-margin} ${-margin} ${totalSize} ${totalSize}`);
svg.style.width = `${totalSize}px`;
container.append(svg);

// Create interpolator
const interpolator = d3.interpolate(from, to);

// Draw each line

// For each step
for (let i = 0; i <= steps; i++) {
  // Get value between 0 and 1
  const t = (1 / steps) * i;

  const current = interpolator(t);

  // Create path
  const path = document.createElementNS(ns, "path");
  path.setAttribute("d", `M${current.coords}`);

  path.setAttribute("stroke", current.color);
  path.setAttribute("stroke-width", thickness);

  svg.append(path);
}
