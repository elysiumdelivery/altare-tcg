const loading_overlay = document.getElementById("loading-overlay");
const welcome_message = document.getElementById("welcome-message");
const welcome_fancy_menu = document.getElementById("welcome-fancy-menu");


// temp callback to remove splash overlay screen for now.
// probably should toggle the active state when card data loads in
document.body.onload = function () {
    setTimeout(function () {
        window.scrollTo(0, 0)
        loading_overlay.classList.remove("active");
        welcome_message.classList.remove("visually-hidden");
        setTimeout(function () {
            loading_overlay.classList.add("visually-hidden");
            welcome_message.classList.add("active");
        }, 100);
    }, 2000);
}

function toggleWelcomeTwo () {
    welcome_message.classList.add("scroll-up");
    welcome_fancy_menu.classList.remove("visually-hidden");
    setTimeout(function () {
        welcome_fancy_menu.classList.add("active");
    }, 100);
}