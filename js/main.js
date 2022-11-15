//Happy Birthday Leader! 🎇💙

const card_list = document.getElementById("card-list");
const CLOUD_NAME = "dazcxdgiy";
const CLOUDINARY_URL = `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/`;

//Custom Card component. Use it like this:
//<tcg-card card-id="[CARD_ID]"></tcg-card>
class Card extends HTMLElement {
  constructor() {
    super();
    const image = document.createElement("img");
    image.src = this.getImageURL();
    image.classList.add("card-image");
    this.appendChild(image);
  }

  //This returns an url of the form:
  //`https://res.cloudinary.com/${CLOUD_NAME}/image/upload/cld-sample-${CARD_ID}`
  //if "card-id" isn't supplied it returns a F L O W E R 🌸 sample image url.
  getImageURL() {
    return `${CLOUDINARY_URL}${
      this.hasAttribute("card-id")
        ? `cld-sample-${this.getAttribute("card-id")}`
        : "sample.jpg"
    }`;
  }
}

//Renders some sample images from Cloudinary's sample folder using our Card component.
function renderImages() {
  for (let i = 2; i <= 5; i++) {
    card_list.insertAdjacentHTML(
      "beforeend",
      `<tcg-card card-id="${i}"></tcg-card>`
    );
  }
}

function main() {
  customElements.define("tcg-card", Card);
  renderImages();
}

main();
