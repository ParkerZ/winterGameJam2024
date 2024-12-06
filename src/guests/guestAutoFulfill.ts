import { AutoFulfillEvent, GuestEventEmitter } from "@/events";
import { Guest, GuestStates } from "./guest";
import { vec } from "excalibur";
import { Reward } from "@/reward";
import { Resources } from "@/resources";
import { DifficultyOptions } from "./guestOrder";

export class GuestAutoFulfill extends Guest {
  constructor({ eventEmitter }: { eventEmitter?: GuestEventEmitter }) {
    super({ eventEmitter });

    this.reward = new Reward({});
    this.difficulty = DifficultyOptions.NA;
    this.sprite = Resources.Guest6.toSprite();
    this.sprite.scale = vec(0.5, 0.5);
  }

  // TODO: add cancel option
  override activateAbility(): void {
    // Emit event so that glove knows to change interactions
    this.state = GuestStates.Activating;
    this.eventEmitter.emit("autoFulfillActivate", new AutoFulfillEvent());
    this.eventEmitter.on("autoFulfillDeactivate", () => {
      this.completeOrder();
    });
  }
}
