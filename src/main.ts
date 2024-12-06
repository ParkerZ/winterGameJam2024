import { Color, CrossFade, Engine, FadeInOut } from "excalibur";
import { loader } from "./resources";
import { Kitchen } from "./scenes/kitchen";
import { Shop } from "./scenes/shop";

// Goal is to keep main.ts small and just enough to configure the engine

const game = new Engine({
  width: 800, // Logical width and height in game pixels
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
