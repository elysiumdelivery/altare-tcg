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
    let messageContainer = document.getElementById("artist-writer-board");
    for (var i = 1; i < 100; i++) {
      let messageNode = document.createElement("article");
      // TODO: Dummy data for now. Alternate roles for now as a test. This should be pulled from a csv somewhere.
      let userRole = i % 2 === 0 ? "Artist" : "Writer";
      let userSocial = `user_social_${i}`;
      let h5String = [userRole, userSocial].join(" | ");
      messageNode.ariaPosInSet = i;
      messageNode.ariaSetSize = 100;
      messageNode.tabIndex = 0;
      messageNode.classList.add("artist-writer-message");
      messageNode.innerHTML = `
        <h4>user_name_${i}</h4>
        <h5>${h5String}</h5>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Tellus cras adipiscing enim eu turpis egestas. Blandit massa enim nec dui nunc mattis enim ut tellus. Cursus euismod quis viverra nibh cras. Porttitor massa id neque aliquam vestibulum morbi blandit cursus.</p>
      `;
      messageContainer.appendChild(messageNode);
    }
}

async function main() {
    getCSVData(async (messages_data) => {
        renderMessages();
    });
}
  
main();