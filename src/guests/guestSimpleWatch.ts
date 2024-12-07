import { GuestEventEmitter } from "@/events";
import { Guest, GuestStates } from "./guest";
import { Engine, vec } from "excalibur";
import { Reward } from "@/reward";
import { Resources } from "@/resources";
import { DifficultyOptions } from "./guestOrder";
import { GuestRemove } from "./guestRemove";
import { GuestAutoFulfill } from "./guestAutoFulfill";

export class GuestSimpleWatch extends Guest {
  constructor({ eventEmitter }: { eventEmitter?: GuestEventEmitter }) {
    super({ eventEmitter });

    this.reward = new Reward({ buzz: 1 });
    this.difficulty = DifficultyOptions.Easy;
    this.sprite = Resources.Guest12.toSprite();
    this.sprite.scale = vec(0.5, 0.5);
  }

  override attachEventEmitter(eventEmitter: GuestEventEmitter): void {
    super.attachEventEmitter(eventEmitter);

    // Upgrade reward when an order is completed
    this.eventEmitter.on("clearOrder", (evt) => {
      // Skip if not in the store
      if (
        this.state !== GuestStates.Idle &&
        this.state !== GuestStates.Ordering
      ) {
        return;
      }

      // Skip if order was a Bouncer or Dasher
      if (
        evt.guest instanceof GuestRemove ||
        evt.guest instanceof GuestAutoFulfill
      ) {
        return;
      }

      // Skip own order
      if (evt.guest === this) {
        return;
      }

      this.reward = new Reward({ buzz: this.reward.buzz + 1 });
    });
  }

  override onInitialize(engine: Engine<any>): void {
    super.onInitialize(engine);

    // Reset reward to baseline
    this.reward = new Reward({ buzz: 1 });
  }
}
