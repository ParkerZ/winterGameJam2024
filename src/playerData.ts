import { Guest } from "./guests/guest";
import { GuestMidBuzz } from "./guests/guestMidBuzz";
import { GuestSimpleBuzz } from "./guests/guestSimpleBuzz";
import { GuestSimpleCash } from "./guests/guestSimpleCash";

export class PlayerData {
  public static buzz: number = 0;
  public static cash: number = 0;

  public static deck: Array<Guest> = [
    new GuestSimpleBuzz({}),
    new GuestSimpleBuzz({}),
    new GuestSimpleCash({}),
    new GuestSimpleCash({}),
    new GuestMidBuzz({}),
  ];
}
