import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

// Namespace
const ns = "http://www.w3.org/2000/svg";

// Parent
const container = document.querySelector("#container");

// Options
const side = 168;
const margin = 24;
const steps = 255;
const segments = 6;
const half = segments / 2;
const cell = side / segments;
const thickness = 1;

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
function randomizeCoords() {
  // Corners (Smallest Second Half) Random
  const regions = [
    d3.randomInt(0, half + 1),
    d3.randomInt(half + 2, segments + 1),
  ];

  // Horizontal Template
  from.coords = [0, 1, 1, 0];
  to.coords = [0, 0, 1, 1];

  // Fill with values
  from.coords = from.coords.map((i) => regions[i]() * cell);
  to.coords = to.coords.map((i) => regions[i]() * cell);
}

// Randomize lines AB and A'B'
randomizeCoords();

// Create interpolator
const interpolator = d3.interpolate(from, to);

function findIntersection(from, to) {
  // Coordinates of the two lines
  const x1 = from[0],
    y1 = from[1],
    x2 = from[2],
    y2 = from[3];
  const x3 = to[0],
    y3 = to[1],
    x4 = to[2],
    y4 = to[3];

  // Calculate the denominator
  const denominator = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);

  // If denominator is 0, the lines are parallel or coincident
  if (denominator === 0) {
    return null; // No intersection
  }

  // Calculate the intersection point
  const x =
    ((x1 * y2 - y1 * x2) * (x3 - x4) - (x1 - x2) * (x3 * y4 - y3 * x4)) /
    denominator;
  const y =
    ((x1 * y2 - y1 * x2) * (y3 - y4) - (y1 - y2) * (x3 * y4 - y3 * x4)) /
    denominator;

  return [x, y];
}

// Find intersection
const I = findIntersection(from.coords, to.coords);

function getCurvePosition() {
  const mid = interpolator(0.5);
  const int = [I[0], 0, I[0], side];
  const corner = findIntersection(mid.coords, int);
  const gap = I[1] - corner[1];
  if (gap === 0) return "no curve";
  if (gap > 0) return "above";
  if (gap < 0) return "below";
}

const curve = getCurvePosition();

// Download SVG
function downloadSVG() {
  const blob = new Blob([svg.outerHTML], { type: "image/svg+xml" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "logo.svg";
  a.click();
  a.remove();
}
download.onclick = downloadSVG;

// Draw grid
const grid = document.createElementNS(ns, "svg");
const gridSize = side + margin * 2;
grid.setAttribute("id", "grid");
grid.setAttribute("xmlns", ns);
grid.setAttribute("viewBox", `${-margin} ${-margin} ${gridSize} ${gridSize}`);
grid.style.width = `${gridSize}px`;
container.append(grid);
for (let col = 0; col <= segments; col++) {
  const path = document.createElementNS(ns, "path");
  const c = col * cell;
  path.setAttribute("d", `M${c},0,${c},${side}`);
  grid.append(path);
}
for (let row = 0; row <= segments; row++) {
  const path = document.createElementNS(ns, "path");
  const r = row * cell;
  path.setAttribute("d", `M0,${r},${side},${r}`);
  grid.append(path);
}

// Draw

// Create SVG
const svg = document.createElementNS(ns, "svg");
const size = side + margin * 2;
svg.setAttribute("xmlns", ns);
svg.setAttribute("viewBox", `${-margin} ${-margin} ${size} ${size}`);
svg.style.width = `${size}px`;
container.append(svg);

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

// Create coordinate aliases
const A = [from.coords[0], from.coords[1]];
const A_ = [to.coords[0], to.coords[1]];
const B = [from.coords[2], from.coords[3]];
const B_ = [to.coords[2], to.coords[3]];

if (curve === "no curve") {
  // Draw Shape connecting A, I, A'
  const path1 = document.createElementNS(ns, "path");
  path1.setAttribute("d", `M ${A} ${I} ${A_} Z`);
  path1.setAttribute("stroke", "black");
  path1.setAttribute("fill", "rgba(0,0,0,0)");
  path1.setAttribute("stroke-width", 1);
  svg.append(path1);

  // Draw Shape connecting B', B, A'
  const path2 = document.createElementNS(ns, "path");
  path2.setAttribute("d", `M ${B_} ${B} ${I} Z`);
  path2.setAttribute("stroke", "black");
  path2.setAttribute("fill", "rgba(0,0,0,0)");
  path2.setAttribute("stroke-width", 1);
  svg.append(path2);
} else if (curve === "above") {
  // Draw Shape connecting A, I, A'
  const path1 = document.createElementNS(ns, "path");
  path1.setAttribute("d", `M ${A} ${I} ${A_} Z`);
  path1.setAttribute("stroke", "black");
  path1.setAttribute("fill", "rgba(0,0,0,0)");
  path1.setAttribute("stroke-width", 1);
  svg.append(path1);

  // Draw Shape connecting B', B, A', with a curve between B and A'
  const path2 = document.createElementNS(ns, "path");
  path2.setAttribute("d", `M ${B_} ${B} C ${I} ${I} ${A_} Z`);
  path2.setAttribute("stroke", "black");
  path2.setAttribute("fill", "rgba(0,0,0,0)");
  path2.setAttribute("stroke-width", 1);
  svg.append(path2);
} else if (curve === "below") {
  // Draw Shape connecting B, I, B'
  const path1 = document.createElementNS(ns, "path");
  path1.setAttribute("d", `M ${B} ${I} ${B_} Z`);
  path1.setAttribute("stroke", "black");
  path1.setAttribute("fill", "rgba(0,0,0,0)");
  path1.setAttribute("stroke-width", 1);
  svg.append(path1);

  // Draw Shape connecting A', A, B', with a curve between B and A'
  const path2 = document.createElementNS(ns, "path");
  path2.setAttribute("d", `M ${A_} ${A} C ${I} ${I} ${B_} Z`);
  path2.setAttribute("stroke", "black");
  path2.setAttribute("fill", "rgba(0,0,0,0)");
  path2.setAttribute("stroke-width", 1);
  svg.append(path2);
}
