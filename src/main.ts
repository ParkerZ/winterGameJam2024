import { CrossFade, Engine } from "excalibur";
import { colorSecondaryCash, loader } from "./resources";
import { Kitchen } from "./scenes/kitchen";
import { Shop } from "./scenes/shop";
import "./main.css";

async function waitForFontLoad(font, timeout = 2000, interval = 100) {
  return new Promise((resolve, reject) => {
    // repeatedly poll check
    const poller = setInterval(async () => {
      try {
        await document.fonts.load(font);
      } catch (err) {
        reject(err);
      }
      if (document.fonts.check(font)) {
        clearInterval(poller);
        resolve(true);
      }
    }, interval);
    setTimeout(() => clearInterval(poller), timeout);
  });
}
// Load font before game start
await waitForFontLoad("24px Kaph");

const game = new Engine({
  width: 1060,
  height: 600,
  backgroundColor: colorSecondaryCash,
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
