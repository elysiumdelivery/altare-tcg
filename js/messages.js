const CSV_FILENAME = "../Test Card List CSV.csv";

function getCSVData(callback = undefined) {
    Papa.parse(CSV_FILENAME, {
      download: true,
      //To treat the first row as column titles
      header: true,
      complete: (result) => {
        if (callback) {
          callback(result);
        }
      },
    });
  }

function renderMessages () {
    let messageContainer = document.getElementById("artist-writer-messages");
    for (var i = 1; i < 100; i++) {
      let messageNode = document.createElement("li");
      // TODO: Dummy data for now. Alternate roles for now as a test. This should be pulled from a csv somewhere.
      let userRole = i % 2 === 0 ? "Artist" : "Writer";
      let userSocial = `user_social_${i}`;
      let h3String = [userRole, userSocial].join(" | ");
      messageNode.classList.add("artist-writer-message");
      let messageUserHeader = document.createElement("h2");
      let messageUserInfo = document.createElement("h3");
      let messageUserMessage = document.createElement("p");
      
      messageUserHeader.innerText = `user_name_${i}`;
      messageUserInfo.innerText = h3String;
      messageUserMessage.innerText = `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Tellus cras adipiscing enim eu turpis egestas. Blandit massa enim nec dui nunc mattis enim ut tellus. Cursus euismod quis viverra nibh cras. Porttitor massa id neque aliquam vestibulum morbi blandit cursus.`;
      
      messageNode.appendChild(messageUserHeader);
      messageNode.appendChild(messageUserInfo);
      messageNode.appendChild(messageUserMessage);
      
      messageContainer.appendChild(messageNode);
    }
}

async function main() {
    getCSVData(async (messages_data) => {
        renderMessages();
    });
}
  
main();