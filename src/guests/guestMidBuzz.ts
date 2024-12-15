import { GuestEventEmitter } from "@/events";
import { Guest } from "./guest";
import { Reward } from "@/reward";
import { Resources } from "@/resources";
import { DifficultyOptions } from "./guestOrder";

export class GuestMidBuzz extends Guest {
  constructor({ eventEmitter }: { eventEmitter?: GuestEventEmitter }) {
    super({
      eventEmitter,
      tooltipText: "+3 Buzz",
      sprite: Resources.Guest3.toSprite(),
    });

    this.reward = new Reward({ buzz: 3 });
    this.difficulty = DifficultyOptions.Medium;
    this.canBeAutoFulfilled = true;
  }
}
