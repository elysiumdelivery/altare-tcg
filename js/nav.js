/**
 * Setup click events for hamburger nav
 */
 async function setupNavClickEvents () {
    let mobileButton = document.getElementById("nav-hamburger");
    let closeButton = document.getElementById("close-nav-menu");
    let navElement = document.getElementsByTagName("nav")[0];
    function openNavMenu (event) {
      // for css transition purposes, .active sets visibility state, while .open sets transform & opacity
      this.classList.add("active");
      this.classList.add("open");
    }
    
    function closeNavMenu (event) {
      // removing both at once causes the transition out to be sudden, so separate w/ timeout
      // transition out the transform & opacity first
      this.classList.remove("open");
      setTimeout(() => {
        // then remove visibility
        this.classList.remove("active");
      }, 250); // 0.25s is the transition timing (see nav.css)
    }
  
    mobileButton.onclick = openNavMenu.bind(navElement);
    closeButton.onclick = closeNavMenu.bind(navElement);
}

setupNavClickEvents();