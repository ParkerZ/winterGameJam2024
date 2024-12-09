import { GuestEventEmitter } from "@/events";
import { Guest } from "./guest";
import { vec } from "excalibur";
import { Reward } from "@/reward";
import { Resources } from "@/resources";
import { DifficultyOptions } from "./guestOrder";

export class GuestMidCash extends Guest {
  constructor({ eventEmitter }: { eventEmitter?: GuestEventEmitter }) {
    super({ eventEmitter });

    this.reward = new Reward({ cash: 2 });
    this.difficulty = DifficultyOptions.Medium;
    this.sprite = Resources.Guest14.toSprite();
    this.sprite.scale = vec(0.5, 0.5);
    this.canBeAutoFulfilled = true;
  }
}
