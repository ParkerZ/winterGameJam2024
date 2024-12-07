import { GuestAutoFulfill } from "@/guests/guestAutoFulfill";
import { GuestFreeBuzz } from "@/guests/guestFreeBuzz";
import { GuestInviteCard } from "@/guests/guestInviteCard";
import { GuestMidBuzz } from "@/guests/guestMidBuzz";
import { GuestMidUpgrade } from "@/guests/guestMidUpgrade";
import { GuestRemove } from "@/guests/guestRemove";
import { GuestSimpleBuzz } from "@/guests/guestSimpleBuzz";
import { GuestSimpleCash } from "@/guests/guestSimpleCash";
import { PlayerData } from "@/playerData";
import { BuzzCounter } from "@/ui/buzzCounter";
import { OpenKitchenButton } from "@/ui/openKitchenButton";
import { Engine, Scene, SceneActivationContext, vec } from "excalibur";

export class Shop extends Scene {
  override onInitialize(engine: Engine): void {}

  override onActivate(context: SceneActivationContext<unknown>): void {
    console.log("buzz:", PlayerData.buzz, "cash:", PlayerData.cash);

    const buzzCounter = new BuzzCounter(vec(25, 25));

    // TODO: add guest inviter for each guest type
    const invite1 = new GuestInviteCard({
      pos: vec(200, 150),
      GuestType: GuestSimpleBuzz,
      buzzCost: 2,
    });

    const invite2 = new GuestInviteCard({
      pos: vec(400, 150),
      GuestType: GuestSimpleCash,
      buzzCost: 2,
    });

    const invite3 = new GuestInviteCard({
      pos: vec(600, 150),
      GuestType: GuestMidBuzz,
      buzzCost: 3,
    });

    const invite4 = new GuestInviteCard({
      pos: vec(200, 450),
      GuestType: GuestMidUpgrade,
      buzzCost: 5,
    });

    const invite5 = new GuestInviteCard({
      pos: vec(400, 450),
      GuestType: GuestFreeBuzz,
      buzzCost: 3,
    });

    const invite6 = new GuestInviteCard({
      pos: vec(600, 450),
      GuestType: GuestAutoFulfill,
      buzzCost: 8,
    });

    const invite7 = new GuestInviteCard({
      pos: vec(600, 450),
      GuestType: GuestRemove,
      buzzCost: 2,
    });

    const button = new OpenKitchenButton();

    this.add(buzzCounter);

    this.add(invite1);
    this.add(invite2);
    this.add(invite3);
    this.add(invite4);
    this.add(invite5);
    // this.add(invite6);
    this.add(invite7);

    this.add(button);
  }

  override onDeactivate(context: SceneActivationContext): void {
    // Called when Excalibur transitions away from this scene
    // Only 1 scene is active at a time
    this.clear();
  }

  override onPreUpdate(engine: Engine, elapsedMs: number): void {}
}
