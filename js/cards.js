import { cards_data, CARD_ART_HIDDEN_ON_LOAD } from "./main.js";
import { updateDetailsDialog, DETAILS_DIALOG_A11Y } from "./dialog.js";

const CLOUD_NAME = "dazcxdgiy";
const CLOUDINARY_URL = `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/`;
const COLLECTED_CARDS_NUMBER = document.getElementById(
  "collected-cards-number"
);
const PAGINATION_BTNS = {
  container: document.getElementById("collection-pagination"),
  total: document.getElementById("pagination-total"),
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
//These are stored as closures to support reverse order without declaring new functions.
//Can be used by calling:
//array.sort(sort_functions[key](1, -1))
//If you want to reverse order, swap the 1 and -1 when calling the function.
const sort_functions = {
  "Collector Number": (before=1, after=-1) =>
    (a, b) => {
      return parseInt(a["Collector Number"]) > parseInt(b["Collector Number"])
          ? before
          : after;
    },
  Rarity: (before=1, after=-1) => (a, b) => {
    if (a["Rarity Folder"] === b["Rarity Folder"]) {
      return sort_functions["Collector Number"]()(a, b);
    } else {
      return RARITIES.indexOf(a["Rarity Folder"]) >
        RARITIES.indexOf(b["Rarity Folder"])
        ? before
        : after;
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

function sortCards(cards, sortType, reverse=false) {
  sortType = sortType ?? "Collector Number";
  let before = reverse ? -1 : 1
  let after = reverse ? 1 : -1
  cards.sort(sort_functions[sortType](before, after));
  return cards;
}

export function showCollection(cards_data, htmlLocation, page = 1) {
  let sort = localStorage.getItem("sort") ?? "Collector Number";
  let fullCollection = localStorage.getItem("fullCollection") === "true";
  let cards;
  let reverse = false;
  let ownedCount = 0;
  for (let rarity of RARITIES) {
    ownedCount += parseInt(localStorage.getItem(`count-${rarity}`) ?? "0");
  }
  COLLECTED_CARDS_NUMBER.textContent = `Collected cards: ${ownedCount}/${cards_data.length}`;

  //If the chosen sort type has a "-" at the end, it means that it's in reverse order.
  //So we ignore that last character and take the rest of the string.
  if (sort[sort.length - 1] === "-") {
    sort = sort.slice(0, -1)
    reverse = true;
  }

  if (fullCollection) {
    cards = sortCards(cards_data, sort, reverse);
  } else {
    cards = getOwnedCards(cards_data);
    if (cards.length == 0) {
      htmlLocation.innerHTML =
        "You have no cards at the moment. Try pulling some at the gacha!";
      PAGINATION_BTNS.container.classList.add("hidden");
      return;
    } else {
      cards = sortCards(cards, sort, reverse);
    }
  }

  //If we will show more cards than the amount specified in CARDS_PER_PAGE,
  //then we split them into parts and show the pagination controls.
  if (cards.length > CARDS_PER_PAGE) {
    PAGINATION_BTNS.container.classList.remove("hidden");
    PAGINATION_BTNS.total.textContent = `${page} of ${Math.ceil(cards.length / CARDS_PER_PAGE)}`
    let lastCard = cards[cards.length - 1]["Collector Number"];
    cards = cards.slice(CARDS_PER_PAGE * (page - 1), CARDS_PER_PAGE * page);
    //Set middle button as current page number.
    PAGINATION_BTNS.current.textContent = page;
    if (page == 1) {
      //If we're on first page, hide controls to go to previous page.
      PAGINATION_BTNS.previous.classList.add("hidden");
    } else {
      PAGINATION_BTNS.previous.classList.remove("hidden");
      PAGINATION_BTNS.previous.onclick = (event) =>
        showCollection(cards_data, htmlLocation, page - 1);
    }
    if (cards[cards.length - 1]["Collector Number"] === lastCard) {
      //If we're on last page, hide controls to go to next page.
      PAGINATION_BTNS.next.classList.add("hidden");
    } else {
      PAGINATION_BTNS.next.classList.remove("hidden");
      PAGINATION_BTNS.next.onclick = (event) =>
        showCollection(cards_data, htmlLocation, page + 1);
    }
  } else {
    //If we don't need pagination, we hide the controls.
    PAGINATION_BTNS.container.classList.add("hidden");
  }
  renderCards(cards, htmlLocation, true);
}
