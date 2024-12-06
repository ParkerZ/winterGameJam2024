import { GuestEventEmitter } from "@/events";
import { Guest } from "./guest";
import { vec } from "excalibur";
import { Reward } from "@/reward";
import { Resources } from "@/resources";
import { DifficultyOptions } from "./guestOrder";

export class GuestSimpleCash extends Guest {
  constructor({ eventEmitter }: { eventEmitter?: GuestEventEmitter }) {
    super({ eventEmitter });

    this.reward = new Reward({ cash: 1 });
    this.difficulty = DifficultyOptions.Easy;
    this.sprite = Resources.Guest2.toSprite();
    this.sprite.scale = vec(0.5, 0.5);
  }
}
