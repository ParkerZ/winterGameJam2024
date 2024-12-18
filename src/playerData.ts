import { Engine } from "excalibur";
import { Guest } from "./guests/guest";
import { GuestMidBuzz } from "./guests/guestMidBuzz";
import { GuestSimpleBuzz } from "./guests/guestSimpleBuzz";
import { GuestSimpleCash } from "./guests/guestSimpleCash";

export class PlayerData {
  public static buzz: number = 10;
  public static cash: number = 10;
  public static star: number = 0;
  public static day: number = 0;
  public static maxDay: number = 14;

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
}
