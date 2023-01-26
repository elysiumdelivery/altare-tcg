import { setCardRarity } from "./cards.js";

export let DETAILS_DIALOG_A11Y = null;
let DETAILS_DIALOG_EL = null;

export async function setupDetailsDialog() {
  // Don't make another dialog container if a previous page already set it up
  if (document.getElementById("card-details-dialog")) {
    return;
  }
  let html = await fetch("../details-dialog.html");
  html = await html.text();
  document.body.insertAdjacentHTML("beforeend", html);
  DETAILS_DIALOG_EL = document.getElementById("card-details-dialog");
  // A11yDialog handles toggling accessibility properties when the dialog shows/ hides,
  // as well as closing on esc, clicking outside of the dialog, etc.
  DETAILS_DIALOG_A11Y = new A11yDialog(document.getElementById("card-details"));

  // animation events
  let dialogCard = DETAILS_DIALOG_EL.getElementsByClassName(
    "details-dialog-card"
  )[0];
  dialogCard.addEventListener(
    "animationend",
    function () {
      dialogCard.classList.remove("animated", "unclickable");
      dialogCard.style.willChange = "auto";
    },
    false
  );
  dialogCard.addEventListener("mouseover", animateCard);
  dialogCard.addEventListener("click", animateCard);

  // animation reset
  DETAILS_DIALOG_A11Y.on("hide", function (element, event) {
    resetCardEffects();
  });
}

//Receives a traits object like this:
//{
//  Type: "Attack",
//  Cost: "Game 1, AU 1",
//  Damage: 090
// }
//returns them as a "|" separated string inside a <p> element.
//You can define any key as long as it is a string:
// {
//   "<b>Custom Trait</b>": "Custom value"
// }
function attackTraitsHTML(traits) {
  if (Object.values(traits).some((value) => !value)) {
    return "";
  }

  const htmlList = [];
  for (const [trait, value] of Object.entries(traits)) {
    htmlList.push(`${trait}: ${value}`);
  }

  return `<p>${htmlList.filter((item) => Boolean(item)).join(" | ")}</p>`;
}

export function updateDetailsDialog(data, cardUrl) {
  // Header
  DETAILS_DIALOG_EL.getElementsByClassName("dialog-title")[0].innerHTML = "";
  DETAILS_DIALOG_EL.getElementsByClassName(
    "dialog-title"
  )[0].insertAdjacentHTML(
    "beforeend",
    `
    <h2 class="card-name">${data["Card Display Name"]}</h2>
    <p>${data["Card Level"] ? `Level: ${data["Card Level"]} | ` : ""}${
      data["Card HP"] ? `HP: ${data["Card HP"]} |  ` : ""
    }${
      data["Card Element"] ? `Element: ${data["Card Element"]} |  ` : ""
    }Card #: ${data["Collector Number"]}</p>
    <p>Artist: ${data["Artist Credit"]} | Writer: ${data["Writer Credit"]}</p>
  `
  );

  const card_art = DETAILS_DIALOG_EL.getElementsByClassName(
    "details-dialog-card"
  )[0];
  // Card art is applied
  card_art.style.backgroundImage = 'url("' + cardUrl + '")';
  // Add animation start
  card_art.classList.add(setCardRarity(data["Rarity Folder"]), "animated");

  // Clear + set card metadata
  DETAILS_DIALOG_EL.getElementsByClassName("details-dialog-text")[0].innerHTML =
    "";
  let detailsHTML = `<p><b>Image description: </b>${data["Card Image Alt Text Description"]}</p>`;
  if (data["Item Description"]) {
    // Item card without attacks
    detailsHTML += `
      <h3>Item Description</h3>
      <p>${data["Item Description"]}</p>
      <h4>Extended Lore</h4>
      <p>${data["Item Extended Lore"]}</p>`;
  } else {
    detailsHTML += `
      ${
        data["Attack 1 Name"]
          ? `
        <h3>${data["Attack 1 Name"]}</h3>
        ${attackTraitsHTML({
          Type: data["Attack 1 Type"],
          Cost: data["Attack 1 Element Cost"],
          Damage: data["Attack 1 Damage"],
        })}
        <p>${data["Attack 1 Description"]}</p>
        `
          : ""
      }
      ${
        data["Attack 1 Extended Lore"]
          ? ` <h4>Extended Lore</h4>
              <p>${data["Attack 1 Extended Lore"]}</p>`
          : ""
      }

      ${
        data["Attack 2 Name"]
          ? `
        <h3>${data["Attack 2 Name"]}</h3>
        ${attackTraitsHTML({
          Type: data["Attack 2 Type"],
          Cost: data["Attack 2 Element Cost"],
          Damage: data["Attack 2 Damage"],
        })}
        <p>${data["Attack 2 Description"]}</p>
        `
          : ""
      }
      ${
        data["Attack 2 Extended Lore"]
          ? `<h4>Extended Lore</h4>
              <p>${data["Attack 2 Extended Lore"]}</p>`
          : ""
      }
  `;
  }
  DETAILS_DIALOG_EL.getElementsByClassName(
    "details-dialog-text"
  )[0].insertAdjacentHTML("beforeend", detailsHTML);
}

function animateCard(dialogCard) {
  DETAILS_DIALOG_EL.getElementsByClassName(
    "details-dialog-card"
  )[0].style.willChange = "transform, filter, opacity, background-position";
  DETAILS_DIALOG_EL.getElementsByClassName(
    "details-dialog-card"
  )[0].classList.add("animated", "unclickable");
}
function resetCardEffects() {
  DETAILS_DIALOG_EL.getElementsByClassName(
    "details-dialog-card"
  )[0].style.willChange = "auto";
  DETAILS_DIALOG_EL.getElementsByClassName(
    "details-dialog-card"
  )[0].classList.remove(
    "holo",
    "basic",
    "secret",
    "rare",
    "ultra",
    "animated",
    "unclickable"
  );
}
