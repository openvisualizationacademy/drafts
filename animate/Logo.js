import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

export default class Logo {
  constructor(options = {}) {
    // Define default options
    this.defaults = {
      parent: document.body,
      side: 168,
      margin: 24,
      steps: 256 / 4,
      segments: 6,
      pixelRatio: 4,
      format: "png", // 'svg'
      palettes: ["YlOrRd", "YlGnBu", "RdPu"],

      original: {
        palette: "YlOrRd",
        from: {
          coords: [1, 5, 6, 1],
          thickness: 1,
        },
        to: {
          coords: [0, 3, 5, 6],
          thickness: 1,
        },
      },
    };

    this.defaults.current = structuredClone(this.defaults.original);

    // Merge provided options with defaults
    Object.assign(this, this.defaults, options);

    // Run setup once
    this.setup();

    // Run update for the first time
    window.requestAnimationFrame((ms) => this.update(ms));
  }

  // Cool transition from Freya Holmér’s Lerp Smoothing talk https://youtu.be/LSNQuFEDOyQ
  expDecay(a, b, decay = 2, deltaTime = this.deltaTime) {
    return b + (a - b) * Math.exp(-decay * deltaTime);
  }

  setupCanvas() {
    // Create canvas element
    this.canvas = document.createElement("canvas");

    // Create drawing context
    this.context = this.canvas.getContext("2d");

    // Define dimensions
    const width = this.side + this.margin * 2;
    this.canvas.width = width * this.pixelRatio;
    this.canvas.height = width * this.pixelRatio;
    this.canvas.style.width = `${width}px`;

    // Add canvas to page
    this.parent.append(this.canvas);
  }

  updateCanvas() {
    // Reset translation
    this.context.resetTransform();

    // Clear canvas
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Calculate in-transition “from” and “to” values so they get closer to target values
    this.current.from.coords.forEach((currentCoord, i, arr) => {
      const targetCoord = this.target.from.coords[i];
      arr[i] = this.expDecay(currentCoord, targetCoord);
    });
    this.current.to.coords.forEach((currentCoord, i, arr) => {
      const targetCoord = this.target.to.coords[i];
      arr[i] = this.expDecay(currentCoord, targetCoord);
    });

    // Define interpolator for current “from“ and “to” values
    this.interpolator = d3.interpolate(this.current.from, this.current.to);

    // Define colors scale and range
    this.colorAdjusted = d3.scaleLinear().domain([0, 1]).range([0.8, 0.2]);

    // Account for margins when drawing
    this.context.translate(
      this.margin * this.pixelRatio,
      this.margin * this.pixelRatio
    );

    // Draw a line for each step
    for (let i = 0; i < this.steps; i++) {
      // Get value between 0 and 1
      const t = (1 / this.steps) * i;

      // Find values for the current step
      const step = this.interpolator(t);

      // Adjust those values based on sizes and resolution
      step.coords = step.coords.map(
        (coord) => coord * (this.side / this.segments) * this.pixelRatio
      );

      // Define stroke thickness
      this.context.lineWidth = step.thickness * this.pixelRatio;

      // Define stroke color
      this.context.strokeStyle = d3[`interpolate${this.current.palette}`](
        this.colorAdjusted(t)
      );

      // Begin new line
      this.context.beginPath();
      this.context.moveTo(step.coords[0], step.coords[1]);
      this.context.lineTo(step.coords[2], step.coords[3]);

      // Draw line
      this.context.stroke();
    }
  }

  setupSVG() {}

  updateSVG() {}

  setup() {
    // Create properties to keep track of time elapsed
    this.lastTime = 0;
    this.deltaTime = 0;

    // Set initial target state
    this.setTarget();

    if (this.format === "png") this.setupCanvas();
    if (this.format === "svg") this.setupSVG();
  }

  update(ms) {
    // Get time elapsed since last frame (in seconds)
    this.deltaTime = (ms - this.lastTime) / 1000;
    this.lastTime = ms;

    if (this.format === "png") this.updateCanvas();
    if (this.format === "svg") this.updateSVG();

    // Run update for every frame
    window.requestAnimationFrame((ms) => this.update(ms));
  }

  resetTarget() {
    this.target = this.defaults.current;
  }

  // TODO: Randomize colors (and thickness as well?)
  randomizeTarget() {
    const options = {
      palette: "YlGnBu",
      from: {
        coords: [0, 1, 1, 0],
        thickness: 1,
      },
      to: {
        coords: [0, 0, 1, 1],
        thickness: 1,
      },
    };

    const half = this.segments / 2;

    // Corners (Smallest Second Half) Random
    const regions = [
      d3.randomInt(0, half + 1),
      d3.randomInt(half + 2, this.segments + 1),
    ];

    // Fill with values
    options.from.coords = options.from.coords.map((i) => regions[i]());
    options.to.coords = options.to.coords.map((i) => regions[i]());

    this.target = options;
  }

  setTarget(options) {
    if (options === undefined) {
      this.resetTarget();
      return;
    }

    // TODO: Apply provided options more carefully
    this.target = options;
  }
}
