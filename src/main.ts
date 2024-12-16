import { CrossFade, Engine } from "excalibur";
import { loader } from "./resources";
import { Kitchen } from "./scenes/kitchen";
import { Shop } from "./scenes/shop";
import "./main.css";

const game = new Engine({
  width: 1060,
  height: 600,
  scenes: {
    kitchen: {
      scene: Kitchen,
      transitions: {
        in: new CrossFade({
          duration: 500,
          direction: "in",
          blockInput: true,
        }),
      },
    },
    shop: {
      scene: Shop,
      transitions: {
        in: new CrossFade({
          duration: 500,
          direction: "in",
          blockInput: true,
        }),
      },
    },
  },
});

game
  .start("kitchen", {
    loader,
  })
  .then(() => {
    // Do something after the game starts
  });
