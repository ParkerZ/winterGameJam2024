import { Engine } from "excalibur";
import { Guest } from "./guests/guest";
import { GuestMidBuzz } from "./guests/guestMidBuzz";
import { GuestSimpleBuzz } from "./guests/guestSimpleBuzz";
import { GuestSimpleCash } from "./guests/guestSimpleCash";
import { Food } from "./foodStuffs/food";
import { Tomato } from "./foodStuffs/tomato";
import { Burger } from "./foodStuffs/burger";
import { Cheese } from "./foodStuffs/cheese";

const cheeseBun = new Burger(new Set(["Cheese"]));
const cheeseTomatoPattyBun = new Burger(
  new Set(["Cheese", "TomatoSlice", "Patty"])
);

export class PlayerData {
  public static buzz: number = 0;
  public static buzzEarned: number = 0;
  public static cash: number = 0;
  public static cashEarned: number = 0;
  public static star: number = 0;
  public static day: number = 0;
  public static maxDay: number = 14;
  public static tutorialStep: number = 0;

  public static cookingLevel: number = 1;
  public static choppingLevel: number = 1;
  public static cookingTimeThreshold: number = 2500;
  public static choppingTimeThreshold: number = 2000;

  public static deck: Array<Guest> = [
    new GuestSimpleBuzz({}),
    new GuestSimpleBuzz({}),
    new GuestSimpleCash({}),
    new GuestSimpleCash({}),
    new GuestMidBuzz({}),
  ];

  public static remove(guest: Guest, engine: Engine<any>) {
    const guestIndex = PlayerData.deck.indexOf(guest);
    const guestToRemove = PlayerData.deck[guestIndex];
    guestToRemove.remove(engine);
    PlayerData.deck.splice(guestIndex, 1);
  }

  public static getCountOfGuestType(GuestType: typeof Guest): number {
    return PlayerData.deck.filter((g) => g instanceof GuestType).length;
  }

  public static upgradeCookingTimeThreshold() {
    PlayerData.cookingTimeThreshold -= 500;
    PlayerData.cookingLevel += 1;
  }

  public static upgradeChoppingTimeThreshold() {
    PlayerData.choppingTimeThreshold -= 400;
    PlayerData.choppingLevel += 1;
  }

  public static onMinceCooking() {
    if (PlayerData.tutorialStep === 1) {
      PlayerData.tutorialStep = 2;
    }
  }

  public static onCounterHoldItem(item: Food) {
    if (item instanceof Tomato && PlayerData.tutorialStep === 2) {
      PlayerData.tutorialStep = 3;
    }
  }

  public static onTomatoChop() {
    if (PlayerData.tutorialStep === 3) {
      PlayerData.tutorialStep = 4;
    }
  }

  public static onBurgerMade(burger: Burger) {
    if (
      PlayerData.tutorialStep === 4 &&
      burger.getIngredients().size === cheeseBun.getIngredients().size &&
      Array.from(burger.getIngredients()).every((i) =>
        cheeseBun.getIngredients().has(i)
      )
    ) {
      PlayerData.tutorialStep = 5;
    } else if (
      PlayerData.tutorialStep === 5 &&
      burger.getIngredients().size ===
        cheeseTomatoPattyBun.getIngredients().size &&
      Array.from(burger.getIngredients()).every((i) =>
        cheeseTomatoPattyBun.getIngredients().has(i)
      )
    ) {
      PlayerData.tutorialStep = 6;
    }
  }

  public static onGuestOrder() {
    if (PlayerData.tutorialStep === 6) {
      PlayerData.tutorialStep = 7;
    }
  }

  public static onTrashItem() {
    if (PlayerData.tutorialStep === 7) {
      PlayerData.tutorialStep = 8;
    }
  }

  public static onCompleteOrder() {
    if (PlayerData.tutorialStep === 7 || PlayerData.tutorialStep === 8) {
      PlayerData.tutorialStep = 9;
    }
  }
}
