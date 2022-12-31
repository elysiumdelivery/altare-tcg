//Happy Birthday Leader! 🎇💙
import { defineCardComponent, renderCards } from "./cards.js";
import { setupDetailsDialog } from "./dialog.js";
import { GACHA_BUTTON, pullAndRenderCards } from "./gacha.js";

const CSV_FILENAME = "../Test Card List CSV.csv";
const pathname = window.location.pathname;
const CURRENT_PAGE = pathname.slice(pathname.lastIndexOf("/"), pathname.length);
const PAGES_WHERE_CARD_HIDDEN = ["/gacha.html"];
const COLLECTIONS_MAIN_CONTENT = document.getElementById("card-list");

export const CARD_ART_HIDDEN_ON_LOAD =
  PAGES_WHERE_CARD_HIDDEN.includes(CURRENT_PAGE);
//Holds the data of all cards after parsing the CSV file.

export let cards_data = [];
export let cards_by_rarity = {};

function getCSVData(callback = undefined) {
  Papa.parse(CSV_FILENAME, {
    download: true,
    //To treat the first row as column titles
    header: true,
    complete: (result) => {
      cards_data = result.data;
      getCardsByRarity();
      if (callback) {
        callback(cards_data);
      }
    },
  });
}

//Classifies all cards based on their rarity and saves them
//in groups inside cards_by_rarity with the following format:
//{
//  rarity1: [{"Rarity Folder": rarity1, "Filename": "Name of Card", ...}, card2, card3, ..., cardN],
//  rarity2: [...],
//  rarity3: [...],
//  ...
//  rarityN: [...]
// }
function getCardsByRarity() {
  cards_by_rarity = cards_data.reduce((result, card) => {
    result[card["Rarity Folder"]] = [
      ...(result[card["Rarity Folder"]] || []),
      card,
    ];
    return result;
  }, {});
}

function renderMessages () {
  let messageContainer = document.getElementById("artist-writer-board");
  for (var i = 1; i < 100; i++) {
    let messageNode = document.createElement("article");
    messageNode.ariaPosInSet = i;
    messageNode.ariaSetSize = 100;
    messageNode.tabIndex = 0;
    messageNode.classList.add("artist-writer-message");
    messageNode.innerHTML = `
      <h4>user_name_${i}</h4>
      <h5>user_social_${i}</h5>
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Tellus cras adipiscing enim eu turpis egestas. Blandit massa enim nec dui nunc mattis enim ut tellus. Cursus euismod quis viverra nibh cras. Porttitor massa id neque aliquam vestibulum morbi blandit cursus.</p>
    `;
    messageContainer.appendChild(messageNode);
  }
}

async function main() {
  await defineCardComponent();
  getCSVData(async (cards_data) => {
    switch (CURRENT_PAGE) {
      case "/gacha.html":
        GACHA_BUTTON.onclick = (event) =>
          pullAndRenderCards(cards_data, COLLECTIONS_MAIN_CONTENT);
        await setupDetailsDialog();
        break;

      case "/collection.html":
        await setupDetailsDialog();
        renderCards(cards_data, COLLECTIONS_MAIN_CONTENT);
        break;
      case "/artist-writer-board.html":
        renderMessages();
        break;
    }
  });
}

main();
