import Logo from "./Logo.js";
import Courses from "./Courses.js";
import ThemePicker from "./ThemePicker.js";

export default class App {
  constructor(selector) {
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

    this.courses = new Courses(".courses .cards");
    this.themePicker = new ThemePicker(".theme-picker");
  }

  update() {}
}
