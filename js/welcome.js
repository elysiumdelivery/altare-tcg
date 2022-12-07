const splash_overlay = document.getElementById("splash-overlay");


// temp callback to remove splash overlay screen for now.
// probably should toggle the active state when card data loads in
document.body.onload = function () {
    setTimeout(function () {
        splash_overlay.classList.remove("active");
    }, 2000);
}