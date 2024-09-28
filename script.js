import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

// Parent
const container = document.querySelector("#container");

// Options
const side = 144;
const steps = 255;
const segments = 6;
const cell = side / segments;

const from = {
  coords: [cell * 1, cell * 5, cell * 6, cell * 1],
};

const to = {
  coords: [cell * 0, cell * 3, cell * 5, cell * 6],
};

// Namespace
const ns = "http://www.w3.org/2000/svg";

// Reset
container.replaceChildren();

// Draw

// Create SVG
const svg = document.createElementNS(ns, "svg");
svg.setAttribute("viewBox", `0 0 ${side} ${side}`);
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

  path.setAttribute("stroke", "black");
  path.setAttribute("stroke-width", ".5");

  svg.append(path);
}
