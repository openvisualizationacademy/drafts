import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

export default class Courses {
  constructor(selector) {
    this.element = document.querySelector(selector) || document.body;
    this.setup();

    // Darkest 2 colors of YoOrRd, YlGnBu, and RdPu (from 4-color schemes of ColorBrewwer)
    // this.colors = ["#e31a1c", "#225ea8", "#ae017e", "#fd8d3c", "#41b6c4", "#f768a1"];
    console.log();
    this.colors = [
      d3.schemeTableau10[2], // red
      d3.schemeTableau10[1], // orange
      d3.schemeTableau10[0], // blue
      d3.schemeTableau10[4], // green
      d3.schemeTableau10[6], // purple
      d3.schemeTableau10[7], // pink
    ];

    this.subtleColors = this.colors.map((color) => {
      const subtle = d3.color(color);
      subtle.opacity = 1;
      return subtle.toString();
    });

    // this.colors = d3.schemeObservable10;

    // console.log(this.colors);
  }

  async setup() {
    this.data = await d3.json("../../data/courses.json");
    this.tags = [];
    this.data.forEach((course) => {
      course.tags.forEach((tag) => {
        if (this.tags.includes(tag)) return;
        this.tags.push(tag);
      });
    });
    this.data.forEach((course) => {
      const item = `
      <a href="#" class="course">
        <div class="primary">
          <div class="media"></div>
          <h3>${course.title}</h3>
          <p class="authors">
            ${course.authors.map((author) => `<span class="author">${author.name}</span>`).join("")}
          </p>
        </div>
        <div class="secondary">
          <p class="tags">
            ${course.tags
              .map((tag) => `<span class="tag" style="color: ${this.colors[this.tags.indexOf(tag)]}">${tag}</span>`)
              .join("")}
          </p>
          <p class="duration">
            <span class="screen-reader">Duration</span>
            <i class="iconoir-timer" style="translate: 0 .1em"></i>
            ${Math.ceil(Math.random() * 6)}h
          </p>
        </div>
      </a>
      `;
      this.element.innerHTML += item;
    });
  }

  update() {}
}
