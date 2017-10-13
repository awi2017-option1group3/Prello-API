# Prello (API)

Study project attempting to make a Trello clone. 
This is the **API** of the project, see also the **Client** [here](https://github.com/awi2017-option1group3/Prello-Client).

Read the documentation using the Wiki [here](https://github.com/awi2017-option1group3/Prello-API/wiki) !

## Local installation

### Prerequisites

You need the following tools:
- Node (version >= 8)
- NPM
- MongoDB

It's not required, but you can also install the Client (see [here](https://github.com/awi2017-option1group3/Prello-Client)).

### Installation

You need to clone this repository on your computer:

`https://github.com/awi2017-option1group3/Prello-API`

Go to the API folder using:

`cd Prello-API`

Install the node_modules:

`npm install`

Run the API server :

`npm run dev`

### Usage

The API will be available at `localhost:8000`.

## Production deployment (using Heroku) 

### Deployment

On the Heroku website:

1. Create an Heroku app.
2. Using the panel "Resources", link the add-on 'mLab' to your app.
3. Using the panel "Deploy", link the github repository to your app (and enable automatic deploys).
4. Using the panel "Deploy", deploy the master branch (at the end of the page). This action can take a while (generally 1 min).
5. Open the app using the "Open app" top-right button.

### Usage

You can request the API using: `https://{app-name}.herokuapp.com/`.
