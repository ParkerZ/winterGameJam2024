import { ImageSource, Loader } from "excalibur";
import bun from "./images/tempBuns.png";
import bunBottom from "./images/tempBunBottom.png";
import bunCrate from "./images/tempBunsBox.png";
import bunTop from "./images/tempBunTop.png";
import burger from "./images/tempBurger.png";
import buttonInvite from "./images/tempInviteButton.png";
import buttonNext from "./images/tempNextButton.png";
import cheese from "./images/tempCheese.png";
import cheeseCrate from "./images/tempCheeseBox.png";
import counter from "./images/tempCounter.png";
import fridge from "./images/tempFridge.png";
import glove from "./images/tempGlove.png";
import guest1 from "./images/tempGuest1.png";
import guest2 from "./images/tempGuest2.png";
import guest3 from "./images/tempGuest3.png";
import guest4 from "./images/tempGuest4.png";
import guest5 from "./images/tempGuest5.png";
import guest6 from "./images/tempGuest6.png";
import mince from "./images/tempMince.png";
import orderBanner from "./images/tempOrderBanner.png";
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
  ButtonInvite: new ImageSource(buttonInvite),
  ButtonNext: new ImageSource(buttonNext),
  Cheese: new ImageSource(cheese),
  CheeseCrate: new ImageSource(cheeseCrate),
  Counter: new ImageSource(counter),
  Fridge: new ImageSource(fridge),
  Glove: new ImageSource(glove),
  Guest1: new ImageSource(guest1),
  Guest2: new ImageSource(guest2),
  Guest3: new ImageSource(guest3),
  Guest4: new ImageSource(guest4),
  Guest5: new ImageSource(guest5),
  Guest6: new ImageSource(guest6),
  Mince: new ImageSource(mince),
  OrderBanner: new ImageSource(orderBanner),
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
