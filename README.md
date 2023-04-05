# ProtoTable

ProtoTable is a 2D, open-source, customizable virtual tabletop for board game prototyping.

The app is designed for game designers who want to rapidly prototype board games with dice rolling, decks of cards, and other simple components. Unlike other virtual tabletop systems that come with many pre-built assumptions and features, ProtoTable is highly adaptable, so the game designer can customize the code according to their needs.

**NB:** It is a work in progress, being created by a beginner dev who is heavily supported by AI. I'd love collaborators so hit me up!

## Long term goals

- Table supports multiple components such as dice, cards, and tokens

Designer can:

- control room visibility
- invite players to their room
- customize components

Players can:

- join a room with a password set by the designer
- see the name of other players present in the room
- have a hand of cards that only they can see and control
- interact with components that are not within another player's hand
- select a group of components to be moved at the same time
- roll a selected group of dice together

## Short term goals

- The app has only one room
- The room is password protected, with a password set by the designer
- The only table available is a square

... we are here ...

- The only components available are 6-sided dice
- There is a maximum of 4 players
- The dice can have custom faces that the designer uploads
- Groups of dice can be selected and rolled together
- The designer can set the default state and refresh the room to that state

## Setup

### Tech stack

- Firebase Firestore
- Node with Express
- React

### Firebase

1. Create a Firebase project
2. Enable the Firestore Database and Authentication features
3. Create a .env file with your firebase config:

REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id

### Install Dependencies and Start the App

- Install the necessary dependencies with `npm install`
- In your root folder, start the server with `npm start`
- In your client folder, start the client with `npm start`
- Make sure the server and the client are running on different ports
