import { GuestEventEmitter } from "@/events";
import { Guest, TooltipText } from "./guest";
import { Engine, Font, Label } from "excalibur";
import { Reward } from "@/reward";
import { Resources } from "@/resources";
import { DifficultyOptions } from "./guestOrder";

const updateTooltip: TooltipText = {
  top: "Permanently\ngains +1 Buzz\nwhen served",
  buzz: "+2 Buzz",
  difficulty: DifficultyOptions.Medium,
};

export class GuestMidUpgrade extends Guest {
  constructor({ eventEmitter }: { eventEmitter?: GuestEventEmitter }) {
    super({
      eventEmitter,
      label: "Supporter",
      tooltipText: updateTooltip,
      sprite: Resources.Guest7.toSprite(),
      icon: Resources.IconUpgrade.toSprite(),
    });

    this.reward = new Reward({ buzz: 2 });
    this.difficulty = DifficultyOptions.Medium;
    this.canBeAutoFulfilled = true;
  }

  override cleanup(engine: Engine<any>): void {
    super.cleanup(engine);

    this.reward = new Reward({ buzz: this.reward.buzz + 1 });
    this.updateTooltip({ ...updateTooltip, buzz: `+${this.reward.buzz} Buzz` });
  }
}
