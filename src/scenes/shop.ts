import { KnifeUpgradeCard } from "@/appliances/knifeUpgradeCard";
import { StoveUpgradeCard } from "@/appliances/stoveUpgradeCard";
import { GuestAutoFulfill } from "@/guests/guestAutoFulfill";
import { GuestFreeBuzz } from "@/guests/guestFreeBuzz";
import { GuestHardBuzz } from "@/guests/guestHardBuzz";
import { GuestHardBuzzCash } from "@/guests/guestHardBuzzCash";
import { GuestHardStarOne } from "@/guests/guestHardStarOne";
import { GuestHardStarThree } from "@/guests/guestHardStarThree";
import { GuestHardStarTwo } from "@/guests/guestHardStarTwo";
import { GuestInviteCard } from "@/guests/guestInviteCard";
import { GuestMidBuzz } from "@/guests/guestMidBuzz";
import { GuestMidCash } from "@/guests/guestMidCash";
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
import { DayCounter } from "@/ui/dayCounter";
import { OpenKitchenButton } from "@/ui/openKitchenButton";
import { StarCounter } from "@/ui/starCounter";
import {
  Engine,
  Font,
  Label,
  Scene,
  SceneActivationContext,
  Vector,
  vec,
} from "excalibur";

export class Shop extends Scene {
  override onInitialize(engine: Engine): void {}

  override onActivate(context: SceneActivationContext<unknown>): void {
    if (PlayerData.day >= PlayerData.maxDay) {
      alert("Game over");
    }

    const buzzCounter = new BuzzCounter(vec(25, 5));
    const cashCounter = new CashCounter(vec(25, 35));
    const dayCounter = new DayCounter(vec(25, 65));
    const starCounter = new StarCounter(vec(25, 95));

    const invite1 = new GuestInviteCard({
      pos: vec(85, 150),
      GuestType: GuestSimpleCash,
      buzzCost: 1,
    });

    const invite2 = new GuestInviteCard({
      pos: vec(210, 150),
      GuestType: GuestMidBuzz,
      buzzCost: 2,
      max: 3,
    });

    const invite3 = new GuestInviteCard({
      pos: vec(335, 150),
      GuestType: GuestMidCash,
      buzzCost: 2,
      max: 3,
    });

    const invite4 = new GuestInviteCard({
      pos: vec(460, 150),
      GuestType: GuestFreeBuzz,
      buzzCost: 3,
    });

    const invite5 = new GuestInviteCard({
      pos: vec(585, 150),
      GuestType: GuestMidCashForBuzz,
      buzzCost: 3,
      max: 3,
    });

    const invite6 = new GuestInviteCard({
      pos: vec(710, 150),
      GuestType: GuestSimpleWatch,
      buzzCost: 4,
      max: 3,
    });

    const invite7 = new GuestInviteCard({
      pos: vec(85, 300),
      GuestType: GuestMidUpgrade,
      buzzCost: 5,
      max: 3,
    });

    const invite8 = new GuestInviteCard({
      pos: vec(210, 300),
      GuestType: GuestHardBuzz,
      buzzCost: 6,
      max: 2,
    });

    const invite9 = new GuestInviteCard({
      pos: vec(336, 300),
      GuestType: GuestHardBuzzCash,
      buzzCost: 6,
      max: 2,
    });

    const invite10 = new GuestInviteCard({
      pos: vec(460, 300),
      GuestType: GuestAutoFulfill,
      buzzCost: 7,
      max: 2,
    });

    const invite11 = new GuestInviteCard({
      pos: vec(585, 300),
      GuestType: GuestSimpleCashPlus,
      buzzCost: 7,
      max: 3,
    });

    const invite12 = new GuestInviteCard({
      pos: vec(710, 300),
      GuestType: GuestRemove,
      buzzCost: 8,
      max: 2,
    });

    const invite13 = new GuestInviteCard({
      pos: vec(85, 450),
      GuestType: GuestHardStarOne,
      buzzCost: 20,
      max: 1,
      minStar: 0,
      isDisabled: PlayerData.star >= 1,
    });

    const invite14 = new GuestInviteCard({
      pos: vec(210, 450),
      GuestType: GuestHardStarTwo,
      buzzCost: 20,
      max: 1,
      minStar: 1,
      isDisabled: PlayerData.star >= 2,
    });

    const invite15 = new GuestInviteCard({
      pos: vec(335, 450),
      GuestType: GuestHardStarThree,
      buzzCost: 20,
      max: 1,
      minStar: 2,
      isDisabled: PlayerData.star >= 3,
    });

    const upgrade1 = new StoveUpgradeCard({
      pos: vec(460, 450),
      cashCost: PlayerData.cookingLevel + 1,
    });

    const upgrade2 = new KnifeUpgradeCard({
      pos: vec(585, 450),
      cashCost: PlayerData.choppingLevel + 2,
    });

    const deckSizeLabel = new Label({
      pos: vec(665, 390),
      anchor: Vector.Half,
      text: `Total: ${PlayerData.deck.length}`,
      font: new Font({ size: 24 }),
    });
    const button = new OpenKitchenButton();

    this.add(buzzCounter);
    this.add(cashCounter);
    this.add(dayCounter);
    this.add(starCounter);

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
    this.add(invite13);
    this.add(invite14);
    this.add(invite15);

    this.add(upgrade1);
    this.add(upgrade2);

    this.add(deckSizeLabel);
    this.add(button);
  }

  override onDeactivate(context: SceneActivationContext): void {
    // Called when Excalibur transitions away from this scene
    // Only 1 scene is active at a time
    this.clear();
  }

  override onPreUpdate(engine: Engine, elapsedMs: number): void {}
}
