import Logo from "./Logo.js";

window.logo = new Logo();

document.onclick = () => {
  window.logo.randomizeTarget();
};
