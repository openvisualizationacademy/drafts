import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

export default class Courses {
  constructor(selector) {
    this.element = document.querySelector(selector) || document.body;
    this.setup();
  }

  async setup() {
    console.log(this.element);
    this.list = await d3.json("../../data/courses.json");

    console.log(this.list);

    this.list.forEach((course) => {
      const item = `
      <div class="course">
      ${course.title}
      </div>
      `;

      this.element.innerHTML += item;
    });
  }

  update() {}
}
