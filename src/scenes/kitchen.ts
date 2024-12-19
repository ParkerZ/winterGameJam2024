import {
  Actor,
  Engine,
  Font,
  Label,
  Resource,
  Scene,
  SceneActivationContext,
  ScreenElement,
  TextAlign,
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
import { BuzzCounter } from "@/ui/buzzCounter";
import { CashCounter } from "@/ui/cashCounter";
import { DayCounter } from "@/ui/dayCounter";
import { LettuceCrate } from "@/appliances/lettuceCrate";
import { StarCounter } from "@/ui/starCounter";
import {
  Resources,
  allGuestsServedVolume,
  dayEndVolume,
  musicVolume,
  spriteScale,
} from "@/resources";
import { StatusBar } from "@/ui/statusBar";
import { DeckCounter } from "@/ui/deckCounter";
import { GuestHardStar } from "@/guests/guestHardStar";
import { DayCompleteModal } from "@/ui/dayCompleteModal";

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
  protected timeBar: StatusBar;

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
    Resources.musicKitchen.play(musicVolume);

    PlayerData.day += 1;
    this.guestCount = PlayerData.deck.length;
    this.numGuestsServed = 0;
    this.isDayActive = true;
    this.startTime = Date.now();
    const now = Date.now();
    Object.keys(this.guestSlot).forEach((key, i) => {
      this.guestSlot[key].readyTime = now + i * GUEST_SPAWN_TIME_MS;
    });
    this.timeBar = new StatusBar({
      x: 477,
      y: 555,
      z: 2,
      maxVal: this.maxTimeMS,
      size: "lg",
    });
    this.add(this.timeBar);

    const timeLabel = new ScreenElement({ pos: vec(85, 522), z: 5 });
    const timeLabelSprite = Resources.TimeLabel.toSprite();
    timeLabelSprite.scale = vec(0.75, 0.75);
    timeLabel.graphics.use(timeLabelSprite);
    this.add(timeLabel);

    // Create shared event emitter to connect appliance interactions to player
    const applianceEventEmitter = new ApplianceEventEmitter();

    // Create shared event emitter to connect order interactions to player
    const guestEventEmitter = new GuestEventEmitter();

    // Create array of orders
    this.allGuests = shuffleArray(PlayerData.deck.slice());

    const starIndex = this.allGuests.findIndex(
      (g) => g instanceof GuestHardStar
    );

    // Put star guests in the 4th or 5th spot if possible
    if (starIndex > -1 && this.allGuests.length > 4) {
      const guest = this.allGuests.splice(starIndex, 1)[0];
      this.allGuests.splice(3 + Math.floor(Math.random() * 2), 0, guest);
    }

    this.allGuests.forEach((g) => g.attachEventEmitter(guestEventEmitter));

    // Take 3 guests to seed level
    this.queuedGuests = [...Array(3)].map((_e, i) => {
      const guest = this.allGuests.shift();
      return guest;
    });

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
    Resources.musicKitchen.stop();
    this.clear();
  }

  override onPreUpdate(engine: Engine, elapsedMs: number): void {
    if (PlayerData.star >= 3) {
      engine.goToScene("gameOver");
    }

    if (!this.isDayActive) {
      return;
    }

    const now = Date.now();
    if (now - this.startTime >= this.maxTimeMS) {
      Resources.soundDayEnd.play(dayEndVolume);
      this.endDay("You ran out of time...");
      return;
    }

    this.timeBar.setCurrVal(this.maxTimeMS - (now - this.startTime));

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
      Resources.soundAllGuestsServed.play(allGuestsServedVolume);
      this.endDay("You served all of\nyour guests!");
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

  private endDay(text: string) {
    this.isDayActive = false;
    this.remove(this.glove);
    this.glove.kill();
    PlayerData.deck.forEach((g) => {
      this.remove(g);
      g.kill();
    });
    const modal = new DayCompleteModal({ text });
    this.add(modal);
  }
}
