import { GuestEventEmitter } from "@/events";
import { Guest } from "./guest";
import { vec } from "excalibur";
import { Reward } from "@/reward";
import { Resources } from "@/resources";
import { DifficultyOptions } from "./guestOrder";

export class GuestSimpleCashPlus extends Guest {
  constructor({ eventEmitter }: { eventEmitter?: GuestEventEmitter }) {
    super({ eventEmitter });

    this.reward = new Reward({ cash: 3 });
    this.difficulty = DifficultyOptions.Easy;
    this.sprite = Resources.Guest10.toSprite();
    this.sprite.scale = vec(0.5, 0.5);
    this.canBeAutoFulfilled = true;
  }
}
