import { cards_data, CARD_ART_HIDDEN_ON_LOAD } from "./main.js";
import { updateDetailsDialog, DETAILS_DIALOG_A11Y } from "./dialog.js";

const CLOUD_NAME = "dazcxdgiy";
const CLOUDINARY_URL = `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/`;
const COLLECTED_CARDS_NUMBER = document.getElementById(
  "collected-cards-number"
);
const PAGINATION = {
  container: document.getElementById("collection-pagination"),
  previous: document.getElementById("pagination-previous"),
  current: document.getElementById("pagination-current"),
  next: document.getElementById("pagination-next"),
};
const RARITIES = [
  "Element",
  "Common",
  "Uncommon",
  "Rare",
  "HoloRare",
  "UltraRare",
  "SecretRare",
];
const CARDS_PER_PAGE = 10;

//Object to store all supported sorting functions.
//Can be used by calling:
//array.sort(sort_functions[key])
//TODO: Wrap them in closures to reverse them easily.
const sort_functions = {
  "Collector Number": (a, b) => {
    return parseInt(a["Collector Number"]) > parseInt(b["Collector Number"])
      ? 1
      : -1;
  },
  Rarity: (a, b) => {
    if (a["Rarity Folder"] === b["Rarity Folder"]) {
      return sort_functions["Collector Number"](a, b);
    } else {
      return RARITIES.indexOf(a["Rarity Folder"]) >
        RARITIES.indexOf(b["Rarity Folder"])
        ? 1
        : -1;
    }
  },
};

//Custom Card component. Use it like this:
//<tcg-card card-id="[COLLECTOR_NUMBER]"></tcg-card>
export async function defineCardComponent() {
  let html = await fetch("../card.html");
  html = await html.text();

  class Card extends HTMLElement {
    data = {};
    front;
    back;

    constructor() {
      super();
      this.data = cards_data.find(
        (card) => card["Collector Number"] == this.getAttribute("card-id")
      );
      this.innerHTML = html;
      this.front = this.getElementsByClassName("card-front")[0];
      this.back = this.getElementsByClassName("card-back")[0];
      const image = this.getElementsByClassName("card-image")[0];
      image.src = this.getImageURL();
      this.setupOnClickEvents();
      if (CARD_ART_HIDDEN_ON_LOAD) {
        this.flipCard();
      }
    }

    //Returns an url of the form:
    //`https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${RARITY}/${FILENAME}.png`
    getImageURL() {
      return `${CLOUDINARY_URL}${this.data["Rarity Folder"]}/${this.data["Filename"]}.png`;
    }

    flipCard() {
      this.front.classList.toggle("hidden");
      this.back.classList.toggle("hidden");
    }

    //Binds the card's onclick events to flip and show the description popup.
    setupOnClickEvents() {
      this.back.onclick = (event) => this.flipCard();
      this.front.onclick = (event) => this.showDetails();
    }

    showDetails() {
      updateDetailsDialog(this.data, this.getImageURL());
      DETAILS_DIALOG_A11Y.show();
    }
  }
  customElements.define("tcg-card", Card);
}

//Renders a list of cards in the element specified in htmlLocation.
//If replace is true, overwrites all elements inside htmlLocation.
//else, adds the cards to the rest of the inner content.
export function renderCards(cards, htmlLocation, replace = false) {
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

function getOwnedCards(cards_data) {
  let ownedCards = [];
  for (let item in localStorage) {
    if (item.slice(0, 4) === "card") {
      let card_id = item.split("-")[1];
      ownedCards.push(
        cards_data.find((card) => card["Collector Number"] === card_id)
      );
    }
  }
  return ownedCards;
}

function sortCards(cards, sortType) {
  sortType = sortType ?? "Collector Number";
  cards.sort(sort_functions[sortType]);
  return cards;
}

export function showCollection(cards_data, htmlLocation, page = 1) {
  let sort = localStorage.getItem("sort");
  let fullCollection = localStorage.getItem("fullCollection") === "true";
  let cards;
  let ownedCount = 0;
  for (let rarity of RARITIES) {
    ownedCount += parseInt(localStorage.getItem(`count-${rarity}`) ?? "0");
  }
  COLLECTED_CARDS_NUMBER.textContent = `Collected cards: ${ownedCount}/${cards_data.length}`;

  if (fullCollection) {
    cards = sortCards(cards_data, sort);
  } else {
    cards = getOwnedCards(cards_data);
    if (cards.length == 0) {
      htmlLocation.innerHTML =
        "You have no cards at the moment. Try pulling some at the gacha!";
      return;
    } else {
      cards = sortCards(cards, sort);
    }
  }
  if (cards.length > CARDS_PER_PAGE) {
    PAGINATION.container.classList.remove("hidden");
    let lastCard = cards[cards.length - 1]["Collector Number"];
    cards = cards.slice(CARDS_PER_PAGE * (page - 1), CARDS_PER_PAGE * page);
    PAGINATION.current.textContent = page;
    if (page == 1) {
      PAGINATION.previous.classList.add("hidden");
    } else {
      PAGINATION.previous.classList.remove("hidden");
      PAGINATION.previous.onclick = (event) =>
        showCollection(cards_data, htmlLocation, page - 1);
    }
    if (cards[cards.length - 1]["Collector Number"] === lastCard) {
      PAGINATION.next.classList.add("hidden");
    } else {
      PAGINATION.next.classList.remove("hidden");
      PAGINATION.next.onclick = (event) =>
        showCollection(cards_data, htmlLocation, page + 1);
    }
  } else {
    PAGINATION.container.classList.add("hidden");
  }
  renderCards(cards, htmlLocation, true);
}
