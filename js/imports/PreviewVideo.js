export default class PreviewVideos {
  constructor(selector) {
    this.element = document.querySelector(selector);
    if (!this.element) return;
    this.video = this.element.querySelector("video");
    this.controls = this.element.querySelectorAll("[data-control]");
    this.setup();
  }

  get isFulllScreen() {
    if (document.fullscreenElement && document.fullscreenElement !== null) return true;
    if (document.webkitFullscreenElement && document.webkitFullscreenElement !== null) return true;
    if (document.mozFullScreenElement && document.mozFullScreenElement !== null) return true;
    if (document.msFullscreenElement && document.msFullscreenElement !== null) return true;

    return false;
  }

  requestFullscreen() {
    // Video or wrapper element
    const element = this.video;

    if (element.requestFullScreen) {
      element.requestFullScreen();
      return;
    }

    if (element.mozRequestFullScreen) {
      element.mozRequestFullScreen();
      return;
    }

    if (element.webkitRequestFullScreen) {
      element.current.webkitRequestFullScreen();
      return;
    }

    if (this.video.webkitEnterFullScreen) {
      this.video.webkitEnterFullScreen();
      return;
    }
  }

  exitFullscreen() {
    if (document.exitFullscreen) {
      document.exitFullscreen();
      return;
    }

    if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
      return;
    }

    if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
      return;
    }

    if (document.msExitFullscreen) {
      document.msExitFullscreen();
      return;
    }
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
    if (!this.isFulllScreen) {
      this.requestFullscreen();
      return;
    }

    this.exitFullscreen();
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
