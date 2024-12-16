import { GuestEventEmitter } from "@/events";
import { Guest } from "./guest";
import { Engine, Font, Label } from "excalibur";
import { Reward } from "@/reward";
import { Resources } from "@/resources";
import { DifficultyOptions } from "./guestOrder";

// TODO: figure out growing tooltip
export class GuestMidUpgrade extends Guest {
  constructor({ eventEmitter }: { eventEmitter?: GuestEventEmitter }) {
    super({
      eventEmitter,
      label: "Supporter",
      tooltipText: {
        top: "Permanently\ngains +1 Buzz\nwhen served",
        buzz: "+1 Buzz",
        difficulty: DifficultyOptions.Medium,
      },
      sprite: Resources.Guest7.toSprite(),
    });

    this.reward = new Reward({ buzz: 2 });
    this.difficulty = DifficultyOptions.Medium;
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
