import { AbilityActivateEvent, GuestEventEmitter } from "@/events";
import { Guest, GuestStates } from "./guest";
import { Font, Label, vec } from "excalibur";
import { Reward } from "@/reward";
import { Resources } from "@/resources";
import { DifficultyOptions } from "./guestOrder";

export class GuestRemove extends Guest {
  constructor({ eventEmitter }: { eventEmitter?: GuestEventEmitter }) {
    super({ eventEmitter, tooltipText: "Removes any\nguest" });

    this.reward = new Reward({});
    this.difficulty = DifficultyOptions.NA;
    this.sprite = Resources.Guest7.toSprite();
    this.sprite.scale = vec(0.5, 0.5);
  }

  override activateAbility(): void {
    // Emit event so that glove knows to change interactions
    this.state = GuestStates.Activating;
    this.eventEmitter.emit("removeActivate", new AbilityActivateEvent());
    this.eventEmitter.on("removeConfirm", () => {
      if (this.state === GuestStates.Activating) {
        this.completeOrder();
      }
    });
  }

  override getIcon(): Label | null {
    return new Label({
      text: `X`,
      font: new Font({ size: 24 }),
    });
  }
}
