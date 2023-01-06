# altare-tcg

Regis Altare themed booster pack opening simulator so you can try your luck in pulling fan-created cards!

# Get started

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
