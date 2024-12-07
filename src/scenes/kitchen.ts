import { Engine, Scene, SceneActivationContext, vec } from "excalibur";
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

export class Kitchen extends Scene {
  protected allGuests: Array<Guest> = [];
  protected queuedGuests: Array<Guest> = [];
  protected lastGuestTime: number = 0;
  protected numGuestsServed = 0;

  override onInitialize(engine: Engine): void {}

  override onActivate(context: SceneActivationContext<unknown>): void {
    this.numGuestsServed = 0;
    this.lastGuestTime = 0;

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
      guest.pos = vec(200 + 200 * i, 100);
      console.log("guest pos", guest.pos);
      return guest;
    });

    console.log("all guests", this.allGuests);
    console.log("queued guests", this.queuedGuests);

    const buzzCounter = new BuzzCounter(vec(25, 25));
    const cashCounter = new CashCounter(vec(25, 75));

    const fridge = new Fridge(applianceEventEmitter, vec(100, 250));
    const counter1 = new Counter(applianceEventEmitter, vec(300, 250));
    const counter2 = new Counter(
      applianceEventEmitter,
      counter1.pos.add(vec(200, 0))
    );
    const stove = new Stove(applianceEventEmitter, vec(700, 250));
    const bunCrate = new BunCrate(applianceEventEmitter, vec(100, 500));
    const tomatoCrate = new TomatoCrate(applianceEventEmitter, vec(300, 500));
    const cheeseCrate = new CheeseCrate(applianceEventEmitter, vec(500, 500));
    const trash = new Trash(applianceEventEmitter, vec(700, 500));
    const glove = new Glove(applianceEventEmitter, guestEventEmitter);

    this.add(buzzCounter);
    this.add(cashCounter);

    this.add(fridge);
    this.add(counter1);
    this.add(counter2);
    this.add(stove);
    this.add(bunCrate);
    this.add(tomatoCrate);
    this.add(cheeseCrate);
    this.add(trash);

    this.add(glove);

    guestEventEmitter.on("clearOrder", (evt) => {
      this.numGuestsServed++;
      if (this.numGuestsServed === PlayerData.deck.length) {
        glove.kill();
        this.remove(glove);
        const button = new OpenShopButton();
        this.add(button);
        return;
      }

      if (this.allGuests.length === 0) {
        return;
      }

      const guestToQueue = this.allGuests.pop();
      guestToQueue.pos = evt.guest.globalPos;
      this.queuedGuests.push(guestToQueue);
    });
  }

  override onDeactivate(context: SceneActivationContext): void {
    // Called when Excalibur transitions away from this scene
    // Only 1 scene is active at a time
    this.clear();
  }

  override onPreUpdate(engine: Engine, elapsedMs: number): void {
    if (this.queuedGuests.length === 0) {
      return;
    }

    const now = Date.now();
    if (!this.lastGuestTime) {
      this.lastGuestTime = now;
      return;
    }

    if (now - this.lastGuestTime >= 2000) {
      this.lastGuestTime = 0;
      const guest = this.queuedGuests.pop();
      guest.onAddToScene();
      this.add(guest);
    }
  }
}
