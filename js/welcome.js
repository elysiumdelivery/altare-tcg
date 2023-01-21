const welcome_message = document.getElementById("welcome-message");
const welcome_message_button = document.getElementById("welcome-splash-button");
const welcome_fancy_menu = document.getElementById("welcome-fancy-menu");

// temp callback to remove splash overlay screen for now.
// probably should toggle the active state when card data loads in
document.body.onload = function () {
  setTimeout(function () {
    window.scrollTo(0, 0);
    welcome_message.classList.add("active");
  }, 500);
};

function toggleWelcome() {
  welcome_message.classList.add("scroll-up");
  setTimeout(function () {
    welcome_fancy_menu.classList.add("active");
  }, 100);
}
