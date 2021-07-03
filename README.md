<p align="center">
  <a href="https://argoapp.live/">
    <a href="https://imgur.com/J5O9d2O"><img src="https://i.imgur.com/J5O9d2O.png" title="source: imgur.com" alt="ArGo logo (light version)" width="210" /></a>
  </a>

  <h3 align="center">ArGo Api</h3>

  <p align="center">
   🛠️ The API for ArGo.
 </p>
</p>

> Important Notice: ArGo is in its Alpha stage. If you have a suggestion, idea, or find a bug, please report it! The ArGo team will not be held accountable for any funds lost.

## About ArGo
ArGo is a simple & powerful platform to deploy your frontend app to Decentralised Cloud Protocol.

## Installation for argo-api development
Follow below steps to run ARGO API in your local

> Note: Our current latest stable branch is dev. After clone make sure to checkout to dev branch

 - Clone argo-api code into your local by using `git clone https://github.com/argoapp-live/argo-api.git`
 - Once clone do branch checkout to dev `git checkout dev`
 - Install packages using either yarn or npm from root folder `yarn` or `npm install`
 - Run `yarn dev` or `npm dev`
 - It will start your server at port specified in `.env` file
`Note: you can ping us on discord and we will be happy to share our .env file with you`
 
 ## Installation for UI development
 Follow below steps to start api using docker solution
 
 - Make sure your system has docker engine setup
 - Clone argo-api code into your local by using `git clone https://github.com/argoapp-live/argo-api.git`
 - Replace env values into docker file and use your git hub auth app client id, secrets and mongo db url
 - Now open terminal from root folder and run `docker build -t argo_api .`
 - After build run image `docker run -p 8080:8080 argo_api` It will start argo-api in attach mode

For any queries DM us on our discord channel [ARGO](https://discord.gg/4y6fgG3)
