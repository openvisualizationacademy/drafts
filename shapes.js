import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

// TODO: ACTUALLY CREATE SHAPES VERSION

// Namespace
const ns = "http://www.w3.org/2000/svg";

// Parent
const container = document.querySelector("#container");

// Options
const format = "svg"; // TODO: add "png" support
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
function randomizeCoords() {
  // Corners (Smallest Second Half) Random
  const half = segments / 2;
  const regions = [
    d3.randomInt(0, half + 1),
    d3.randomInt(half + 2, segments + 1),
  ];

  // Coin flip to chose horizontal or vertical
  // if (Math.random() > 0.5) {

  // Horizontal Template
  from.coords = [0, 1, 1, 0];
  to.coords = [0, 0, 1, 1];

  // } else {
  //   // Vertical Template
  //   from.coords = [0, 0, 1, 1];
  //   to.coords = [1, 0, 0, 1];
  // }

  // Fill with values
  from.coords = from.coords.map((i) => regions[i]() * cell);
  to.coords = to.coords.map((i) => regions[i]() * cell);
}

randomizeCoords();

// Reset drawing
function clear() {
  container.replaceChildren();
}

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
const totalSize = side + margin * 2;
svg.setAttribute("xmlns", ns);
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

// Draw Letters (for Debugging)

const coords = [...from.coords, ...to.coords];
["A", "B", "A'", "B'"].forEach((letter, index) => {
  const start = index * 2;
  const x = coords[start];
  const y = coords[start + 1];

  const text = document.createElementNS(ns, "text");
  text.innerHTML = letter;
  text.setAttribute("x", x);
  text.setAttribute("y", y);

  svg.append(text);
});
