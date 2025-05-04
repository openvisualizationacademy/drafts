export default class PreviewVideos {
  constructor(selector) {
    this.element = document.querySelector(selector);
    if (!this.element) return;
    this.video = this.element.querySelector("video");
    this.controls = this.element.querySelectorAll("[data-control]");
    this.setup();
  }

  play() {
    if (this.video.paused) {
      this.video.play();
      return;
    }

    this.video.pause();
  }

  unmute() {
    this.video.muted = !this.video.muted;
  }

  expand() {
    if (!document.fullscreenElement) {
      this.video.requestFullscreen();
      return;
    }

    if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  }

  setup() {
    this.controls.forEach((element) => {
      element.addEventListener("click", () => {
        const handler = element.dataset.control;
        if (handler in this) {
          this[handler]();
        }
      });
    });
  }

  update() {}
}
