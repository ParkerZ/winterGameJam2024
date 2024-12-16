import {
  Actor,
  Engine,
  Resource,
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
import { shuffleArray } from "../../util";
import { Guest } from "../guests/guest";
import { PlayerData } from "../playerData";
import { OpenShopButton } from "../ui/openShopButton";
import { BuzzCounter } from "@/ui/buzzCounter";
import { CashCounter } from "@/ui/cashCounter";
import { DayCounter } from "@/ui/dayCounter";
import { LettuceCrate } from "@/appliances/lettuceCrate";
import { TimeCounter } from "@/ui/timeCounter";
import { StarCounter } from "@/ui/starCounter";
import { GuestHardStarOne } from "@/guests/guestHardStarOne";
import { GuestHardStarTwo } from "@/guests/guestHardStarTwo";
import { GuestHardStarThree } from "@/guests/guestHardStarThree";
import { Resources, sidePanelScale, spriteScale } from "@/resources";

const GUEST_SPAWN_TIME_MS = 1000;

type GuestSlot = {
  pos: Vector;
  readyTime: number;
  guest: Guest | null;
};

export class Kitchen extends Scene {
  protected guestCount: number;
  protected allGuests: Array<Guest> = [];
  protected queuedGuests: Array<Guest> = [];
  protected numGuestsServed = 0;
  protected startTime = 0;
  protected maxTimeMS = 30999;
  protected isDayActive: boolean;

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
  private timeCounter: TimeCounter;

  override onInitialize(engine: Engine): void {}

  override onActivate(context: SceneActivationContext<unknown>): void {
    PlayerData.day += 1;
    this.guestCount = PlayerData.deck.length;
    this.numGuestsServed = 0;
    this.isDayActive = true;
    this.startTime = Date.now();
    const now = Date.now();
    Object.keys(this.guestSlot).forEach((key, i) => {
      this.guestSlot[key].readyTime = now + i * GUEST_SPAWN_TIME_MS;
    });

    // Create shared event emitter to connect appliance interactions to player
    const applianceEventEmitter = new ApplianceEventEmitter();

    // Create shared event emitter to connect order interactions to player
    const guestEventEmitter = new GuestEventEmitter();

    // Create array of orders
    this.allGuests = shuffleArray(PlayerData.deck.slice());

    const firstStarIndex = this.allGuests.findIndex(
      (g) => g instanceof GuestHardStarOne
    );
    const secondStarIndex = this.allGuests.findIndex(
      (g) => g instanceof GuestHardStarTwo
    );
    const thirdStarIndex = this.allGuests.findIndex(
      (g) => g instanceof GuestHardStarThree
    );

    // Put star guests somewhere in the first 5
    if (firstStarIndex > -1) {
      const guest = this.allGuests.splice(firstStarIndex, 1)[0];
      this.allGuests.splice(Math.floor(Math.random() * 5), 0, guest);
    } else if (secondStarIndex > -1) {
      const guest = this.allGuests.splice(secondStarIndex, 1)[0];
      this.allGuests.splice(Math.floor(Math.random() * 5), 0, guest);
    } else if (thirdStarIndex > -1) {
      const guest = this.allGuests.splice(thirdStarIndex, 1)[0];
      this.allGuests.splice(Math.floor(Math.random() * 5), 0, guest);
    }

    this.allGuests.forEach((g) => g.attachEventEmitter(guestEventEmitter));

    // Take 3 guests to seed level
    this.queuedGuests = [...Array(3)].map((_e, i) => {
      const guest = this.allGuests.shift();
      return guest;
    });

    const kitchenBackground = new ScreenElement({ z: -2 });
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
    this.timeCounter = new TimeCounter(
      Math.ceil(this.maxTimeMS / 1000),
      vec(700, 5)
    );

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
    this.add(this.timeCounter);

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

    guestEventEmitter.on("removeConfirm", (evt) => {
      this.enqueueNextGuest(evt.guest);
    });

    guestEventEmitter.on("clearOrder", (evt) => {
      this.enqueueNextGuest(evt.guest);
    });
  }

  override onDeactivate(context: SceneActivationContext): void {
    // Called when Excalibur transitions away from this scene
    // Only 1 scene is active at a time
    this.clear();
  }

  override onPreUpdate(engine: Engine, elapsedMs: number): void {
    if (!this.isDayActive) {
      return;
    }

    const now = Date.now();
    if (now - this.startTime >= this.maxTimeMS) {
      this.endDay();
      return;
    }

    const remainingSecondCount = this.timeCounter.getCount();
    if (now - this.startTime > this.maxTimeMS - remainingSecondCount * 1000) {
      this.timeCounter.setCount(Math.ceil(remainingSecondCount - 1));
    }

    if (this.queuedGuests.length === 0) {
      return;
    }

    // Find oldest available free slot
    const ageOrderedReadySlotKeys = Object.keys(this.guestSlot)
      .filter(
        (key) =>
          this.guestSlot[key].readyTime && this.guestSlot[key].readyTime <= now
      )
      .sort(
        (keyA, keyB) =>
          this.guestSlot[keyA].readyTime - this.guestSlot[keyB].readyTime
      );

    if (!ageOrderedReadySlotKeys.length) {
      return;
    }

    const slotKey = ageOrderedReadySlotKeys[0];

    const targetSlot = this.guestSlot[slotKey];

    let guest = this.dequeueGuest();

    // Put guest in appropriate slot
    guest.pos = targetSlot.pos;

    targetSlot.readyTime = 0;
    targetSlot.guest = guest;

    if (guest) {
      guest.onAddToScene();
      this.add(guest);
    }
  }

  private enqueueNextGuest(servedGuest: Guest) {
    this.numGuestsServed++;
    if (this.numGuestsServed === this.guestCount) {
      this.endDay();
      return;
    }

    if (this.allGuests.length === 0) {
      return;
    }

    const targetSlotKey = Object.keys(this.guestSlot).filter(
      (key) => this.guestSlot[key].guest === servedGuest
    )[0];

    // Prepare target slot
    this.guestSlot[targetSlotKey].readyTime = Date.now() + GUEST_SPAWN_TIME_MS;
    this.guestSlot[targetSlotKey].guest = null;

    const guestToQueue = this.allGuests.shift();
    this.queuedGuests.push(guestToQueue);
  }

  // Attempts to get next guest from queue, vetting that it still exists in the deck
  private dequeueGuest(): Guest | null {
    let guest = null;

    while (guest === null && this.queuedGuests.length > 0) {
      const candidate = this.queuedGuests.pop();

      const deckContainsCandidate = PlayerData.deck.some(
        (g) => g === candidate
      );
      if (deckContainsCandidate) {
        guest = candidate;
      } else if (this.allGuests.length > 0) {
        this.queuedGuests = [this.allGuests.shift()];
      }
    }
    return guest;
  }

  private endDay() {
    this.isDayActive = false;
    this.remove(this.glove);
    this.glove.kill();
    const button = new OpenShopButton();
    this.add(button);
  }
}
