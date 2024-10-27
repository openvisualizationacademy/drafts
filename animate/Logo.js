import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

export default class Logo {
  constructor(options = {}) {
    // Define default options
    const defaults = {
      parent: document.body,
      side: 168,
      margin: 24,
      steps: 3, // 255,
      segments: 6,
      thickness: 10, // TODO: add to from/to object so it can be animated?
      // cell: side / segments,
      pixelRatio: 4, // window.devicePixelRatio
      format: "png", // 'svg'
    };

    // Merge provided options with defaults
    Object.assign(this, defaults, options);

    // Run setup once
    this.setup();

    // Run update for the first time
    window.requestAnimationFrame((ms) => this.update(ms));
  }

  setupCanvas() {
    // Create canvas element
    this.canvas = document.createElement("canvas");

    // Create drawing context
    this.context = this.canvas.getContext("2d");

    // Define dimensions
    const width = this.side + this.margin * 2;
    const height = this.side + this.margin * 2;

    this.canvas.width = width * this.pixelRatio;
    this.canvas.height = width * this.pixelRatio;

    this.canvas.style.width = `${width}px`;
    this.canvas.style.height = `${height}px`;

    // Account for margins when drawing
    this.context.translate(
      this.margin * this.pixelRatio,
      this.margin * this.pixelRatio
    );

    // Add canvas to page
    this.parent.append(this.canvas);
  }

  updateCanvas() {
    // Clear canvas
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw a line for each step
    for (let step = 0; step < this.steps; step++) {
      // Define stroke thickness
      this.context.lineWidth = this.thickness * this.pixelRatio;

      // Begin new line
      this.context.beginPath();
      this.context.moveTo(0, 0);
      this.context.lineTo(
        this.side * this.pixelRatio,
        this.side * this.pixelRatio
      );

      // Draw line
      this.context.stroke();
    }
  }

  setupSVG() {}

  updateSVG() {}

  setup() {
    if (this.format === "png") this.setupCanvas();
    if (this.format === "svg") this.setupSVG();
  }

  update(ms) {
    console.log(ms);

    if (this.format === "png") this.updateCanvas();
    if (this.format === "svg") this.updateSVG();

    // Run update for every frame
    window.requestAnimationFrame((ms) => this.update(ms));
  }
}
