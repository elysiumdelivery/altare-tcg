import { cards_data, gacha_display_selection, CARD_ART_HIDDEN_ON_LOAD } from "./main.js";
import { updateDetailsDialog, DETAILS_DIALOG_A11Y, setCardRarity } from "./dialog.js";

const CLOUD_NAME = "dazcxdgiy";
const CLOUDINARY_URL = `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/`;
const COLLECTED_CARDS_NUMBER = document.getElementById(
  "collected-cards-number"
);
const PAGINATION_BTNS = {
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

//Object to store all supported sorting functions.
//These are stored as closures to support reverse order without declaring new functions.
//Can be used by calling:
//array.sort(sort_functions[key](1, -1))
//If you want to reverse order, swap the 1 and -1 when calling the function.
const sort_functions = {
  "Collector Number":
    (before = 1, after = -1) =>
    (a, b) => {
      return parseInt(a["Collector Number"]) > parseInt(b["Collector Number"])
        ? before
        : after;
    },
  Rarity:
    (before = 1, after = -1) =>
    (a, b) => {
      if (a["Rarity Folder"] === b["Rarity Folder"]) {
        return sort_functions["Collector Number"]()(a, b);
      } else {
        return RARITIES.indexOf(a["Rarity Folder"]) <
          RARITIES.indexOf(b["Rarity Folder"])
          ? before
          : after;
      }
    },
};
const HIGHEST_Z_INDEX = 10;
let card_z_index = HIGHEST_Z_INDEX;
let previous_card_front;
export const GACHA_VIEW_SETTING = document.querySelectorAll('input[name="gacha-display"]');
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
      this.back = this.getElementsByClassName("card-back")[0];
      this.info = this.getElementsByClassName("card-info")[0];
      this.image = this.getElementsByClassName("card-image")[0];
      this.image.style.backgroundImage = 'url("' + this.getImageURL() + '")';
      this.image.classList.add(setCardRarity(this.data["Rarity Folder"]));
      this.setupOnClickEvents();
      if (CARD_ART_HIDDEN_ON_LOAD) {
        this.setupCardGacha();
      }
      if (this.getAttribute("show_title") === "true") {
        this.showSubtitle();
      }
    }

    //Returns an url of the form:
    //`https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${RARITY}/${FILENAME}.png`
    getImageURL() {
      return `${CLOUDINARY_URL}/q_auto/${this.data["Rarity Folder"]}/${this.data["Filename"]}.png`;
    }

    setupCardGacha() {
      // Reset the initial z-index back to max pull
      card_z_index = HIGHEST_Z_INDEX;
      // Show the back of the card - unsophisticated style
      // This is automatically hidden for the collections page, so we have to reset it for the gacha
      this.back.classList.remove("hidden");
      // For the gacha page only
      // Prevent the front from being tabbed on, so that you don't need to tab twice per card
      this.front.tabIndex = "-1";
      // Add the event listener to every card
      setupHover();
    }

    flipCard() {
      // update the next value for the zIndex
      card_z_index++;

      // register this as a clicked card, and add the class to animate to flip over
      this.classList.add("clicked");
      this.holder.classList.add("flip");

      // Start the animation and update the z-index when the animation starts
      // This is to stack any opened cards in the reverse order
      this.addEventListener("animationstart", updateZIndex);
      this.image.classList.add("opened");
      this.image.classList.add("animated");

      // remove the previous hover effects only if the gacha is not displayed as a grid
      if(gacha_display_selection !== "gacha-grid"){
        this.addEventListener("animationend", removeHover);
      }
    }

    //Binds the card's onclick events to flip and show the description popup.
    setupOnClickEvents() {
      this.back.onclick = (event) => this.flipCard();
      if(!CARD_ART_HIDDEN_ON_LOAD){
        this.front.onclick = (event) => this.showDetails();
      }
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

function addAnimation(e){
  // apply the animated class to start the CSS animation
  e.target.classList.add("animated");
}
function updateZIndex(e){
    e.target.style.zIndex = card_z_index;
    // we don't want this to update again when reanimating later
    e.target.removeEventListener("animationstart", updateZIndex);
}

function setupHover(){
  // setup the initial event listeners for all cards
  let cardList = document.getElementsByClassName("card-image");
  for (let i = 0; i < cardList.length; i++) {
    cardList[i].addEventListener("animationend", function(){
      cardList[i].classList.remove("animated");
    })
    cardList[i].addEventListener("mouseover", addAnimation);
    cardList[i].addEventListener("click", addAnimation);
  }
}
export function addHover(){
  // remove any unclickable classes from all the opened cards, so all can be interacted with
  let clickedCard = document.getElementsByClassName("opened");
  for (let i = 0; i < clickedCard.length; i++) {
    clickedCard[i].classList.remove("unclickable");
  }
}
export function removeHover(){
  // check the current format is not grid
  if(gacha_display_selection !== "gacha-grid"){

    // this is the parent card container
    let tcgCard = document.getElementsByClassName("clicked");
    // this is the specific child the animation is applied to
    let clickedCard = document.getElementsByClassName("opened");
    // apply this to all the clicked cards, except the one with the z-index matching the current recorded z-index value
    for (let i = 0; i < tcgCard.length; i++) {
      let z = window.getComputedStyle(tcgCard[i]).zIndex;
      // if the z-index of this card matches the last assigned z-index, then remove any unclickable class
      if(parseInt(z) !== card_z_index){
        clickedCard[i].classList.add("unclickable");
      } else {
        clickedCard[i].classList.remove("unclickable");
      }
    }
    
  }
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

function sortCards(cards, sortType, reverse = false) {
  sortType = sortType ?? "Collector Number";
  let before = reverse ? -1 : 1;
  let after = reverse ? 1 : -1;
  cards.sort(sort_functions[sortType](before, after));
  return cards;
}

export function showCollection(cards_data, htmlLocation, page = 1) {
  let sort = localStorage.getItem("sort") ?? "Collector Number";
  let cards_per_page = localStorage.getItem("page-size") ?? 10;
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
    sort = sort.slice(0, -1);
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

  //If we will show more cards than the amount specified in cards_per_page,
  //then we split them into parts and show the pagination controls.
  //Note: If cards_per_page is set to "all", the comparison casts it to NaN, and as such it will always return false.
  if (cards.length > cards_per_page) {
    PAGINATION_BTNS.container.classList.remove("hidden");
    PAGINATION_BTNS.current.textContent = `${page} of ${Math.ceil(
      cards.length / cards_per_page
    )}`;
    let lastCard = cards[cards.length - 1]["Collector Number"];
    cards = cards.slice(cards_per_page * (page - 1), cards_per_page * page);
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
  renderCards(cards, htmlLocation, true, true);
}
