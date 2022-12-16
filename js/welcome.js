const loading_overlay = document.getElementById("loading-overlay");
const welcome_message = document.getElementById("welcome-message");
const welcome_message_button = document.getElementById("welcome-splash-button");
const welcome_fancy_menu = document.getElementById("welcome-fancy-menu");


// temp callback to remove splash overlay screen for now.
// probably should toggle the active state when card data loads in
document.body.onload = function () {
    setTimeout(function () {
        window.scrollTo(0, 0)
        loading_overlay.classList.remove("active");
        setTimeout(function () {
            welcome_message.classList.add("active");
        }, 100);
    }, 2000);
}

function toggleWelcomeTwo () {
    welcome_message.classList.add("scroll-up");
    welcome_message.setAttribute('aria-hidden', 'true');
    setTimeout(function () {
        welcome_fancy_menu.classList.add("active");
    }, 100);
}