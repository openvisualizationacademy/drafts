import Logo from "./Logo.js";

export default class App {
  constructor(selector = "body") {
    this.element = document.querySelector(selector) || document.body;
    this.setup();
  }

  setup() {
    this.logo = new Logo({
      parent: ".logo",
      margin: 1,
      side: 96,
    });
    this.wave = new Logo({
      parent: ".wave",
      margin: 168 / 2,
      side: 168,
      wave: true,
    });
  }

  update() {}
}
