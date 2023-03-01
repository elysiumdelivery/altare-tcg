const welcome_message = document.getElementById("welcome-message");
const welcome_message_button = document.getElementById("welcome-splash-button");
const welcome_fancy_menu = document.getElementById("welcome-fancy-menu");
const homepage_footer = document.getElementById("homepage-footer");

// temp callback to remove splash overlay screen for now.
// probably should toggle the active state when card data loads in
document.body.onload = function () {
  darkModeCheck();
  setTimeout(function () {
    window.scrollTo(0, 0);
    welcome_message.classList.add("active");
  }, 500);
};

function toggleWelcome() {
  welcome_message.classList.add("scroll-up");
  setTimeout(function () {
    welcome_fancy_menu.classList.add("active");
    homepage_footer.classList.add("active");
  }, 100);
}


function darkModeCheck () {
  const themeColor = document.querySelector('meta[name="theme-color"]');
  let systemPrefersDarkMode = false;
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    // system dark mode
    systemPrefersDarkMode = true;
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
      toggleDarkMode(event.matches);
    });  
  }
  // if dark mode is preferred, add the dark mode class to the body element
  if (systemPrefersDarkMode) {
    if (themeColor) {
      themeColor.content = systemPrefersDarkMode ? 'black' : 'white'; 
    }
    toggleDarkMode(true);
  }
  // if user decides to adjust on the site, add/remove the appropriate class
  document.getElementById("dark-mode-toggle").addEventListener("change", (e) => {
    toggleDarkMode(e.target.checked);
  });
}

function toggleDarkMode (isDarkModeOn) {
  let toggleEl = document.getElementById("dark-mode-toggle");
  if (isDarkModeOn) {
    document.querySelector('body').classList.add("dark-mode");
    toggleEl.checked = true;
  }
  else {
    document.querySelector('body').classList.remove("dark-mode");
    toggleEl.checked = false;
  }
}