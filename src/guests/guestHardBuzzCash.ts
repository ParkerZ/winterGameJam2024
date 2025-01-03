import { GuestEventEmitter } from "@/events";
import { Guest } from "./guest";
import { Reward } from "@/reward";
import { Resources } from "@/resources";
import { DifficultyOptions } from "./guestOrder";

export class GuestHardBuzzCash extends Guest {
  constructor({ eventEmitter }: { eventEmitter?: GuestEventEmitter }) {
    super({
      eventEmitter,
      label: "Retiree",
      tooltipText: {
        buzz: "+4 Buzz",
        cash: "+3 Cash",
        difficulty: DifficultyOptions.Hard,
      },
      sprite: Resources.Guest9.toSprite(),
    });

    this.reward = new Reward({ buzz: 4, cash: 3 });
    this.difficulty = DifficultyOptions.Hard;
    this.canBeAutoFulfilled = true;
  }
}
