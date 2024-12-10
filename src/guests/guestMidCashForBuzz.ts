import { GuestEventEmitter } from "@/events";
import { Guest } from "./guest";
import { vec } from "excalibur";
import { Reward } from "@/reward";
import { Resources } from "@/resources";
import { DifficultyOptions } from "./guestOrder";

export class GuestMidCashForBuzz extends Guest {
  constructor({ eventEmitter }: { eventEmitter?: GuestEventEmitter }) {
    super({ eventEmitter, tooltipText: "+4 Buzz\n-1 $" });

    this.reward = new Reward({ buzz: 4, cash: -1 });
    this.difficulty = DifficultyOptions.Medium;
    this.sprite = Resources.Guest8.toSprite();
    this.sprite.scale = vec(0.5, 0.5);
    this.canBeAutoFulfilled = true;
  }
}
