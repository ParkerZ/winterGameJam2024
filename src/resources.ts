import { ImageSource, Loader } from "excalibur";
import bun from "./images/tempBuns.png";
import bunCrate from "./images/tempBunsBox.png";
import burger from "./images/tempBurger.png";
import counter from "./images/tempCounter.png";
import fridge from "./images/tempFridge.png";
import glove from "./images/tempGlove.png";
import stove from "./images/tempStove.png";
import trash from "./images/tempTrash.png";

export const Resources = {
  Bun: new ImageSource(bun),
  BunCrate: new ImageSource(bunCrate),
  Burger: new ImageSource(burger),
  Counter: new ImageSource(counter),
  Fridge: new ImageSource(fridge),
  Glove: new ImageSource(glove),
  Stove: new ImageSource(stove),
  Trash: new ImageSource(trash),
} as const;

// We build a loader and add all of our resources to the boot loader
// You can build your own loader by extending DefaultLoader
export const loader = new Loader();
for (const res of Object.values(Resources)) {
  loader.addResource(res);
}
