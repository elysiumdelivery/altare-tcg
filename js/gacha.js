import { renderCards } from "./cards.js";

export const GACHA_BUTTON = document.getElementById("gacha-button");
export const CARDS_PER_PULL = 10;

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
export function pullAndRenderCards(cards_data, n, render_location) {
  let pulled = pullCards(cards_data, n);
  renderCards(pulled, render_location, true);
}
