import { Color, ImageSource, Loader, Sound, vec } from "excalibur";
import arrowDown from "./images/arrowDown.png";
import bun from "./images/bun.png";
import bunBottom from "./images/bunButtom.png";
import bunCrate from "./images/bunCrate.png";
import bunTop from "./images/bunTop.png";
import burger from "./images/patty.png";
import buttonInvite from "./images/buyButton.png";
import buttonNext from "./images/nextButton.png";
import buttonNextTemp from "./images/tempNextButton.png";
import cancelButton from "./images/cancelButton.png";
import cheese from "./images/cheese.png";
import cheeseCrate from "./images/cheeseCrate.png";
import counter1 from "./images/counter1.png";
import counter2 from "./images/counter2.png";
import counter3 from "./images/counter3.png";
import floorBg from "./images/floorBg.png";
import fridge from "./images/fridge.png";
import glove from "./images/glove.png";
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
import iconBacking from "./images/iconBacking.png";
import iconBell from "./images/IconBell.png";
import iconCancel from "./images/iconCancel.png";
import iconEasy from "./images/iconEasy.png";
import iconHard from "./images/iconHard.png";
import iconMedium from "./images/iconMedium.png";
import iconUpgrade from "./images/iconUpgrade.png";
import iconWatch from "./images/iconWatch.png";
import kitchenBackgroundGradient from "./images/kitchenBgGradient.png";
import knifeUpgrade from "./images/knifeUpgrade.png";
import lettuce from "./images/lettuce.png";
import lettuceCrate from "./images/lettuceCrate.png";
import lettuceSlice from "./images/lettuceSlice.png";
import mince from "./images/mince.png";
import orderBanner from "./images/tempOrderBanner.png";
import sidePanel from "./images/tempSidePanel.png";
import sidePanel2 from "./images/tempSidePanel2.png";
import star from "./images/star.png";
import stove from "./images/stove.png";
import stoveUpgrade from "./images/stoveUpgrade.png";
import thoughtBubble from "./images/thoughtBubble.png";
import timeLabel from "./images/timeLabel.png";
import tomato from "./images/tomato.png";
import tomatoCrate from "./images/tomatoCrate.png";
import tomatoSlice from "./images/tomatoSlice.png";
import tooltip from "./images/tooltip.png";
import trash from "./images/trash.png";

import kitchenMusic from "./sounds/kitchenMusic.wav";
import shopMusic from "./sounds/shopMusic.wav";
import click1 from "./sounds/click1.wav";
import click2 from "./sounds/click2.wav";
import click3 from "./sounds/click3.wav";
import sizzle from "./sounds/sizzle.wav";
import chop1 from "./sounds/chop1.wav";
import chop2 from "./sounds/chop2.wav";
import chop3 from "./sounds/chop3.wav";
import grab from "./sounds/grab.wav";
import right from "./sounds/right.wav";
import wrong from "./sounds/wrong.wav";
import cancel from "./sounds/cancel.wav";
import activate from "./sounds/activate.wav";
import timesUp from "./sounds/timesUp.wav";
import allClear from "./sounds/allClear.wav";

export const Resources = {
  ArrowDown: new ImageSource(arrowDown),
  Bun: new ImageSource(bun),
  BunBottom: new ImageSource(bunBottom),
  BunCrate: new ImageSource(bunCrate),
  BunTop: new ImageSource(bunTop),
  Burger: new ImageSource(burger),
  ButtonInvite: new ImageSource(buttonInvite),
  ButtonNext: new ImageSource(buttonNext),
  CancelButton: new ImageSource(cancelButton),
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
  IconBacking: new ImageSource(iconBacking),
  IconBell: new ImageSource(iconBell),
  IconCancel: new ImageSource(iconCancel),
  IconEasy: new ImageSource(iconEasy),
  iconHard: new ImageSource(iconHard),
  iconMedium: new ImageSource(iconMedium),
  IconUpgrade: new ImageSource(iconUpgrade),
  IconWatch: new ImageSource(iconWatch),
  KitchenBackground: new ImageSource(kitchenBackgroundGradient),
  KnifeUpgrade: new ImageSource(knifeUpgrade),
  Lettuce: new ImageSource(lettuce),
  LettuceCrate: new ImageSource(lettuceCrate),
  LettuceSlice: new ImageSource(lettuceSlice),
  Mince: new ImageSource(mince),
  OrderBanner: new ImageSource(orderBanner),
  SidePanel: new ImageSource(sidePanel2),
  Star: new ImageSource(star),
  Stove: new ImageSource(stove),
  StoveUpgrade: new ImageSource(stoveUpgrade),
  ThoughtBubble: new ImageSource(thoughtBubble),
  TimeLabel: new ImageSource(timeLabel),
  Tomato: new ImageSource(tomato),
  TomatoSlice: new ImageSource(tomatoSlice),
  TomatoCrate: new ImageSource(tomatoCrate),
  Tooltip: new ImageSource(tooltip),
  Trash: new ImageSource(trash),
  musicShop: new Sound(shopMusic),
  musicKitchen: new Sound(kitchenMusic),
  soundClick1: new Sound(click1),
  soundClick2: new Sound(click2),
  soundClick3: new Sound(click3),
  soundSizzle: new Sound(sizzle),
  soundChop1: new Sound(chop1),
  soundChop2: new Sound(chop2),
  soundChop3: new Sound(chop3),
  soundGrab: new Sound(grab),
  soundRight: new Sound(right),
  soundWrong: new Sound(wrong),
  soundCancel: new Sound(cancel),
  soundActivate: new Sound(activate),
  soundDayEnd: new Sound(timesUp),
  soundAllGuestsServed: new Sound(allClear),
} as const;

// We build a loader and add all of our resources to the boot loader
// You can build your own loader by extending DefaultLoader
export const loader = new Loader();
for (const res of Object.values(Resources)) {
  loader.addResource(res);
}

export const musicVolume = 0.25;
export const chopVolume = 0.5;
export const sizzleVolume = 0.6;
export const grabVolume = 0.5;
export const orderVolume = 0.7;
export const cancelVolume = 1;
export const activateVolume = 0.8;
export const dayEndVolume = 0.3;
export const allGuestsServedVolume = 1;

export const getRandomClickSound = () =>
  [Resources.soundClick1, Resources.soundClick2, Resources.soundClick3][
    Math.floor(Math.random() * 3)
  ];

export const getRandomChopSound = () =>
  [Resources.soundChop1, Resources.soundChop2, Resources.soundChop3][
    Math.floor(Math.random() * 3)
  ];

// Based off aspect ratio scale in game vs saved image
export const spriteScale = vec(600 / 1557, 600 / 1557);

// Cutting out the appliances can slightly enlarge them, these numbers came from tweaking the above
export const cutoutScale = vec(580 / 1557, 580 / 1557);

export const guestScale = vec(0.425, 0.425);

export const nextButtonScale = vec(0.75, 0.75);

export const colorLabel = new Color(255, 255, 243);
export const colorAccent = new Color(255, 204, 0);
export const colorPrimaryBuzz = new Color(247, 157, 108);
export const colorSecondaryBuzz = new Color(115, 80, 72);
export const colorPrimaryCash = new Color(107, 242, 193);
export const colorSecondaryCash = new Color(63, 140, 126);
