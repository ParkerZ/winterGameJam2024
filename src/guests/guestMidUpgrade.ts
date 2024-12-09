import { GuestEventEmitter } from "@/events";
import { Guest } from "./guest";
import { Engine, Font, Label, vec } from "excalibur";
import { Reward } from "@/reward";
import { Resources } from "@/resources";
import { DifficultyOptions } from "./guestOrder";

export class GuestMidUpgrade extends Guest {
  constructor({ eventEmitter }: { eventEmitter?: GuestEventEmitter }) {
    super({
      eventEmitter,
      tooltipText: "Permanently\ngains +1 Buzz\nwhen served",
    });

    this.reward = new Reward({ buzz: 2 });
    this.difficulty = DifficultyOptions.Medium;
    this.sprite = Resources.Guest4.toSprite();
    this.sprite.scale = vec(0.5, 0.5);
    this.canBeAutoFulfilled = true;
  }

  override cleanup(engine: Engine<any>): void {
    super.cleanup(engine);

    this.reward = new Reward({ buzz: this.reward.buzz + 1 });
  }

  override getIcon(): Label | null {
    return new Label({
      text: `+`,
      font: new Font({ size: 24 }),
    });
  }
}
