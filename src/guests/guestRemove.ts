import { GuestEventEmitter } from "@/events";
import { Guest } from "./guest";
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
      icon: Resources.IconCancel.toSprite(),
    });

    this.reward = new Reward({});
    this.difficulty = DifficultyOptions.None;
    this.eventAbilityActivate = "removeActivate";
    this.eventAbilityConfirm = "removeConfirm";
  }

  override getIcon(): Label | null {
    return new Label({
      text: `X`,
      font: new Font({ size: 24 }),
    });
  }
}
