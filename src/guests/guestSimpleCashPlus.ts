import { GuestEventEmitter } from "@/events";
import { Guest } from "./guest";
import { Reward } from "@/reward";
import { Resources } from "@/resources";
import { DifficultyOptions } from "./guestOrder";

export class GuestSimpleCashPlus extends Guest {
  constructor({ eventEmitter }: { eventEmitter?: GuestEventEmitter }) {
    super({
      eventEmitter,
      label: "Executive",
      tooltipText: {
        cash: "+3 Cash",
      },
      sprite: Resources.Guest11.toSprite(),
    });

    this.reward = new Reward({ cash: 3 });
    this.difficulty = DifficultyOptions.Easy;
    this.canBeAutoFulfilled = true;
  }
}
