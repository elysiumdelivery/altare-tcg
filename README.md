# altare-tcg

[Regis Altare](https://www.youtube.com/@RegisAltare) themed booster pack opening simulator so you can try your luck in pulling fan-created cards!

🌟 Live at https://altarebday2023.com/

🎬 [Altare showcasing the site on his birthday stream!](http://www.youtube.com/watch?v=42uQ_AvFaFk&t=1475)
[![Altare poking his head over the site window and opening a card pack live on stream. The hyped chat is spamming his custom heart emojis, saying "SO COOL!". Magni Dezmond, another streamer in Altare's guild, comments "wait what in the actual fuck this is insane"](https://user-images.githubusercontent.com/47371080/216844946-ccb15294-fb87-4ee9-b102-48f0f5645d10.png)](http://www.youtube.com/watch?v=42uQ_AvFaFk&t=1475)

## Features
Cards have rarities (Common, Uncommon, Rare, Holo rare, Ultra rare, Secret rare) and animations as inspired by the official Pokemon TCG. Thanks to https://github.com/simeydotme/pokemon-cards-css for the animations!

![A pile of face-down cards flip to the left on click, revealing Uncommon, Rare, and finally an Ultra Rare. The Rare is slightly shinier than the Uncommon, and the Ultra Rare has a rainbow gradient and fine, wavy foil texture.](https://user-images.githubusercontent.com/47371080/216848016-095fd74f-0f94-4b74-8300-cc72cf9dd99e.gif)

Tracks collected cards and total pulls

<img width="800" alt="Collections tab on site showing 33 out of 290 cards pulled, 4 total pulls, and a gallery of the collected cards" src="https://user-images.githubusercontent.com/47371080/216848198-7e6f33b8-a52d-48f2-b7b3-3da75348dbe3.png">

Screenreader and keyboard control compatible, as well as other accessibility features like skip link and disabling animations

https://user-images.githubusercontent.com/47371080/216849149-806e8758-14b8-4ab0-86f3-a8d932f4f37b.mov

Contributor messages, fan messages, and credits pages

<img width="500" alt="Contributor messages page with the header 'Happy Birthday Altare,
from all staff, artists and writers who worked on this project!' with message cards containing birthday wishes" src="https://user-images.githubusercontent.com/47371080/216845694-20d2d251-3d43-4f5e-b301-e18e9f657892.png"> 
<img width="500" alt="Message board page with video embed showing art of Altare's official mascot T-posing and the artist's birthday message. The text above says 'This preview is best viewed on desktop.
To see the messages in full, view the original message wall.'" src="https://user-images.githubusercontent.com/47371080/216845817-e60aed8a-4dae-4c6f-a371-0e258227b990.png"><img width="500" alt="Credits and download page showing 'Download full project PDF' and 'View Accessible Project Format' buttons. Below shows a snippet of the list of General/ Management and Website Development credits." src="https://user-images.githubusercontent.com/47371080/216845917-c3f2bcc7-eb57-4a51-89b6-6e17aa6ace7a.png">

You can pet him!

![Chibi Altare with a cat mouth grin peeking out over the site's main content area. He is swaying back and forth while a hand cusor furiously pets his head. The Home button pokes out at an angle behind him.](https://user-images.githubusercontent.com/47371080/216846048-a080470e-8870-4e42-a56d-b4e62eccd953.gif)


# Contributing

Make a local copy of the repo

`git clone https://github.com/elysiumdelivery/altare-tcg.git`

Inside the created folder, run the following to install dev dependencies.

`npm install`

Make a local branch (you cannot push changes directly to `main`). `<your-branch-name>` can be any name you want.

`git checkout -b <your-branch-name> origin/main`

## Local hot refresh

Because browsers are finnicky about accessing local files if there isn't a web server serving the page, live-server starts a development server and serves from there. Go to the folder you saved the git repo in and run

`live-server`

and the app should be served at `http://localhost:8080`, auto-reloading on each file save.

## Non-coder

You can use the Github UI for simple text changes/ typo fixes:
![image](https://user-images.githubusercontent.com/47371080/201824933-0ae51ae2-bfbe-42fe-8a2b-c04b89665e1e.png)
https://docs.github.com/en/repositories/working-with-files/managing-files/editing-files

To submit your changes for review, please select "Create a new branch... and start a pull request".

# Pull Requests

Push your local branch to Github to create a pull request

`git push -u origin <your-branch-name>`

Your terminal will then prompt you for your credentials. The password will be your personal access token. Here are steps on how to create one: https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token

## Code Review

A code review is not strictly required to merge, but it is encouraged to get feedback from at least one other person on the team before merging.
