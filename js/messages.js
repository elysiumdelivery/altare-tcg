const MESSAGES_CSV = "../contributor_data.csv";
const CREDITS_CSV = "../credits_data.csv";
const pathname = window.location.pathname;
const CURRENT_PAGE = pathname.slice(pathname.lastIndexOf("/"), pathname.length);

function getCSVData(page, callback = undefined) {
  let filename;
  switch (page) {
    case "/contributor-board.html":
      filename = MESSAGES_CSV;
      break;
    case "/credits.html":
      filename = CREDITS_CSV;
      break;
  }

  if (filename) {
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
  let creditsContainer = document.getElementById("credits");
  let roleMapping = [[]];
  let roleElements = [];
  const artworkMap = getArtworkMap();
  credits_data.forEach((credit, i) => {
    if (i === 0 || !credit["Role"]) {
      let creditsColumn = document.createElement("ul");
      creditsColumn.classList.add("credits-column");
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
      let creditListing = document.createElement("li");
      let creditName = document.createElement("h2");
      let creditRole = document.createElement("p");
      creditName.textContent = credit["Staff name"];
      creditListing.append(creditName);
      if (credit["Twitter"]) {
        let creditTwitterHeader = document.createElement("h3");
        let creditTwitter = document.createElement("a");
        creditTwitter.href = `https://twitter.com/${credit["Twitter"]}`;
        creditTwitter.textContent = credit["Twitter"];
        creditTwitterHeader.append(creditTwitter);
        creditListing.append(creditTwitterHeader);
      }
      creditRole.textContent = credit["Role"];
      creditListing.append(creditRole);
      roleColumn.append(creditListing);

      if (credit["Role"].includes("Twitter Illustrator")) {
        const artworks = artworkMap[credit["Staff name"]];
        const artContainer = document.createElement("div");
        artworks.forEach((artwork) => {
          const img = document.createElement("img");
          img.src = artwork.path;
          img.alt = artwork.alt;
          img.className = "credits-page-artwork";
          artContainer.append(img);
        });
        creditListing.append(artContainer);
      }
    });
  }
}

function getArtworkMap() {
  return {
    K: [
      {
        path: "../images/Twitter Images/K-01.jpg",
        alt: "",
      },
      {
        path: "../images/Twitter Images/K-02.jpg",
        alt: "",
      },
      {
        path: "../images/Twitter Images/K-03.jpg",
        alt: "",
      },
      {
        path: "../images/Twitter Images/K-04.jpg",
        alt: "",
      },
    ],
    Minjastars: [
      {
        path: "../images/Twitter Images/minji-01.png",
        alt: "",
      },
      {
        path: "../images/Twitter Images/minji-02.png",
        alt: "",
      },
      {
        path: "../images/Twitter Images/minji-03.png",
        alt: "",
      },
      {
        path: "../images/Twitter Images/minji-04.png",
        alt: "",
      },
    ],
    Mowo: [
      {
        path: "../images/Twitter Images/mowo-01.png",
        alt: "",
      },
      {
        path: "../images/Twitter Images/mowo-02.png",
        alt: "",
      },
      {
        path: "../images/Twitter Images/mowo-03.png",
        alt: "",
      },
      {
        path: "../images/Twitter Images/mowo-04.png",
        alt: "",
      },
      {
        path: "../images/Twitter Images/mowo-05.png",
        alt: "",
      },
      {
        path: "../images/Twitter Images/mowo-06.png",
        alt: "",
      },
      {
        path: "../images/Twitter Images/mowo-07.png",
        alt: "",
      },
    ],
    newmoniks: [
      {
        path: "../images/Twitter Images/newmoniks-01.png",
        alt: "",
      },
    ],
    Nui: [
      {
        path: "../images/Twitter Images/nui-01.png",
        alt: "",
      },
      {
        path: "../images/Twitter Images/nui-02.png",
        alt: "",
      },
      {
        path: "../images/Twitter Images/nui-03.png",
        alt: "",
      },
      {
        path: "../images/Twitter Images/nui-04.png",
        alt: "",
      },
      {
        path: "../images/Twitter Images/nui-05.png",
        alt: "",
      },
      {
        path: "../images/Twitter Images/nui-06.png",
        alt: "",
      },
    ],
    Tear: [
      {
        path: "../images/Twitter Images/tear-01.png",
        alt: "",
      },
      {
        path: "../images/Twitter Images/tear-02.png",
        alt: "",
      },
    ],
    yukinayee: [
      {
        path: "../images/Twitter Images/yukinayee-01.png",
        alt: "",
      },
      {
        path: "../images/Twitter Images/yukinayee-02.png",
        alt: "",
      },
      {
        path: "../images/Twitter Images/yukinayee-03.png",
        alt: "",
      },
      {
        path: "../images/Twitter Images/yukinayee-04.png",
        alt: "",
      },
      {
        path: "../images/Twitter Images/yukinayee-05.png",
        alt: "",
      },
      {
        path: "../images/Twitter Images/yukinayee-05.jpg",
        alt: "",
      },
      {
        path: "../images/Twitter Images/yukinayee-06.jpg",
        alt: "",
      },
      {
        path: "../images/Twitter Images/yukinayee-07.png",
        alt: "",
      },
      {
        path: "../images/Twitter Images/yukinayee-07.jpg",
        alt: "",
      },
      {
        path: "../images/Twitter Images/yukinayee-08.png",
        alt: "",
      },
    ],
  };
}

async function main() {
  getCSVData(CURRENT_PAGE, async (csv_data) => {
    switch (CURRENT_PAGE) {
      case "/contributor-board.html":
        renderMessages(csv_data);
        break;
      case "/credits.html":
        renderCredits(csv_data);
        break;
    }
  });
}

main();
