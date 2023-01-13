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


function renderMessages (message_data) {
    let messageContainer = document.getElementById("artist-writer-messages");
    console.log(message_data);
    for (var i = 0; i < message_data.length; i++) {
        let message = message_data[i];
        let messageNode = document.createElement("li");
        // TODO: Dummy data for now. Alternate roles for now as a test. This should be pulled from a csv somewhere.
        //   let userRole = i % 2 === 0 ? "Artist" : "Writer";
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

function renderCredits (credits_data) {
    let creditsContainer = document.getElementById("credits-column");
    credits_data.forEach((credit) => {
        if (credit["Staff name"]) {
            let creditListing = document.createElement("li");
    
            let creditName = document.createElement("h3");
            creditName.textContent = credit["Staff name"];
            creditListing.append(creditName);
            if (credit["Twitter"]) {
                let creditTwitter = document.createElement("a");
                creditTwitter.href = `https://twitter.com/${credit["Twitter"]}`;
                creditTwitter.textContent = credit["Twitter"];
                creditListing.append(creditTwitter);
            }
            let creditRole = document.createElement("p");
            creditRole.textContent = credit["Role"];
            creditListing.append(creditRole);

            creditsContainer.append(creditListing);
        }
    });
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