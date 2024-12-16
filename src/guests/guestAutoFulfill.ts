import { AbilityActivateEvent, GuestEventEmitter } from "@/events";
import { Guest, GuestStates } from "./guest";
import { Font, Label, vec } from "excalibur";
import { Reward } from "@/reward";
import { Resources } from "@/resources";
import { DifficultyOptions } from "./guestOrder";

export class GuestAutoFulfill extends Guest {
  constructor({ eventEmitter }: { eventEmitter?: GuestEventEmitter }) {
    super({
      eventEmitter,
      label: "Police Officer",
      tooltipText: {
        top: "Completes\nanother\nguest's order",
        difficulty: DifficultyOptions.None,
      },
      sprite: Resources.Guest10.toSprite(),
    });

    this.reward = new Reward({});
    this.difficulty = DifficultyOptions.None;
  }

  // TODO: add cancel option
  override activateAbility(): void {
    // Emit event so that glove knows to change interactions
    this.state = GuestStates.Activating;
    this.eventEmitter.emit("autoFulfillActivate", new AbilityActivateEvent());
    this.eventEmitter.on("autoFulfillConfirm", () => {
      if (this.state === GuestStates.Activating) {
        this.completeOrder();
      }
    });
  }

  override getIcon(): Label | null {
    return new Label({
      text: `@`,
      font: new Font({ size: 24 }),
    });
  }
}
