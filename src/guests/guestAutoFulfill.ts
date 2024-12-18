import { GuestEventEmitter } from "@/events";
import { Guest } from "./guest";
import { Font, Label } from "excalibur";
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
      icon: Resources.IconBell.toSprite(),
    });

    this.reward = new Reward({});
    this.difficulty = DifficultyOptions.None;

    this.eventAbilityActivate = "autoFulfillActivate";
    this.eventAbilityConfirm = "autoFulfillConfirm";
  }

  override getIcon(): Label | null {
    return new Label({
      text: `@`,
      font: new Font({ size: 24 }),
    });
  }
}
