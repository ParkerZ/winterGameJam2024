import { AbilityActivateEvent, GuestEventEmitter } from "@/events";
import { Guest, GuestStates } from "./guest";
import { Font, Label } from "excalibur";
import { Reward } from "@/reward";
import { Resources } from "@/resources";
import { DifficultyOptions } from "./guestOrder";

export class GuestRemove extends Guest {
  constructor({ eventEmitter }: { eventEmitter?: GuestEventEmitter }) {
    super({
      eventEmitter,
      label: "Meanie",
      tooltipText: {
        top: "Removes a\nguest from\nyour invite\nlist",
        difficulty: DifficultyOptions.None,
      },
      sprite: Resources.Guest12.toSprite(),
    });

    this.reward = new Reward({});
    this.difficulty = DifficultyOptions.None;
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
