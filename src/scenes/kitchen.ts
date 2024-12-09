import { Engine, Scene, SceneActivationContext, Vector, vec } from "excalibur";
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
  // protected lastGuestTime: number = 0;
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
      pos: vec(600, 100),
      readyTime: 0,
      guest: null,
    },
    slot2: {
      pos: vec(400, 100),
      readyTime: 0,
      guest: null,
    },
    slot3: {
      pos: vec(200, 100),
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
    // this.lastGuestTime = 0;
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
    this.allGuests.forEach((g) => g.attachEventEmitter(guestEventEmitter));

    // Take 3 to seed level
    this.queuedGuests = [...Array(3)].map((_e, i) => {
      const guest = this.allGuests.pop();
      return guest;
    });

    const buzzCounter = new BuzzCounter(vec(25, 5));
    const cashCounter = new CashCounter(vec(25, 35));
    const dayCounter = new DayCounter(vec(25, 65));
    const starCounter = new StarCounter(vec(25, 95));
    this.timeCounter = new TimeCounter(
      Math.ceil(this.maxTimeMS / 1000),
      vec(700, 5)
    );

    const fridge = new Fridge(applianceEventEmitter, vec(100, 250));
    const counter1 = new Counter(applianceEventEmitter, vec(250, 250));
    const counter2 = new Counter(applianceEventEmitter, vec(400, 250));
    const counter3 = new Counter(applianceEventEmitter, vec(550, 250));
    const stove = new Stove(applianceEventEmitter, vec(700, 250));
    const bunCrate = new BunCrate(applianceEventEmitter, vec(100, 500));
    const tomatoCrate = new TomatoCrate(applianceEventEmitter, vec(250, 500));
    const lettuceCrate = new LettuceCrate(applianceEventEmitter, vec(400, 500));
    const cheeseCrate = new CheeseCrate(applianceEventEmitter, vec(550, 500));
    const trash = new Trash(applianceEventEmitter, vec(700, 500));
    this.glove = new Glove(applianceEventEmitter, guestEventEmitter);

    this.add(buzzCounter);
    this.add(cashCounter);
    this.add(dayCounter);
    this.add(starCounter);
    this.add(this.timeCounter);

    this.add(fridge);
    this.add(counter1);
    this.add(counter2);
    this.add(counter3);
    this.add(stove);
    this.add(bunCrate);
    this.add(tomatoCrate);
    this.add(lettuceCrate);
    this.add(cheeseCrate);
    this.add(trash);

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

    // Object.keys(this.guestSlotLastTime).forEach((slotKey) => {
    //   if (!this.guestSlotLastTime[slotKey]) {
    //     this.guestSlotLastTime[slotKey] = now;
    //   }
    // });

    // if (!this.lastGuestTime) {
    //   this.lastGuestTime = now;
    //   return;
    // }

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

    console.log(
      "SPAWNING GUEST",
      targetSlot,
      PlayerData.deck,
      this.allGuests,
      this.queuedGuests
    );

    let guest = this.dequeueGuest();

    // Put guest in appropriate slot
    guest.pos = targetSlot.pos;

    targetSlot.readyTime = 0;
    targetSlot.guest = guest;

    if (guest) {
      guest.onAddToScene();
      this.add(guest);
    }
    // }

    // if (now - this.lastGuestTime >= GUEST_SPAWN_TIME_MS) {
    //   console.log(
    //     "SPAWNING GUEST",
    //     PlayerData.deck,
    //     this.allGuests,
    //     this.queuedGuests
    //   );
    //   this.lastGuestTime = 0;

    //   let guest = this.dequeueGuest();

    //   if (guest) {
    //     guest.onAddToScene();
    //     this.add(guest);
    //   }
    // }
  }

  private enqueueNextGuest(servedGuest: Guest) {
    this.numGuestsServed++;
    console.log(
      "Guets served",
      servedGuest,
      this.numGuestsServed,
      this.guestCount,
      PlayerData.deck
    );
    // TODO: this might still be wrong
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

    const guestToQueue = this.allGuests.pop();
    // guestToQueue.pos = evt.guest.globalPos;
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
        this.queuedGuests = [this.allGuests.pop()];
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
