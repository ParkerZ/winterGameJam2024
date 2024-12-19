# Burger Buddies

A deck builder with the works (catsup mustard pickle + onion).

Check out a [playable demo](https://farkatdark.itch.io/burger-buddies) of this game on itch.

## Resources and Attribution

- [Kaph Font](https://ggbot.itch.io/kaph-font)
- [Kitchen Assets](https://kaylousberg.itch.io/restaurant-bits)
- [Character Assets](https://kenney.nl/assets/mini-characters-1)
- [Glove](https://www.cgtrader.com/free-3d-models/character/anatomy/funny-cartoon-hands)
- [Bell Icon Inspiration](https://www.flaticon.com/free-icon/bell_1827312)
- [Animation: EaseOutBack Fuction](https://easings.net/#easeOutBack)
- [Animation: EaseInOutCubic Fuction](https://easings.net/#easeInOutCubic)
- [Kitchen Song](https://freesound.org/people/neko_4444/sounds/741602/)
- [Shop Song](https://freesound.org/people/neko_4444/sounds/744187/)
- [All Other Sounds](https://sfxr.me/)

## Get Started

- Using [Node.js](https://nodejs.org/en/) 14 (LTS) and [npm](https://www.npmjs.com/)
- Run the `npm install` to install dependencies
- Run the `npm start` to run the development server to test out changes
  - [Webpack](https://webpack.js.org/) will build the [Typescript](https://www.typescriptlang.org/) into Javascript
  - [Webpack dev server](https://webpack.js.org/configuration/dev-server/) will host the script in a little server on http://localhost:8080/

## Publishing

- Run `npm run build:dev` to produce Javascript bundles for debugging in the `dist/` folder
- Run `npm run build:prod` to produce Javascript bundles for production (minified) in the `dist/` folder
