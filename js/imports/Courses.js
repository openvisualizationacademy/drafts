import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

export default class Courses {
  constructor(selector) {
    this.element = document.querySelector(selector) || document.body;
    this.setup();

    this.colors = [
      d3.schemeTableau10[2], // red
      d3.schemeTableau10[1], // orange
      d3.schemeTableau10[0], // blue
      d3.schemeTableau10[4], // green
      d3.schemeTableau10[6], // purple
      d3.schemeTableau10[7], // pink
    ];

    // this.subtleColors = this.colors.map((color) => {
    //   const subtle = d3.color(color);
    //   subtle.opacity = 1;
    //   return subtle.toString();
    // });
  }

  async setup() {
    this.data = await d3.json("../data/courses.json");
    this.tags = [];
    this.data.forEach((course) => {
      course.tags.forEach((tag) => {
        if (this.tags.includes(tag)) return;
        this.tags.push(tag);
      });
    });
    this.data.forEach((course) => {
      // TEMP: Fake duration in hours
      const duration = Math.ceil(Math.random() * 6);
      const item = `
      <a href="#" class="course">
        <div class="primary">
          <div class="media"></div>
          <h3>${course.title}<span class="screen-reader"/>.</span></h3>
          <p class="authors">
            <span class="screen-reader">${course.authors.length > 1 ? "Authors" : "Author"}:</span>
            ${course.authors
              .map((author) => `<span class="author">${author.name}</span>`)
              .join(`<span class="screen-reader"/>.</span>`)}
            <span class="screen-reader"/>.</span>
          </p>
        </div>
        <div class="secondary">
          <p class="tags">
            ${course.tags
              .map((tag) => `<span class="tag" style="color: ${this.colors[this.tags.indexOf(tag)]}">${tag}</span>`)
              .join(`<span class="screen-reader"/>.</span>`)}
            <span class="screen-reader"/>.</span>
          </p>
          <p class="duration">
            <span class="screen-reader">Duration: </span>
            <i class="iconoir-timer" style="translate: 0 .1em"></i>
            ${duration}<span aria-hidden="true">h</span><span class="screen-reader">${duration === 1 ? "hour" : "hours"}</span>
          </p>
        </div>
      </a>
      `;
      this.element.innerHTML += item;
    });
  }

  update() {}
}
