//Happy Birthday Leader! 🎇💙
import {
  GACHA_VIEW_SETTING,
  GACHA_MOTION_SETTING,
  defineCardComponent,
  updateGachaView,
  updateGachaMotion,
} from "./cards.js";
import { setupDetailsDialog } from "./dialog.js";
import { GACHA_BUTTONS, pullAndRenderCards } from "./gacha.js";
import { showCollection, setupForeword } from "./collection.js";

const CSV_FILENAME = "../Regis Altare Card List CSV.csv";
const pathname = window.location.pathname.replace(".html", "");
const CURRENT_PAGE = pathname.slice(pathname.lastIndexOf("/"), pathname.length);
const PAGES_WHERE_CARD_HIDDEN = ["/gacha"];
const COLLECTIONS_MAIN_CONTENT = document.getElementById("card-list");
const FULL_COLLECTION_TOGGLE = document.getElementById(
  "full-collection-toggle"
);
const RESET_COLLECTION = document.getElementById("reset-collection");
const SORT_DROPDOWN = document.getElementById("sort-dropdown");
const CARDS_PER_PAGE_DROPDOWN = document.getElementById("size-dropdown");
const SEARCH_BAR = document.getElementById("search-bar");

const PULLED_COUNT_NUMBER = document.getElementById("gacha-pull-count");

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
    localStorage.getItem("showFullCollection") === "true" ? "false" : "true";
  localStorage.setItem("showFullCollection", toggle);
  showCollection(cards_data, COLLECTIONS_MAIN_CONTENT);
  FULL_COLLECTION_TOGGLE.textContent =
    toggle === "true" ? "Hide Full Collection" : "Show Full Collection";
}

function setupDropdown(dropdown, storageKey, defaultValue) {
  dropdown.onchange = (event) => {
    localStorage.setItem(storageKey, event.target.value);
    showCollection(cards_data, COLLECTIONS_MAIN_CONTENT);
  };
  dropdown.value = localStorage.getItem(storageKey) ?? defaultValue;
}

function setupCollectionControls() {
  FULL_COLLECTION_TOGGLE.onclick = toggleCollection;
  if (localStorage.getItem("showFullCollection") === "true") {
    FULL_COLLECTION_TOGGLE.textContent = "Hide Full Collection";
  }
  RESET_COLLECTION.onclick = (event) => {
    var confirmReset = window.confirm("Do you want to clear your entire collection?\nSelect OK to clear now, or Cancel to stop.\nIf using a keyboard: use Enter to clear now, or Esc to stop.");
    if(confirmReset){
      localStorage.clear();
      localStorage.setItem("showFullCollection", "true");
      localStorage.setItem("sort", SORT_DROPDOWN.value);
      localStorage.setItem("page-size", CARDS_PER_PAGE_DROPDOWN.value);
      toggleCollection();
    }
  };

  SEARCH_BAR.onchange = (event) =>
    showCollection(cards_data, COLLECTIONS_MAIN_CONTENT, 1, event.target.value);

  setupDropdown(SORT_DROPDOWN, "sort", "Collector Number");
  setupDropdown(CARDS_PER_PAGE_DROPDOWN, "page-size", "10");
}

async function main() {
  await defineCardComponent();
  getCSVData(async (cards_data) => {
    switch (CURRENT_PAGE) {
      case "/gacha":
        // watch for any selection changes - either grid or pile card display
        GACHA_VIEW_SETTING[0].addEventListener("change", updateGachaView);
        GACHA_VIEW_SETTING[1].addEventListener("change", updateGachaView);
        GACHA_MOTION_SETTING[0].addEventListener("change", updateGachaMotion);
        // Check pull count
        var totalPulls = localStorage.getItem("pull-count") ?? 0;
        PULLED_COUNT_NUMBER.textContent = `Total pulls: ${totalPulls}`;
        // if the window is less than 800, default to a grid layout
        // this checks the box and dispatches a change event
        if (window.innerWidth <= 800) {
          const gridInput = document.getElementById("gacha-grid");
          gridInput.checked = true;
          gridInput.dispatchEvent(new Event("change"));
        }
        // Otherwise, default to pile and assign pile-display class by default
        else {
          const pileInput = document.getElementById("gacha-pile");
          pileInput.checked = true;
          pileInput.dispatchEvent(new Event("change"));
        }

        for (var i = 0; i < GACHA_BUTTONS.length; i++) {
          GACHA_BUTTONS.item(i).onclick = (event) => {
            document.getElementById("card-list").classList.add("gacha-drawn");
            pullAndRenderCards(COLLECTIONS_MAIN_CONTENT);
          };
        }
        break;

      case "/collection":
        var totalPulls = localStorage.getItem("pull-count") ?? 0;
        PULLED_COUNT_NUMBER.textContent = `Total pulls: ${totalPulls}`;
        setupCollectionControls();
        await setupDetailsDialog();
        showCollection(cards_data, COLLECTIONS_MAIN_CONTENT);
        // check if we need to show the foreword/disclaimer when page loads
        setupForeword();
    }
  });
}

main();
