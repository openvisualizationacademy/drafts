import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

export default class People {
  constructor(selector) {
    this.element = document.querySelector(selector) || document.body;

    this.setup();
  }

  setupCards() {
    this.data.forEach((person) => {
      const card = `
      <a href="#" class="person">
        <figure>
          <img class="media" src="media/people/${person.photo}" loading="lazy" alt="Profile photo">
          <figcaption>
            <strong>${person.name}<span class="screen-reader"/>.</span></strong>
            <span class="tagline">${person.tagline}</span>  
          </figcaption>
        </figure>
      </a>
      `;
      this.element.innerHTML += card;
    });
  }

  async setup() {
    this.data = await d3.json("./data/people.json");
    this.data.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));

    this.setupCards();
  }

  update() {}
}
