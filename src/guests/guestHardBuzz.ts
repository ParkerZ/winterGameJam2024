import { GuestEventEmitter } from "@/events";
import { Guest } from "./guest";
import { Reward } from "@/reward";
import { Resources } from "@/resources";
import { DifficultyOptions } from "./guestOrder";

export class GuestHardBuzz extends Guest {
  constructor({ eventEmitter }: { eventEmitter?: GuestEventEmitter }) {
    super({
      eventEmitter,
      label: "Celebrity",
      tooltipText: {
        buzz: "+6 Buzz",
        difficulty: DifficultyOptions.Hard,
      },
      sprite: Resources.Guest8.toSprite(),
    });

    this.reward = new Reward({ buzz: 6 });
    this.difficulty = DifficultyOptions.Hard;
    this.canBeAutoFulfilled = true;
  }
}
