import { Guest } from "./guests/guest";
import { GuestMidBuzz } from "./guests/guestMidBuzz";
import { GuestSimpleBuzz } from "./guests/guestSimpleBuzz";
import { GuestSimpleCash } from "./guests/guestSimpleCash";

export class PlayerData {
  public static buzz: number = 2;
  public static cash: number = 0;

  public static deck: Array<Guest> = [
    new GuestSimpleBuzz({}),
    new GuestSimpleBuzz({}),
    new GuestSimpleCash({}),
    new GuestSimpleCash({}),
    new GuestMidBuzz({}),
  ];

  public static remove(guest: Guest) {
    const guestIndex = PlayerData.deck.indexOf(guest);
    const guestToRemove = PlayerData.deck[guestIndex];
    guestToRemove.remove();
    PlayerData.deck.splice(guestIndex, 1);
  }
}
