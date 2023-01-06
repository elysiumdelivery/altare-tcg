//Happy Birthday Leader! 🎇💙
import { GACHA_VIEW_SETTING, defineCardComponent, updateGachaView } from "./cards.js";
import { setupDetailsDialog } from "./dialog.js";
import { GACHA_BUTTON, pullAndRenderCards } from "./gacha.js";
import { showCollection } from "./collection.js";

const CSV_FILENAME = "../Test Card List CSV.csv";
const pathname = window.location.pathname;
const CURRENT_PAGE = pathname.slice(pathname.lastIndexOf("/"), pathname.length);
const PAGES_WHERE_CARD_HIDDEN = ["/gacha.html"];
const COLLECTIONS_MAIN_CONTENT = document.getElementById("card-list");
const FULL_COLLECTION_TOGGLE = document.getElementById(
  "full-collection-toggle"
);
const RESET_COLLECTION = document.getElementById("reset-collection");
const SORT_DROPDOWN = document.getElementById("sort-dropdown");
const CARDS_PER_PAGE_DROPDOWN = document.getElementById("size-dropdown");

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

//Toggle whether to show the full collection or only owned cards in the collection page.
function toggleCollection(event) {
  let toggle =
    localStorage.getItem("fullCollection") === "true" ? "false" : "true";
  localStorage.setItem("fullCollection", toggle);
  showCollection(cards_data, COLLECTIONS_MAIN_CONTENT);
  FULL_COLLECTION_TOGGLE.textContent =
    toggle === "true" ? "Hide Full Collection" : "Show Full Collection";
}

function setupDropdown(dropdown, storage_key, default_value) {
  dropdown.onchange = (event) => {
    localStorage.setItem(storage_key, event.target.value);
    showCollection(cards_data, COLLECTIONS_MAIN_CONTENT);
  };
  dropdown.value = localStorage.getItem(storage_key) ?? default_value;
}

function setupCollectionControls() {
  FULL_COLLECTION_TOGGLE.onclick = toggleCollection;
  if (localStorage.getItem("fullCollection") === "true") {
    FULL_COLLECTION_TOGGLE.textContent = "Hide Full Collection";
  }
  RESET_COLLECTION.onclick = (event) => {
    localStorage.clear();
    localStorage.setItem("fullCollection", "true");
    localStorage.setItem("sort", SORT_DROPDOWN.value);
    localStorage.setItem("page-size", CARDS_PER_PAGE_DROPDOWN.value);
    toggleCollection();
  };
  setupDropdown(SORT_DROPDOWN, "sort", "Collector Number");
  setupDropdown(CARDS_PER_PAGE_DROPDOWN, "page-size", "10");
}

async function main() {
  await defineCardComponent();
  getCSVData(async (cards_data) => {
    switch (CURRENT_PAGE) {
      case "/gacha.html":
        // watch for any selection changes - either grid or pile card display
        GACHA_VIEW_SETTING[0].addEventListener("change", updateGachaView);
        GACHA_VIEW_SETTING[1].addEventListener("change", updateGachaView);

        // if the window is less than 800, default to a grid layout
        // this checks the box and dispatches a change event
        if(window.innerWidth <= 800){
          const gridInput = document.getElementById("gacha-grid");
          gridInput.checked = true;
          gridInput.dispatchEvent(new Event('change'));
        }
        // Otherwise, default to pile and assign pile-display class by default
        else {
          const pileInput = document.getElementById("gacha-pile");
          pileInput.checked = true;
          pileInput.dispatchEvent(new Event('change'));
        }

        GACHA_BUTTON.onclick = (event) => 
          pullAndRenderCards(cards_data, COLLECTIONS_MAIN_CONTENT);
        break;

      case "/collection.html":
        await setupDetailsDialog();
        showCollection(cards_data, COLLECTIONS_MAIN_CONTENT);
        setupCollectionControls();
    }
  });
}

main();
