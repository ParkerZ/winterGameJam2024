import { KnifeUpgradeCard } from "@/appliances/knifeUpgradeCard";
import { StoveUpgradeCard } from "@/appliances/stoveUpgradeCard";
import { GuestAutoFulfill } from "@/guests/guestAutoFulfill";
import { GuestFreeBuzz } from "@/guests/guestFreeBuzz";
import { GuestHardBuzz } from "@/guests/guestHardBuzz";
import { GuestHardBuzzCash } from "@/guests/guestHardBuzzCash";
import { GuestHardStar } from "@/guests/guestHardStar";
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
import { Resources, colorLabel, musicVolume } from "@/resources";
import { BuzzCounter } from "@/ui/buzzCounter";
import { CashCounter } from "@/ui/cashCounter";
import { DayCounter } from "@/ui/dayCounter";
import { DeckCounter } from "@/ui/deckCounter";
import { OpenKitchenButton } from "@/ui/openKitchenButton";
import { StarCounter } from "@/ui/starCounter";
import {
  Engine,
  Font,
  Scene,
  SceneActivationContext,
  ScreenElement,
  Text,
  TextAlign,
  vec,
} from "excalibur";

export class Shop extends Scene {
  private bgParallaxElements: Array<ScreenElement> = [];
  override onInitialize(engine: Engine): void {
    Resources.musicShop.loop = true;
  }

  override onActivate(context: SceneActivationContext<unknown>): void {
    if (PlayerData.day >= PlayerData.maxDay) {
      context.engine.goToScene("gameOver");
    }

    Resources.musicShop.play(musicVolume);

    this.bgParallaxElements = [
      new ScreenElement({ z: -2, pos: vec(180 * -1, 1) }),
      new ScreenElement({ z: -2, pos: vec(180 * 0, 0) }),
      new ScreenElement({ z: -2, pos: vec(180 * 1, 0) }),
      new ScreenElement({ z: -2, pos: vec(180 * 2, 0) }),
      new ScreenElement({ z: -2, pos: vec(180 * 3, 0) }),
      new ScreenElement({ z: -2, pos: vec(180 * 4, 0) }),
    ];

    this.bgParallaxElements.forEach((e) => {
      e.graphics.use(Resources.Parallax.toSprite());
      this.add(e);
    });

    const topText = new ScreenElement({ pos: vec(425, 25) });
    const topTextSprite = new Text({
      text: "Add Guests To Your Invite List!",
      font: new Font({
        family: "Kaph",
        size: 36,
        color: colorLabel,
        textAlign: TextAlign.Center,
      }),
    });
    topText.graphics.use(topTextSprite);
    this.add(topText);

    const sidePanel = new ScreenElement({ x: 860, y: 0, z: -2 });
    const panelSprite = Resources.SidePanel.toSprite();
    sidePanel.graphics.use(panelSprite);
    this.add(sidePanel);

    const buzzCounter = new BuzzCounter();
    const cashCounter = new CashCounter();
    const dayCounter = new DayCounter();
    const starCounter = new StarCounter();
    const deckCounter = new DeckCounter();

    const invite1 = new GuestInviteCard({
      pos: vec(70, 150),
      GuestType: GuestSimpleBuzz,
      buzzCost: 1,
    });

    const invite2 = new GuestInviteCard({
      pos: vec(212, 150),
      GuestType: GuestSimpleCash,
      buzzCost: 1,
    });

    const invite3 = new GuestInviteCard({
      pos: vec(354, 150),
      GuestType: GuestMidBuzz,
      buzzCost: 2,
      max: 3,
    });

    const invite4 = new GuestInviteCard({
      pos: vec(496, 150),
      GuestType: GuestFreeBuzz,
      buzzCost: 3,
    });

    const invite5 = new GuestInviteCard({
      pos: vec(638, 150),
      GuestType: GuestMidCashForBuzz,
      buzzCost: 3,
      max: 3,
    });

    const invite6 = new GuestInviteCard({
      pos: vec(780, 150),
      GuestType: GuestSimpleWatch,
      buzzCost: 4,
      max: 3,
    });

    const invite7 = new GuestInviteCard({
      pos: vec(70, 325),
      GuestType: GuestMidUpgrade,
      buzzCost: 5,
      max: 3,
    });

    const invite8 = new GuestInviteCard({
      pos: vec(212, 325),
      GuestType: GuestHardBuzz,
      buzzCost: 6,
      max: 2,
    });

    const invite9 = new GuestInviteCard({
      pos: vec(354, 325),
      GuestType: GuestHardBuzzCash,
      buzzCost: 6,
      max: 2,
    });

    const invite10 = new GuestInviteCard({
      pos: vec(496, 325),
      GuestType: GuestAutoFulfill,
      buzzCost: 7,
      max: 2,
    });

    const invite11 = new GuestInviteCard({
      pos: vec(638, 325),
      GuestType: GuestSimpleCashPlus,
      buzzCost: 7,
      max: 3,
    });

    const invite12 = new GuestInviteCard({
      pos: vec(780, 325),
      GuestType: GuestRemove,
      buzzCost: 8,
      max: 2,
    });

    const invite13 = new GuestInviteCard({
      pos: vec(70, 500),
      GuestType: GuestHardStar,
      buzzCost: 20,
      max: 1,
    });

    const upgrade1 = new StoveUpgradeCard({
      pos: vec(350, 500),
      cashCost: PlayerData.cookingLevel + 1,
    });

    const upgrade2 = new KnifeUpgradeCard({
      pos: vec(500, 500),
      cashCost: PlayerData.choppingLevel + 2,
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

    this.add(upgrade1);
    this.add(upgrade2);

    this.add(deckCounter);
    this.add(button);
  }

  override onDeactivate(context: SceneActivationContext): void {
    // Called when Excalibur transitions away from this scene
    // Only 1 scene is active at a time
    Resources.musicShop.stop();
    this.clear();
  }

  override onPreUpdate(engine: Engine, elapsedMs: number): void {
    this.scrollParallax();
  }

  private scrollParallax() {
    this.bgParallaxElements.forEach((e) => {
      e.pos = e.pos.add(vec(0.5, -0.25));
      if (e.pos.x >= 180 * 4 + 180) {
        e.pos = vec(180 * -1, 0);
      }
    });
  }
}
