import { renderCards, GACHA_MOTION_SETTING } from "./cards.js";
import { cards_by_rarity } from "./main.js";

// Potentially multiple gacha buttons, so look for all
export const GACHA_BUTTONS = document.getElementsByClassName("gacha-button");

//Card slots on each pull, representing the percent chance of getting a card of that rarity in each slot.
//The sum of all rarities on a slot should be 100 or higher for proper function.
const slots = [
  {
    //1
    Element: 100,
  },

  {
    //2
    Common: 100,
  },
  {
    //3
    Common: 100,
  },
  {
    //4
    Common: 70,
    Uncommon: 30,
  },
  {
    //5
    Common: 50,
    Uncommon: 50,
  },
  {
    //6
    Uncommon: 100,
  },
  {
    //7
    Uncommon: 60,
    Rare: 40,
  },
  {
    //8
    Uncommon: 40,
    Rare: 60,
  },
  {
    //9
    Rare: 45,
    HoloRare: 50,
    UltraRare: 5,
  },
  {
    //10
    Rare: 25,
    HoloRare: 45,
    UltraRare: 25,
    SecretRare: 5,
  },
];

//Slots that replace one or more normal slots on special conditions.
//This can be used to help collect all cards.
const specialSlots = {
  69: {
    HoloRare: 50,
    UltraRare: 35,
    SecretRare: 15,
  },
};

//Pulls a set of cards guided by an array of "slots" passed to the function.
function pullCards(slots) {
  let pullCount = parseInt(localStorage.getItem("pull-count") ?? "0") + 1;
  //let pulledIDs = [];
  let cards = [];
  let card;
  let pulled_cards;
  let special_count = parseInt(localStorage.getItem("special-count") ?? 0);
  for (let slot of slots) {
    let dice = Math.floor(Math.random() * 100) + 1;
    if (dice in specialSlots) {
      special_count = (special_count + 1) % 3;
      localStorage.setItem("special-count", special_count.toString());
      if (special_count == 2) {
        slot = specialSlots[dice];
      }
    }
    //This algorithm divides the range [1, 100] into rarity intervals, dictated by the slots.
    //Example: A slot with the following definition:
    //{Common: 60, Uncommon: 30, Rare: 10}
    //In this case, if the dice value is 60 or less, the pulled card is common.
    //Else, if it's in between 61 and 90, it is uncommon
    //Else, if it's 91 or higher, it is rare.
    //This applies to as many rarities as declared in the slot.
    for (let rarity in slot) {
      if (dice <= slot[rarity]) {
        pulled_cards = getRandomCards(cards_by_rarity[rarity], 4);
        card = pulled_cards[0];
        //Checks for no repeats in the same pull
        for (let pulled_card in pulled_cards) {
          if (
            !cards.some(
              (card) =>
                card["Collector Number"] ===
                pulled_cards[pulled_card]["Collector Number"]
            )
          ) {
            card = pulled_cards[pulled_card];
            break;
          }
        }
        cards.push(card);
        //pulledIDs.push(card["Collector Number"]);
        //Saves the card's id to localStorage if it's new,, to keep track of owned cards.
        //Also saves the count of owned cards per rarity.
        if (!localStorage.getItem(`card-${card["Collector Number"]}`)) {
          localStorage.setItem(`card-${card["Collector Number"]}`, "true");
          let count =
            localStorage.getItem(`count-${card["Rarity Folder"]}`) ?? "0";
          count = parseInt(count) + 1;
          localStorage.setItem(`count-${card["Rarity Folder"]}`, count);
        }

        break;
      } else {
        //Using this we can save on having to define each interval in absolute terms,
        //doing it in relative terms instead.
        //Example: Instead of writing {Common: [1, 80], Uncommon: [81, 100]},
        //we write {Common: 80, Uncommon: 20}.
        //Then, we check if the dice falls in the first rarity. If it isn't, we "jump"
        //over the entire interval and check on the next one, simplifying comparisons
        //and declarations.
        dice -= slot[rarity];
      }
    }
  }
  //Commenting because we aren't doing anything with this yet... if ever.
  //localStorage.setItem("pull-count", pullCount);
  //localStorage.setItem(`pull-${pullCount}`, JSON.stringify(pulledIDs));
  return cards;
}

function pullCardsManyTimes(slots, times) {
  let pulls = [];
  for (let n = 0; n < times; n++) {
    pulls.push(pullCards(slots));
  }
  return pulls;
}

//Gets n cards from the passed "cards" array using the Fisher-Yates Shuffle.
function getRandomCards(cards, n) {
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

//Pulls cards from the cards_data array and renders them in render_location.
export function pullAndRenderCards(render_location) {
  let pulled = pullCards(slots);
  renderCards(pulled, render_location, true);
  render_location.insertAdjacentHTML(
    "beforeend",
    `<span id="roll-again-prompt" class="visually-hidden">No more cards in this pack.</span>`
  );

  // Add prompt to roll again
  let gachaRollAgain = document.createElement("div");
  gachaRollAgain.id = "gacha-prompt-roll-again";
  gachaRollAgain.className = "gacha-prompt hidden";
  if (GACHA_MOTION_SETTING[0].checked) {
    gachaRollAgain.insertAdjacentHTML(
      "beforeend",
      `<img src="../images/slimenolooptransparent.png" alt="Cultare slime smiling happily"/>`
    );
  } else {
    gachaRollAgain.insertAdjacentHTML(
      "beforeend",
      `<img src="../images/slimelooptransparent.gif" alt="Cultare slime bouncing up and down"/>`
    );
  }

  let gachaRollAgainButton = document.createElement("button");
  gachaRollAgainButton.id = "gacha-button-roll-again";
  gachaRollAgainButton.className = "gacha-button";
  gachaRollAgainButton.type = "button";
  gachaRollAgainButton.textContent = "Roll Again?";
  gachaRollAgainButton.setAttribute(
    "aria-labelledby",
    "roll-again-prompt gacha-button-roll-again"
  );
  gachaRollAgainButton.onclick = (event) =>
    pullAndRenderCards(document.getElementById("card-list"));

  gachaRollAgain.append(gachaRollAgainButton);
  render_location.append(gachaRollAgain);
}

//Debug function to get the average rates for each rarity over a list of pulls.
function calculateRates(pulls) {
  let rates = {};
  let total = 0;
  for (let rarity in cards_by_rarity) {
    rates[rarity] = 0;
  }
  for (let pull of pulls) {
    for (let card of pull) {
      rates[card["Rarity Folder"]]++;
      total++;
    }
  }
  for (let rarity in cards_by_rarity) {
    rates[rarity] /= total;
    rates[rarity] *= 100;
  }
  return rates;
}

//If you want to see the current rates, go to your browser console and do:
//const m = await import('../js/gacha.js');
//m.testRates()
export function testRates() {
  let pulls = pullCardsManyTimes(slots, 10000);
  console.log(calculateRates(pulls));
}
