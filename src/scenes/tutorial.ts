import {
  Engine,
  GraphicsGroup,
  Scene,
  SceneActivationContext,
  ScreenElement,
  Vector,
  vec,
} from "excalibur";
import { Fridge } from "../appliances/fridge";
import { Glove } from "../glove";
import { ApplianceEventEmitter, GuestEventEmitter } from "../events";
import { Counter } from "../appliances/counter";
import { Stove } from "../appliances/stove";
import { Trash } from "../appliances/trash";
import { BunCrate } from "../appliances/bunCrate";
import { TomatoCrate } from "../appliances/tomatoCrate";
import { CheeseCrate } from "../appliances/cheeseCrate";
import { Guest } from "../guests/guest";
import { PlayerData } from "../playerData";
import { OpenShopButton } from "../ui/openShopButton";
import { BuzzCounter } from "@/ui/buzzCounter";
import { CashCounter } from "@/ui/cashCounter";
import { DayCounter } from "@/ui/dayCounter";
import { LettuceCrate } from "@/appliances/lettuceCrate";
import { StarCounter } from "@/ui/starCounter";
import { Resources, musicVolume, spriteScale } from "@/resources";
import { DeckCounter } from "@/ui/deckCounter";
import { GuestSimpleBuzz } from "@/guests/guestSimpleBuzz";
import { OpenKitchenButton } from "@/ui/openKitchenButton";

export const HAS_COMPLETED_TUTORIAL_KEY =
  "burgerBuddiesTutorialCompletionAchievement";

type GuestSlot = {
  pos: Vector;
  readyTime: number;
  guest: Guest | null;
};

export class Tutorial extends Scene {
  protected allGuests: Array<Guest> = [];
  protected currStep: number = 0;
  protected stepActor: ScreenElement;

  protected guestSlot: {
    slot1: GuestSlot;
    slot2: GuestSlot;
    slot3: GuestSlot;
  } = {
    slot1: {
      pos: vec(590, 190),
      readyTime: 0,
      guest: null,
    },
    slot2: {
      pos: vec(433, 190),
      readyTime: 0,
      guest: null,
    },
    slot3: {
      pos: vec(277, 190),
      readyTime: 0,
      guest: null,
    },
  };

  private glove: Glove;

  override onInitialize(engine: Engine): void {
    Resources.musicKitchen.loop = true;
  }

  override onActivate(context: SceneActivationContext<unknown>): void {
    PlayerData.tutorialStep = 1;
    Resources.musicKitchen.play(musicVolume);

    // Create shared event emitter to connect appliance interactions to player
    const applianceEventEmitter = new ApplianceEventEmitter();

    // Create shared event emitter to connect order interactions to player
    const guestEventEmitter = new GuestEventEmitter();

    // Create array of orders
    this.allGuests = [new GuestSimpleBuzz({})];

    this.allGuests.forEach((g) => g.attachEventEmitter(guestEventEmitter));

    const kitchenBackground = new ScreenElement({ y: -4, z: -2 });
    const bgSprite = Resources.KitchenBackground.toSprite();
    bgSprite.scale = spriteScale;
    kitchenBackground.graphics.use(bgSprite);
    this.add(kitchenBackground);

    const sidePanel = new ScreenElement({ x: 860, y: 0, z: -2 });
    const panelSprite = Resources.SidePanel.toSprite();
    sidePanel.graphics.use(panelSprite);
    this.add(sidePanel);

    const buzzCounter = new BuzzCounter();
    const cashCounter = new CashCounter();
    const dayCounter = new DayCounter();
    const starCounter = new StarCounter();
    const deckCounter = new DeckCounter();

    // Rendered in this order to prevent impossible overlap
    const fridge = new Fridge(applianceEventEmitter, vec(90, 260));
    const trash = new Trash(applianceEventEmitter, vec(768, 292));
    const stove = new Stove(applianceEventEmitter, vec(230, 308));
    const counter3 = new Counter(
      applianceEventEmitter,
      vec(637, 300),
      Resources.Counter3.toSprite()
    );
    const counter1 = new Counter(
      applianceEventEmitter,
      vec(364, 300),
      Resources.Counter1.toSprite()
    );
    const counter2 = new Counter(
      applianceEventEmitter,
      vec(503, 300),
      Resources.Counter2.toSprite()
    );

    const bunCrate = new BunCrate(applianceEventEmitter, vec(182, 480));
    const tomatoCrate = new TomatoCrate(applianceEventEmitter, vec(681, 481));
    const cheeseCrate = new CheeseCrate(applianceEventEmitter, vec(345, 480));
    const lettuceCrate = new LettuceCrate(applianceEventEmitter, vec(518, 480));
    this.glove = new Glove(applianceEventEmitter, guestEventEmitter);

    this.add(buzzCounter);
    this.add(cashCounter);
    this.add(dayCounter);
    this.add(starCounter);
    this.add(deckCounter);

    this.add(fridge);
    this.add(trash);
    this.add(stove);
    this.add(counter3);
    this.add(counter1);
    this.add(counter2);
    this.add(bunCrate);
    this.add(tomatoCrate);
    this.add(cheeseCrate);
    this.add(lettuceCrate);

    this.add(this.glove);
  }

  override onDeactivate(context: SceneActivationContext): void {
    // Called when Excalibur transitions away from this scene
    // Only 1 scene is active at a time
    Resources.musicKitchen.stop();
    this.clear();
  }

  override onPreUpdate(engine: Engine, elapsedMs: number): void {
    this.handleStep();
  }

  private handleStep() {
    // Only do something when step has changed
    if (this.currStep === PlayerData.tutorialStep) {
      return;
    }

    this.currStep = PlayerData.tutorialStep;

    this.remove(this.stepActor);
    this.stepActor = new ScreenElement({ z: 6 });
    switch (this.currStep) {
      case 1:
        this.stepActor.graphics.use(Resources.Step1.toSprite());
        this.stepActor.pos = vec(90, 80);
        break;
      case 2:
        this.stepActor.graphics.use(Resources.Step2.toSprite());
        this.stepActor.pos = vec(700, 280);
        break;
      case 3:
        this.stepActor.graphics.use(Resources.Step3.toSprite());
        this.stepActor.pos = vec(560, 80);
        break;
      case 4:
        this.stepActor.graphics.use(Resources.Step4.toSprite());
        this.stepActor.pos = vec(200, 220);
        break;
      case 5:
        this.stepActor.graphics.use(Resources.Step5.toSprite());
        this.stepActor.pos = vec(355, 80);
        break;
      case 6:
        this.stepActor.graphics.use(
          new GraphicsGroup({
            members: [
              {
                graphic: Resources.Step6_1.toSprite(),
                offset: vec(-160, 0),
              },
              {
                graphic: Resources.Step6_2.toSprite(),
                offset: vec(160, 0),
              },
            ],
          })
        );
        this.stepActor.pos = vec(355, 80);
        const guest = this.allGuests.pop();
        guest.pos = vec(433, 190);
        guest.onAddToScene();
        this.add(guest);
        break;
      case 7:
        this.stepActor.graphics.use(Resources.Step7.toSprite());
        this.stepActor.pos = vec(700, 320);
        break;
      case 8:
        this.stepActor.graphics.use(Resources.Step8.toSprite());
        this.stepActor.pos = vec(200, 80);
        break;
      case 9:
        this.stepActor.graphics.use(Resources.Step9.toSprite());
        this.stepActor.pos = vec(355, 100);
        this.remove(this.glove);
        this.glove.kill();
        const button = new OpenKitchenButton(vec(430, 300));
        this.add(button);
        localStorage.setItem(
          HAS_COMPLETED_TUTORIAL_KEY,
          "funny seeing you here"
        );
        break;
    }

    this.add(this.stepActor);
  }
}
