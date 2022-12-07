const splash_overlay = document.getElementById("splash-overlay");
const welcome_splash_1 = document.getElementById("welcome-splash-1");
const welcome_splash_2 = document.getElementById("welcome-splash-2");


// temp callback to remove splash overlay screen for now.
// probably should toggle the active state when card data loads in
document.body.onload = function () {
    setTimeout(function () {
        window.scrollTo(0, 0)
        splash_overlay.classList.remove("active");
        welcome_splash_1.classList.add("active");
    }, 2000);
}

function toggleWelcomeTwo () {
    welcome_splash_1.classList.add("scroll-up");
    welcome_splash_2.classList.add("active");
}