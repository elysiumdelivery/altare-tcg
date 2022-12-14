import { cards_data, CARD_ART_HIDDEN_ON_LOAD } from "./main.js";
import { updateDetailsDialog, DETAILS_DIALOG_A11Y } from "./dialog.js";

const CLOUD_NAME = "dazcxdgiy";
const CLOUDINARY_URL = `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/`;
const HIGHEST_Z_INDEX = 10;
let card_z_index = HIGHEST_Z_INDEX;
let gacha_display_selection;

export const GACHA_VIEW_SETTING = document.querySelectorAll(
  'input[name="gacha-display"]'
);
export const GACHA_SECTION = document.getElementById("gacha-controls");

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
      this.holder = this.getElementsByClassName("card-component")[0];
      this.front = this.getElementsByClassName("card-front")[0];
      this.front.setAttribute("aria-label", this.getSubtitleText());
      this.back = this.getElementsByClassName("card-back")[0];
      this.image = this.getElementsByClassName("card-image")[0];
      this.image.style.backgroundImage = 'url("' + this.getImageURL() + '")';
      this.image.classList.add(setCardRarity(this.data["Rarity Folder"]));
      this.subtitle = this.getElementsByClassName("card-subtitle")[0];
      this.subtitle.textContent = this.getSubtitleText();
      this.setupOnClickEvents();
      if (CARD_ART_HIDDEN_ON_LOAD) {
        this.setupCardForGacha();
        this.subtitle.classList.add("hidden");
      }
    }

    //Returns an url of the form:
    //`https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${RARITY}/${FILENAME}.png`
    getImageURL() {
      return `${CLOUDINARY_URL}q_auto/${this.data["Rarity Folder"]}/${this.data["Filename"]}.png`;
    }

    setupCardForGacha() {
      // The back of the card is automatically hidden for the collections page
      // We have to reset it for the gacha so that it can be clicked on
      this.back.classList.remove("hidden");
      // With card back shown, make card front inaccessible, just like it is for mouse users
      this.front.tabIndex = "-1";
      this.front.setAttribute("aria-hidden", "true");
    }

    flipCard() {
      // update the next value for the zIndex
      card_z_index++;

      // register as a clicked card, add class to animate flip-over, and make card front accessible again
      this.classList.add("clicked");
      this.holder.classList.add("flip");
      this.front.removeAttribute("tabindex");
      this.front.removeAttribute("aria-hidden");
      this.back.tabIndex = "-1";
      this.back.setAttribute("aria-hidden", "true");
      // have screenreader announce the card name
      document.getElementById("pull-announcement").textContent =
        this.getSubtitleText();

      // Start the animation and update the z-index when the animation starts
      // This is to stack any opened cards in the reverse order
      this.addEventListener("animationstart", updateZIndex);
      // animation optimization: inform browser that we are changing the following properties
      this.image.style.willChange =
        "transform, filter, opacity, background-position";
      this.image.classList.add("opened");
      this.image.classList.add("animated");

      // remove the previous hover effects only if the gacha is not displayed as a grid
      if (gacha_display_selection !== "gacha-grid") {
        this.addEventListener("animationend", addUnclickableToCardsExceptLast);
      } else {
        this.subtitle.classList.remove("hidden");
      }
    }

    //Binds the card's onclick events to flip and show the description popup.
    setupOnClickEvents() {
      this.back.onclick = (event) => this.flipCard();
      // if not gacha it will show the extra card information
      if (!CARD_ART_HIDDEN_ON_LOAD) {
        this.front.onclick = (event) => this.showDetails();
      }
    }

    showDetails() {
      updateDetailsDialog(this.data, this.getImageURL());
      DETAILS_DIALOG_A11Y.show();
    }

    getSubtitleText() {
      return `${this.data["Collector Number"].padStart(3, "0")} ${
        this.data["Card Display Name"]
      } (${this.data["Rarity Folder"]})`;
    }
  }
  customElements.define("tcg-card", Card);
}

function addAnimation(e) {
  // animation optimization: inform browser that we are changing the following properties
  e.target.style.willChange = "transform, filter, opacity, background-position";
  // apply the animated class to start the CSS animation
  e.target.classList.add("animated");
}
function updateZIndex(e) {
  e.target.style.zIndex = card_z_index;
  // we don't want this to update again when reanimating later
  e.target.removeEventListener("animationstart", updateZIndex);
}
function setupHover() {
  // setup the initial event listeners for all cards
  let cardList = document.getElementsByClassName("card-image");
  for (let i = 0; i < cardList.length; i++) {
    cardList[i].addEventListener("animationend", function () {
      cardList[i].classList.remove("animated");
      cardList[i].style.willChange = "auto";
    });
    cardList[i].addEventListener("mouseover", addAnimation);
    cardList[i].addEventListener("click", addAnimation);
  }
}
export function updateGachaView(e) {
  gacha_display_selection = e.target.value;
  if (gacha_display_selection == "gacha-grid") {
    // make this a grid
    GACHA_SECTION.classList.add("grid-display");
    GACHA_SECTION.classList.remove("pile-display");
    // we want all cards to be clickable now
    removeUnclickableFromCards();
    // hide visually since flipped cards will have subtitle below them
    document
      .getElementById("pull-announcement")
      .classList.add("visually-hidden");
    // only show subtitle on flipped cards
    Array.from(document.getElementsByClassName("clicked")).forEach(
      (element) => {
        element
          .getElementsByClassName("card-subtitle")[0]
          .classList.remove("hidden");
      }
    );
  } else {
    // make this a pile
    GACHA_SECTION.classList.remove("grid-display");
    GACHA_SECTION.classList.add("pile-display");
    // we want lower cards to be unclickable
    addUnclickableToCardsExceptLast();
    Array.from(document.getElementsByClassName("card-subtitle")).forEach(
      (element) => {
        element.classList.add("hidden");
      }
    );
    // show pull announcement text visually since cards will not have subtitles below them
    document
      .getElementById("pull-announcement")
      .classList.remove("visually-hidden");
  }
}
export function removeUnclickableFromCards() {
  // remove any unclickable classes from all the opened cards, so all can be interacted with
  // this is only used when changing the card from a grid to a pile layout
  let clickedCard = document.getElementsByClassName("opened");
  for (let i = 0; i < clickedCard.length; i++) {
    clickedCard[i].classList.remove("unclickable");
    clickedCard[i].parentElement.removeAttribute("tabindex");
    clickedCard[i].parentElement.removeAttribute("aria-hidden");
  }
}
export function addUnclickableToCardsExceptLast() {
  // check the current format is not grid
  if (gacha_display_selection !== "gacha-grid") {
    // this is the parent card container
    let allFlippedCards = document.getElementsByClassName("clicked");
    // this is the specific child the animation is applied to
    let clickedCard = document.getElementsByClassName("opened");
    // apply this to all the clicked cards, except the one with the z-index matching the current recorded z-index value
    for (let i = 0; i < allFlippedCards.length; i++) {
      let z = window.getComputedStyle(allFlippedCards[i]).zIndex;
      // the card with the matching z-index is the most recently flipped card at the top of the pile - this should still animate so won't have the unclickable class
      // while the unmatching ones are beneath the most recently flipped card, so should have any unclickable class removed
      if (parseInt(z) !== card_z_index) {
        clickedCard[i].classList.add("unclickable");
        clickedCard[i].parentElement.tabIndex = "-1";
        clickedCard[i].parentElement.setAttribute("aria-hidden", "true");
      } else {
        clickedCard[i].classList.remove("unclickable");
      }
    }
  }
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
  // reset the z-index to the highest on the closed pile
  card_z_index = HIGHEST_Z_INDEX;
  // setup hover for all cards
  setupHover();
}

export function setCardRarity(folder) {
  let rarity;
  switch (folder) {
    case "HoloRare":
      rarity = "holo";
      break;
    case "UltraRare":
      rarity = "ultra";
      break;
    case "SecretRare":
      rarity = "secret";
      break;
    default:
      rarity = "basic";
      break;
  }
  return rarity;
}
