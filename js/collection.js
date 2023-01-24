import { renderCards } from "./cards.js";

const RARITIES = [
  "Element",
  "Common",
  "Uncommon",
  "Rare",
  "HoloRare",
  "UltraRare",
  "SecretRare",
];
const PAGINATION_BTNS = {
  container: document.getElementById("collection-pagination"),
  previous: document.getElementById("pagination-previous"),
  current: document.getElementById("pagination-current"),
  next: document.getElementById("pagination-next"),
};
const COLLECTED_CARDS_NUMBER = document.getElementById(
  "collected-cards-number"
);

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
//Fields used by the search bar to look for the query.
const search_fields = [
  "Collector Number",
  "Card Display Name",
  "Artist Credit",
  "Writer Credit",
];

function getOwnedCards(cards_data) {
  let ownedCards = [];
  for (let item in localStorage) {
    if (item.slice(0, 4) === "card") {
      let card_id = item.split("-")[1];
      if (card_id === "000") {
        card_id = `000-${item.split("-")[2]}`;
      }
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

function sortAndFilterCards(cards_data, sort, reverse, fullCollection) {
  if (fullCollection) {
    return sortCards(cards_data, sort, reverse);
  } else {
    let cards = getOwnedCards(cards_data);
    if (cards.length == 0) {
      return null;
    } else {
      return sortCards(cards, sort, reverse);
    }
  }
}

//The hide parameter is boolean, so you can call it with an expression to use the function
//in the same way you would use an if statement.
function showOrHidePaginationControl(control, onclick, hide = false) {
  if (hide) {
    control.classList.add("invisible");
  } else {
    control.classList.remove("invisible");
    control.onclick = onclick;
  }
}

//Searches for the specified query in the cards array and returns the cards
//that have it in one of the fields declared in search_fields.
function searchCards(cards, query) {
  if (query.trim().length === 0) {
    return cards;
  }
  query = query.trim().toLowerCase();
  return cards.filter((card) =>
    search_fields.some((field) =>
      card[field].toLowerCase().padStart(3, "0").includes(query)
    )
  );
}

//Splits the cards array into many pages, each with a maximum amount of "cards_per_page" cards,
//and returns an array of the card data objects that belong in the specified page parameter.
//Additionally, if the amount of total cards is bigger than cards_per_page,
//wires and shows/hides the pagination controls accordingly.
function paginateCards(cards, cards_per_page, page, navigationFunction) {
  //Note: If cards_per_page is set to "all", this comparison casts it to NaN, and as such it will always return false.
  if (cards.length > cards_per_page) {
    PAGINATION_BTNS.container.classList.remove("hidden");
    PAGINATION_BTNS.current.textContent = `${page} of ${Math.ceil(
      cards.length / cards_per_page
    )}`;
    let lastCard = cards[cards.length - 1]["Collector Number"];

    //This is where we get the cards that belong in the current page.
    cards = cards.slice(cards_per_page * (page - 1), cards_per_page * page);

    showOrHidePaginationControl(
      PAGINATION_BTNS.previous,
      navigationFunction(page - 1),
      page == 1
    );
    showOrHidePaginationControl(
      PAGINATION_BTNS.next,
      navigationFunction(page + 1),
      cards[cards.length - 1]["Collector Number"] === lastCard
    );
    return cards;
  } else {
    //If we don't need pagination, we hide the controls.
    PAGINATION_BTNS.container.classList.add("hidden");
    return cards;
  }
}

export function showCollection(cards_data, htmlLocation, page = 1, query = "") {
  let sort = localStorage.getItem("sort") ?? "Collector Number";
  let cards_per_page = localStorage.getItem("page-size") ?? 10;
  let fullCollection = localStorage.getItem("showFullCollection") === "true";
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

  let cards = sortAndFilterCards(cards_data, sort, reverse, fullCollection);
  if (cards === null) {
    htmlLocation.innerHTML =
      "You have no cards at the moment. Try pulling some at the gacha!";
    PAGINATION_BTNS.container.classList.add("hidden");
    return;
  }

  cards = searchCards(cards, query);
  if (cards.length === 0) {
    htmlLocation.innerHTML = `"${query}" not found.`;
    PAGINATION_BTNS.container.classList.add("hidden");
    return;
  }

  //This is a closure to let us reuse it in many pagination controls.
  //call navigateToPage(targetPage) and attach the result to an onclick method.
  const navigateToPage = (targetPage) => (event) =>
    showCollection(cards_data, htmlLocation, targetPage);

  cards = paginateCards(cards, cards_per_page, page, navigateToPage);

  renderCards(cards, htmlLocation, true, true);
}
