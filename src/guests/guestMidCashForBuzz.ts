import { GuestEventEmitter } from "@/events";
import { Guest } from "./guest";
import { Reward } from "@/reward";
import { Resources } from "@/resources";
import { DifficultyOptions } from "./guestOrder";

export class GuestMidCashForBuzz extends Guest {
  constructor({ eventEmitter }: { eventEmitter?: GuestEventEmitter }) {
    super({
      eventEmitter,
      label: "Influencer",
      tooltipText: {
        buzz: "+4 Buzz",
        cash: "-1 Cash",
        difficulty: DifficultyOptions.Medium,
      },
      sprite: Resources.Guest5.toSprite(),
    });

    this.reward = new Reward({ buzz: 4, cash: -1 });
    this.difficulty = DifficultyOptions.Medium;
    this.canBeAutoFulfilled = true;
  }
}
