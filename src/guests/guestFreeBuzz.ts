import { GuestEventEmitter } from "@/events";
import { Guest } from "./guest";
import { Font, Label, vec } from "excalibur";
import { Reward } from "@/reward";
import { Resources } from "@/resources";
import { DifficultyOptions } from "./guestOrder";

export class GuestFreeBuzz extends Guest {
  constructor({ eventEmitter }: { eventEmitter?: GuestEventEmitter }) {
    super({
      eventEmitter,
      tooltipText: "+1 Buzz",
      sprite: Resources.Guest4.toSprite(),
    });

    this.reward = new Reward({ buzz: 1 });
    this.difficulty = DifficultyOptions.NA;
    this.canBeAutoFulfilled = true;
  }

  override activateAbility(): void {
    this.completeOrder();
  }

  override getIcon(): Label | null {
    return new Label({
      text: `:)`,
      font: new Font({ size: 24 }),
    });
  }
}
