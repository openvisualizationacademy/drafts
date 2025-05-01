export default class ThemePicker {
  constructor(selector) {
    this.element = document.querySelector(selector);
    this.light = this.element.querySelector('input[value="light"]');
    this.dark = this.element.querySelector('input[value="dark"]');
    this.setup();
  }

  setup() {
    this.mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    this.dark.checked = this.mediaQuery.matches;
    this.light.checked = !this.mediaQuery.matches;

    this.mediaQuery.addEventListener("change", (event) => {
      this.dark.checked = event.matches;
      this.light.checked = !event.matches;
    });
  }
}
