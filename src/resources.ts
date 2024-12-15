import { ImageSource, Loader, vec } from "excalibur";
import bun from "./images/bun.png";
import bunBottom from "./images/bunButtom.png";
import bunCrate from "./images/bunCrate.png";
import bunTop from "./images/bunTop.png";
import burger from "./images/patty.png";
import buttonInvite from "./images/tempInviteButton.png";
import buttonNext from "./images/tempNextButton.png";
import cheese from "./images/cheese.png";
import cheeseCrate from "./images/cheeseCrate.png";
import counter1 from "./images/counter1.png";
import counter2 from "./images/counter2.png";
import counter3 from "./images/counter3.png";
import floorBg from "./images/floorBg.png";
import fridge from "./images/fridge.png";
import glove from "./images/tempGlove.png";
import guest1 from "./images/guest1.png";
import guest2 from "./images/guest2.png";
import guest3 from "./images/guest3.png";
import guest4 from "./images/guest4.png";
import guest5 from "./images/guest5.png";
import guest6 from "./images/guest6.png";
import guest7 from "./images/guest7.png";
import guest8 from "./images/guest8.png";
import guest9 from "./images/guest9.png";
import guest10 from "./images/guest10.png";
import guest11 from "./images/guest11.png";
import guest12 from "./images/guest12.png";
import guest13 from "./images/guest13.png";
import kitchenBackground from "./images/kitchenBackground.png";
import kitchenBackgroundFull from "./images/kitchenBackgroundFull.png";
import knifeUpgrade from "./images/knifeUpgrade.png";
import lettuce from "./images/lettuce.png";
import lettuceCrate from "./images/lettuceCrate.png";
import lettuceSlice from "./images/lettuceSlice.png";
import mince from "./images/mince.png";
import orderBanner from "./images/tempOrderBanner.png";
import stove from "./images/stove.png";
import stoveUpgrade from "./images/stoveUpgrade.png";
import tomato from "./images/tomato.png";
import tomatoCrate from "./images/tomatoCrate.png";
import tomatoSlice from "./images/tomatoSlice.png";
import trash from "./images/trash.png";

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
  Counter1: new ImageSource(counter1),
  Counter2: new ImageSource(counter2),
  Counter3: new ImageSource(counter3),
  FloorBg: new ImageSource(floorBg),
  Fridge: new ImageSource(fridge),
  Glove: new ImageSource(glove),
  Guest1: new ImageSource(guest1),
  Guest2: new ImageSource(guest2),
  Guest3: new ImageSource(guest3),
  Guest4: new ImageSource(guest4),
  Guest5: new ImageSource(guest5),
  Guest6: new ImageSource(guest6),
  Guest7: new ImageSource(guest7),
  Guest8: new ImageSource(guest8),
  Guest9: new ImageSource(guest9),
  Guest10: new ImageSource(guest10),
  Guest11: new ImageSource(guest11),
  Guest12: new ImageSource(guest12),
  Guest13: new ImageSource(guest13),
  KitchenBackground: new ImageSource(kitchenBackground),
  KnifeUpgrade: new ImageSource(knifeUpgrade),
  Lettuce: new ImageSource(lettuce),
  LettuceCrate: new ImageSource(lettuceCrate),
  LettuceSlice: new ImageSource(lettuceSlice),
  Mince: new ImageSource(mince),
  OrderBanner: new ImageSource(orderBanner),
  Stove: new ImageSource(stove),
  StoveUpgrade: new ImageSource(stoveUpgrade),
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

// Based off aspect ratio scale in game vs saved image
export const spriteScale = vec(600 / 1557, 600 / 1557);

// Cutting out the appliances can slightly enlarge them, these numbers came from tweaking the above
export const cutoutScale = vec(580 / 1557, 580 / 1557);

export const guestScale = vec(0.425, 0.425);
