import { cards_data, CARD_ART_HIDDEN_ON_LOAD } from "./main.js";
import { updateDetailsDialog, DETAILS_DIALOG_A11Y } from "./dialog.js";

const CLOUD_NAME = "dazcxdgiy";
const CLOUDINARY_URL = `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/`;

//Object to store all supported sorting functions.
//Can be used by calling:
//array.sort(sort_functions[key])
const sort_functions = {
  "Collector Number": (a, b) => {
    return parseInt(a["Collector Number"]) > parseInt(b["Collector Number"])
      ? 1
      : -1;
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
      if (!localStorage.getItem(`card-${this.data["Collector Number"]}`)) {
        this.front.classList.add("card-not-owned");
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
  let storage = { ...localStorage };
  for (let item in storage) {
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

export function showCollection(cards_data, htmlLocation) {
  let sort = localStorage.getItem("sort");
  let fullCollection = localStorage.getItem("fullCollection") === "true";

  if (fullCollection) {
    let sorted = sortCards(cards_data, sort);
    renderCards(sorted, htmlLocation, true);
  } else {
    let ownedCards = getOwnedCards(cards_data);
    if (ownedCards.length == 0) {
      alert("TODO: No cards to show");
    } else {
      ownedCards = sortCards(ownedCards, sort);
    }
    renderCards(ownedCards, htmlLocation, true);
  }
}