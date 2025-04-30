import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

export default class Courses {
  constructor(selector) {
    this.element = document.querySelector(selector) || document.body;
    this.setup();
  }

  async setup() {
    this.data = await d3.json("../../data/courses.json");

    this.data.forEach((course) => {
      const item = `
      <div class="course">
        <div class="media"></div>
        <h3>${course.title}</h3>
        <p class="authors">
          ${course.authors.map((author) => `<span class="author">${author.name}</span>`).join("")}
        </p>
        <p class="tags">
          ${course.tags.map((tag) => `<span class="tag">${tag}</span>`).join("")}
        </p>
      </div>
      `;

      this.element.innerHTML += item;
    });
  }

  update() {}
}
