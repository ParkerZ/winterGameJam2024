import { ImageSource, Loader } from "excalibur";
import bun from "./images/tempBuns.png";
import bunBottom from "./images/tempBunBottom.png";
import bunCrate from "./images/tempBunsBox.png";
import bunTop from "./images/tempBunTop.png";
import burger from "./images/tempBurger.png";
import cheese from "./images/tempCheese.png";
import cheeseCrate from "./images/tempCheeseBox.png";
import counter from "./images/tempCounter.png";
import fridge from "./images/tempFridge.png";
import glove from "./images/tempGlove.png";
import mince from "./images/tempMince.png";
import stove from "./images/tempStove.png";
import tomato from "./images/tempTomato.png";
import tomatoCrate from "./images/tempTomatoBox.png";
import tomatoSlice from "./images/tempTomatoSlice.png";
import trash from "./images/tempTrash.png";

export const Resources = {
  Bun: new ImageSource(bun),
  BunBottom: new ImageSource(bunBottom),
  BunCrate: new ImageSource(bunCrate),
  BunTop: new ImageSource(bunTop),
  Burger: new ImageSource(burger),
  Cheese: new ImageSource(cheese),
  CheeseCrate: new ImageSource(cheeseCrate),
  Counter: new ImageSource(counter),
  Fridge: new ImageSource(fridge),
  Glove: new ImageSource(glove),
  Mince: new ImageSource(mince),
  Stove: new ImageSource(stove),
  Tomato: new ImageSource(tomato),
  TomatoSlice: new ImageSource(tomatoSlice),
  TomatoCrate: new ImageSource(tomatoCrate),
  Trash: new ImageSource(trash),
} as const;

// We build a loader and add all of our resources to the boot loader
// You can build your own loader by extending DefaultLoader
export const loader = new Loader();
for (const res of Object.values(Resources)) {
  loader.addResource(res);
}
