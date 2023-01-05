import { cards_data, CARD_ART_HIDDEN_ON_LOAD } from "./main.js";
import { updateDetailsDialog, DETAILS_DIALOG_A11Y } from "./dialog.js";

const CLOUD_NAME = "dazcxdgiy";
const CLOUDINARY_URL = `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/`;

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
      if (this.getAttribute("show_title") === "true") {
        this.showSubtitle();
      }
    }

    //Returns an url of the form:
    //`https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${RARITY}/${FILENAME}.png`
    getImageURL() {
      return `${CLOUDINARY_URL}q_auto/${this.data["Rarity Folder"]}/${this.data["Filename"]}.png`;
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

    showSubtitle() {
      this.front.insertAdjacentHTML(
        "beforeend",
        `<p class="card-subtitle">${this.data["Collector Number"].padStart(
          3,
          "0"
        )} ${this.data["Card Display Name"]}</p>`
      );
    }
  }
  customElements.define("tcg-card", Card);
}

//Renders a list of cards in the element specified in htmlLocation.
//If replace is true, overwrites all elements inside htmlLocation.
//else, adds the cards to the rest of the inner content.
export function renderCards(
  cards,
  htmlLocation,
  replace = false,
  show_title = false
) {
  if (replace) {
    htmlLocation.innerHTML = "";
  }
  for (let i = 0; i < cards.length; i++) {
    htmlLocation.insertAdjacentHTML(
      "beforeend",
      `<tcg-card card-id="${cards[i]["Collector Number"]}" show_title="${show_title}"></tcg-card>`
    );
  }
}
