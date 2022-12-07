//Happy Birthday Leader! 🎇💙

const CARD_LIST = document.getElementById("card-list");
const GACHA_BUTTON = document.getElementById("gacha-button");
const CLOUD_NAME = "dazcxdgiy";
const CLOUDINARY_URL = `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/`;
const CSV_FILENAME = "../Test Card List CSV.csv";
const CARDS_PER_PULL = 10;
let pathname = window.location.pathname;
const CURRENT_PAGE = pathname.slice(pathname.lastIndexOf("/"), pathname.length);

//Holds the data of all cards after parsing the CSV file.
let cards_data = [];

//Custom Card component. Use it like this:
//<tcg-card card-id="[COLLECTOR_NUMBER]"></tcg-card>
async function defineCardComponent() {
  let html = await fetch("../card.html");
  html = await html.text();

  class Card extends HTMLElement {
    data = {};

    constructor() {
      super();
      this.data = cards_data.find(
        (card) => card["Collector Number"] == this.getAttribute("card-id")
      );
      this.innerHTML = html;
      const image = this.getElementsByClassName("card-image")[0];
      image.src = this.getImageURL();
    }

    //Returns an url of the form:
    //`https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${RARITY}/${FILENAME}.png`
    getImageURL() {
      return `${CLOUDINARY_URL}${this.data["Rarity Folder"]}/${this.data["Filename"]}.png`;
    }
  }
  customElements.define("tcg-card", Card);
}

function getCSV() {
  Papa.parse(CSV_FILENAME, {
    download: true,
    //To treat the first row as column titles
    header: true,
    complete: (result) => {
      cards_data = result.data;
      if (CURRENT_PAGE == "/index.html") {
        renderCards(cards_data, CARD_LIST);
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
function pullGacha(n) {
  let pulled = pullCards(cards_data, n);
  renderCards(pulled, CARD_LIST, true);
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

async function main() {
  await defineCardComponent();
  getCSV();
  if (CURRENT_PAGE == "/gacha.html") {
    GACHA_BUTTON.onclick = (event) => pullGacha(CARDS_PER_PULL);
  }
}

main();
