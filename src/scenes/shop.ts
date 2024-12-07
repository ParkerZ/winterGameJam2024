import { GuestAutoFulfill } from "@/guests/guestAutoFulfill";
import { GuestFreeBuzz } from "@/guests/guestFreeBuzz";
import { GuestHardBuzz } from "@/guests/guestHardBuzz";
import { GuestHardBuzzCash } from "@/guests/guestHardBuzzCash";
import { GuestInviteCard } from "@/guests/guestInviteCard";
import { GuestMidBuzz } from "@/guests/guestMidBuzz";
import { GuestMidCashForBuzz } from "@/guests/guestMidCashForBuzz";
import { GuestMidUpgrade } from "@/guests/guestMidUpgrade";
import { GuestRemove } from "@/guests/guestRemove";
import { GuestSimpleBuzz } from "@/guests/guestSimpleBuzz";
import { GuestSimpleCash } from "@/guests/guestSimpleCash";
import { GuestSimpleCashPlus } from "@/guests/guestSimpleCashPlus";
import { GuestSimpleWatch } from "@/guests/guestSimpleWatch";
import { PlayerData } from "@/playerData";
import { BuzzCounter } from "@/ui/buzzCounter";
import { CashCounter } from "@/ui/cashCounter";
import { OpenKitchenButton } from "@/ui/openKitchenButton";
import { Engine, Scene, SceneActivationContext, vec } from "excalibur";

export class Shop extends Scene {
  override onInitialize(engine: Engine): void {}

  override onActivate(context: SceneActivationContext<unknown>): void {
    console.log("buzz:", PlayerData.buzz, "cash:", PlayerData.cash);

    const buzzCounter = new BuzzCounter(vec(25, 25));
    const cashCounter = new CashCounter(vec(25, 75));

    // TODO: add guest inviter for each guest type
    const invite1 = new GuestInviteCard({
      pos: vec(85, 150),
      GuestType: GuestSimpleBuzz,
      buzzCost: 2,
    });

    const invite2 = new GuestInviteCard({
      pos: vec(210, 150),
      GuestType: GuestSimpleCash,
      buzzCost: 2,
    });

    const invite3 = new GuestInviteCard({
      pos: vec(335, 150),
      GuestType: GuestMidBuzz,
      buzzCost: 3,
    });

    const invite4 = new GuestInviteCard({
      pos: vec(460, 150),
      GuestType: GuestMidUpgrade,
      buzzCost: 5,
    });

    const invite5 = new GuestInviteCard({
      pos: vec(585, 150),
      GuestType: GuestFreeBuzz,
      buzzCost: 3,
    });

    const invite6 = new GuestInviteCard({
      pos: vec(710, 150),
      GuestType: GuestAutoFulfill,
      buzzCost: 8,
    });

    const invite7 = new GuestInviteCard({
      pos: vec(85, 450),
      GuestType: GuestRemove,
      buzzCost: 2,
    });

    const invite8 = new GuestInviteCard({
      pos: vec(210, 450),
      GuestType: GuestMidCashForBuzz,
      buzzCost: 4,
    });

    const invite9 = new GuestInviteCard({
      pos: vec(335, 450),
      GuestType: GuestHardBuzz,
      buzzCost: 4,
    });

    const invite10 = new GuestInviteCard({
      pos: vec(460, 450),
      GuestType: GuestSimpleCashPlus,
      buzzCost: 4,
    });

    const invite11 = new GuestInviteCard({
      pos: vec(585, 450),
      GuestType: GuestHardBuzzCash,
      buzzCost: 4,
    });

    const invite12 = new GuestInviteCard({
      pos: vec(710, 450),
      GuestType: GuestSimpleWatch,
      buzzCost: 4,
    });

    const button = new OpenKitchenButton();

    this.add(buzzCounter);
    this.add(cashCounter);

    this.add(invite1);
    this.add(invite2);
    this.add(invite3);
    this.add(invite4);
    this.add(invite5);
    this.add(invite6);
    this.add(invite7);
    this.add(invite8);
    this.add(invite9);
    this.add(invite10);
    this.add(invite11);
    this.add(invite12);

    this.add(button);
  }

  override onDeactivate(context: SceneActivationContext): void {
    // Called when Excalibur transitions away from this scene
    // Only 1 scene is active at a time
    this.clear();
  }

  override onPreUpdate(engine: Engine, elapsedMs: number): void {}
}
