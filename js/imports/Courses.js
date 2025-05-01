import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

export default class Courses {
  constructor(selector) {
    this.element = document.querySelector(selector) || document.body;
    this.filters = this.element.querySelector(".filters");
    this.cards = this.element.querySelector(".cards");
    this.tags = [];

    this.colors = [
      d3.schemeTableau10[2], // red
      d3.schemeTableau10[1], // orange
      d3.schemeTableau10[0], // blue
      d3.schemeTableau10[4], // green
      d3.schemeTableau10[6], // purple
      d3.schemeTableau10[7], // pink
    ];

    this.setup();

    // this.subtleColors = this.colors.map((color) => {
    //   const subtle = d3.color(color);
    //   subtle.opacity = 1;
    //   return subtle.toString();
    // });
  }

  setupFilters() {
    this.filters.innerHTML += `<label>
      <input type="radio" name="tag" value="all" checked/>
      <span class="tag">Show all</span>
    </label>`;

    this.tags.forEach((tag) => {
      const filter = `<label style="color:${this.colors[this.tags.indexOf(tag)]}">
        <input type="radio" name="tag" value="${tag}"/>
        <span class="tag">${tag}</span>
      </label>`;

      this.filters.innerHTML += filter;
    });

    this.filters.addEventListener("input", (event) => {
      const selectedTags = [...this.filters.elements.tag].filter((input) => input.checked).map((input) => input.value);
      this.filterCards(selectedTags);
    });
  }

  filterCards(selectedTags) {
    if (selectedTags.length === 0 || selectedTags[0] === "all") {
      console.log("Show all");
      this.courses.forEach((course) => {
        course.hidden = false;
      });
      return;
    }

    this.courses.forEach((course) => {
      const courseTags = course.dataset.tags.split(",");
      const isMatch = selectedTags.some((tag) => courseTags.includes(tag));
      course.hidden = !isMatch;
    });
  }

  setupCards() {
    this.data.forEach((course) => {
      // TEMP: Fake duration in hours
      const duration = Math.ceil(Math.random() * 6);
      const card = `
      <a href="#" class="course" data-tags="${course.tags.join(",")}">
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
            <svg class="icon" data-iconoir="timer" viewBox="0 0 24 24" width="24px" height="24px" stroke="currentColor" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M9 2L15 2"></path>
              <path d="M12 10L12 14"></path>
              <path
                d="M12 22C16.4183 22 20 18.4183 20 14C20 9.58172 16.4183 6 12 6C7.58172 6 4 9.58172 4 14C4 18.4183 7.58172 22 12 22Z">
              </path>
            </svg>
            ${duration}<span aria-hidden="true">h</span><span class="screen-reader">${duration === 1 ? "hour" : "hours"}</span>
          </p>
        </div>
      </a>
      `;
      this.cards.innerHTML += card;
    });

    this.courses = this.cards.querySelectorAll(".course");
  }

  async setup() {
    this.data = await d3.json("./data/courses.json");

    this.data.forEach((course) => {
      course.tags.forEach((tag) => {
        if (this.tags.includes(tag)) return;
        this.tags.push(tag);
      });
    });

    this.setupFilters();
    this.setupCards();
  }

  update() {}
}
