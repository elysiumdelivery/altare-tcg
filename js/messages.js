const MESSAGES_CSV = "../contributor_data.csv";
const CREDITS_CSV = "../credits_data.csv";
const TWITTER_ART_CREDITS_CSV = "../twitter_art_data.csv";
const pathname = window.location.pathname;
const CURRENT_PAGE = pathname.slice(pathname.lastIndexOf("/"), pathname.length);

function getCSVData(filename, callback = undefined) {
  Papa.parse(filename, {
    download: true,
    //To treat the first row as column titles
    header: true,
    complete: (result) => {
      if (callback) {
        callback(result.data);
      }
    },
  });
}

function renderMessages(message_data) {
  let messageContainer = document.getElementById("artist-writer-messages");
  for (var i = 0; i < message_data.length; i++) {
    let message = message_data[i];
    let messageNode = document.createElement("li");
    messageNode.classList.add("artist-writer-message");
    let messageUserHeader = document.createElement("h2");
    let messageUserInfo = document.createElement("h3");
    let messageUserMessage = document.createElement("p");

    messageUserHeader.innerText = message["Participant Name"];
    if (message["Twitter"]) {
      let userSocial = document.createElement("a");
      userSocial.href = `https://twitter.com/${message["Twitter"]}`;
      userSocial.setAttribute('target', '_blank');
      userSocial.textContent = message["Twitter"];
      messageUserInfo.append(userSocial);
    }
    messageUserMessage.innerText = message["Birthday Message"];

    messageNode.appendChild(messageUserHeader);
    messageNode.appendChild(messageUserInfo);
    messageNode.appendChild(messageUserMessage);

    messageContainer.appendChild(messageNode);
  }
}

function renderCredits(credits_data) {
  // these are the sections in order of display (as per the CSS)
  let creditsHeaders = ["General / Management", "Website Development", "Accessibility", "Twitter Illustrators"];
  // remainder of the normal code
  let creditsContainer = document.getElementById("credits");
  let roleMapping = [[]];
  let roleElements = [];
  credits_data.forEach((credit, i) => {
    if (i === 0 || !credit["Role"]) {
      let creditsColumn = document.createElement("section");
      creditsColumn.classList.add("credits-column");
      creditsColumn.id = "credits-role-id-" + roleElements.length;
      let creditHeader = document.createElement("h2");
      creditHeader.textContent = creditsHeaders[roleElements.length];
      creditsColumn.append(creditHeader);
      roleMapping.push([]);
      roleElements.push(creditsColumn);
      creditsContainer.append(creditsColumn);
    }
    if (i === 0 || credit["Role"]) {
      roleMapping[roleElements.length - 1].push(credit);
    }
  });

  for (var i = 0; i < roleElements.length; i++) {
    let roleColumn = roleElements[i];
    let staffList = roleMapping[i];

    staffList.forEach((credit) => {
      let creditListingWrapper = document.createElement("ul");
      let creditListing = document.createElement("li");
      let creditName = document.createElement("h3");
      let creditRole = document.createElement("p");
      creditName.textContent = credit["Staff name"];
      creditListing.append(creditName);
      if (credit["Twitter"]) {
        let creditTwitterHeader = document.createElement("h4");
        let creditTwitter = document.createElement("a");
        creditTwitter.href = `https://twitter.com/${credit["Twitter"]}`;
        creditTwitter.setAttribute('target', '_blank');
        creditTwitter.textContent = credit["Twitter"];
        creditTwitterHeader.append(creditTwitter);
        creditListing.append(creditTwitterHeader);
      }
      creditRole.textContent = credit["Role"];
      creditListing.append(creditRole);
      creditListingWrapper.append(creditListing);
      roleColumn.append(creditListingWrapper);
    });
  }
}

function renderTwitterArtCredits(twitter_art_data) {
  let creditsContainer = document.getElementById("credits");
  // Create new "section"
  let creditsColumn = document.createElement("section");
  creditsColumn.classList.add("credits-column");
  creditsColumn.id = "twitter-images";
  let twitterImagesHeader = document.createElement("h2");
  twitterImagesHeader.textContent = "Twitter Images";
  creditsColumn.append(twitterImagesHeader);
  const artList = document.createElement("ul");

  twitter_art_data.forEach((artData) => {
    const artContainer = document.createElement("li");
    const img = document.createElement("img");
    img.src = `../images/Twitter Images/${artData["Artwork"]}`;
    img.alt = artData["Alt"];
    artContainer.append(img);
    if (artData["Twitter"]) {
      let creditTwitter = document.createElement("a");
      creditTwitter.href = `https://twitter.com/${artData["Twitter"]}`;
      creditTwitter.setAttribute('target', '_blank');
      creditTwitter.textContent = artData["Staff name"];
      artContainer.append(creditTwitter);
    }
    artList.append(artContainer);
  });
  creditsColumn.append(artList);
  creditsContainer.append(creditsColumn);
}

async function main() {
  switch (CURRENT_PAGE) {
    case "/contributor-board.html":
      getCSVData(MESSAGES_CSV, renderMessages);
      break;
    case "/credits.html":
      getCSVData(CREDITS_CSV, renderCredits);
      getCSVData(TWITTER_ART_CREDITS_CSV, renderTwitterArtCredits);
      break;
  }
}

main();
