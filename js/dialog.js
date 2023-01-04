export let DETAILS_DIALOG_A11Y = null;
let DETAILS_DIALOG_EL = null;
let first_open = true;

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
    <p>Level: ${data["Card Level"]} | HP: ${data["Card HP"]} |  Element: ${data["Card Element"]} |  Card #: ${data["Collector Number"]}</p>
    <p>Artist: ${data["Artist Credit"]} | Writer: ${data["Writer Credit"]}</p>
  `
  );
  // Card art is applied
  DETAILS_DIALOG_EL.getElementsByClassName("details-dialog-card")[0].style.backgroundImage = 'url("' +
    cardUrl + '")';

  // Add animation start
  DETAILS_DIALOG_EL.getElementsByClassName("details-dialog-card")[0].classList.add(setCardRarity(data["Rarity Folder"]), "animated");
  
  // Animation reset
  DETAILS_DIALOG_EL.getElementsByClassName("card-details-dialog-close")[0].addEventListener("click", resetCardEffects);
  document.getElementsByClassName("dialog-overlay")[0].addEventListener("click", resetCardEffects);

  // animation events
  let dialogCard = DETAILS_DIALOG_EL.getElementsByClassName("details-dialog-card")[0];
  dialogCard.addEventListener("animationend", function() {
    dialogCard.classList.remove("animated");
    if(first_open){
      dialogCard.addEventListener("mouseover", animateCard);
      dialogCard.addEventListener("click", animateCard);
      first_open = false;
    }
  }, false);
  
  // Clear + set card metadata
  DETAILS_DIALOG_EL.getElementsByClassName("details-dialog-text")[0].innerHTML =
    "";
  DETAILS_DIALOG_EL.getElementsByClassName(
    "details-dialog-text"
  )[0].insertAdjacentHTML(
    "beforeend",
    `
    <h3>${data["Attack 1 Name"]}</h3>
    <p>${data["Attack 1 Description"]}</p>
    <p><i>${data["Attack 1 Extended Lore"]}</i></p>
    <h3>${data["Attack 2 Name"]}</h3>
    <p>${data["Attack 2 Description"]}</p>
    <p><i>${data["Attack 2 Extended Lore"]}</i></p>
  `
  );
}

function animateCard(dialogCard){
  DETAILS_DIALOG_EL.getElementsByClassName("details-dialog-card")[0].classList.add("animated");
}
function resetCardEffects(){
  DETAILS_DIALOG_EL.getElementsByClassName("details-dialog-card")[0].classList.remove("holo", "basic", "secret", "rare", "ultra", "animated");
}

export function setCardRarity(folder){
  let rarity;
  switch(folder){
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