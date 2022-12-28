//Happy Birthday Leader! 🎇💙
import { defineCardComponent, renderCards } from "./cards.js";
import { setupDetailsDialog } from "./dialog.js";
import { GACHA_BUTTON, CARDS_PER_PULL, pullAndRenderCards } from "./gacha.js";

const CSV_FILENAME = "../Test Card List CSV.csv";
const pathname = window.location.pathname;
const CURRENT_PAGE = pathname.slice(pathname.lastIndexOf("/"), pathname.length);
const PAGES_WHERE_CARD_HIDDEN = ["/gacha.html"];
const COLLECTIONS_MAIN_CONTENT = document.getElementById("card-list");

export const CARD_ART_HIDDEN_ON_LOAD =
  PAGES_WHERE_CARD_HIDDEN.includes(CURRENT_PAGE);
//Holds the data of all cards after parsing the CSV file.

export let cards_data = [];

function getCSVData(callback = undefined) {
  Papa.parse(CSV_FILENAME, {
    download: true,
    //To treat the first row as column titles
    header: true,
    complete: (result) => {
      cards_data = result.data;
      if (callback) {
        callback(cards_data);
      }
    },
  });
}

//Pulls n cards from the passed "cards" array using the Fisher-Yates Shuffle.
function pullCards(cards, n) {
  if (n <= 0) {
    throw "n must be a positive integer bigger than 0";
  }
  let len = cards.length;
  if (n > len) {
    throw "Not enough elements in array";
  }
  let samples = [...cards];

  while (len) {
    let i = Math.floor(Math.random() * len--);
    let j = samples[len];
    samples[len] = samples[i];
    samples[i] = j;
  }
  return samples.slice(0, n);
}

//Pulls "n" number of cards from the cards_data array and renders them in CARD_LIST.
function pullAndRenderCards(n) {
  let pulled = pullCards(cards_data, n);
  renderCards(pulled, COLLECTIONS_MAIN_CONTENT, true);
}

//Renders a list of cards in the element specified in htmlLocation.
//If replace is true, overwrites all elements inside htmlLocation.
//else, adds the cards to the rest of the inner content.
function renderCards(cards, htmlLocation, replace = false) {
  if (replace) {
    htmlLocation.innerHTML = "";
  }
  for (let i = 0; i < cards.length; i++) {
    htmlLocation.insertAdjacentHTML(
      "beforeend",
      `<tcg-card card-id="${cards[i]["Collector Number"]}"></tcg-card>`
    );
  }
}

async function defineNavComponent() {
  let html = await fetch("../nav.html");
  html = await html.text();

  class Nav extends HTMLElement {

    mobileButton;
    closeButton;
    navElement;

    constructor() {
      super();
      this.innerHTML = html;
      this.mobileButton = document.getElementById("nav-button");
      this.closeButton = document.getElementById("close-nav-menu");
      this.navElement = document.getElementsByTagName("nav")[0];
      
      this.setupOnClickEvents();

      // Set active state on the current nav tab
      let pageName = CURRENT_PAGE.replace(/[\/]?(\.html)?/g, "");
      document.getElementById(`nav-${pageName}`).classList.add("active");
    }

    openNavMenu (event) {
      this.navElement.classList.add("active");
      setTimeout(() => {
        this.navElement.classList.add("open");
      }, 250);
    }
    
    closeNavMenu (event) {
      this.navElement.classList.remove("open");
      setTimeout(() => {
        this.navElement.classList.remove("active");
      }, 250);
    }

    //Binds the card's onclick events to flip and show the description popup.
    setupOnClickEvents() {
      this.mobileButton.onclick = this.openNavMenu.bind(this);
      this.closeButton.onclick = this.closeNavMenu.bind(this);
    }
  }
  customElements.define("app-nav", Nav);
}

async function main() {
  await defineNavComponent();
  await defineCardComponent();
  getCSVData((cards_data) => {
    if (CURRENT_PAGE == "/collection.html") {
      renderCards(cards_data, COLLECTIONS_MAIN_CONTENT);
    }
  });
  switch (CURRENT_PAGE) {
    case "/gacha.html":
      GACHA_BUTTON.onclick = (event) =>
        pullAndRenderCards(
          cards_data,
          CARDS_PER_PULL,
          COLLECTIONS_MAIN_CONTENT
        );
      await setupDetailsDialog();
      break;
    case "/collection.html":
      await setupDetailsDialog();
  }
}

main();
