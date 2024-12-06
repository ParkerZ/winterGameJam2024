import { GuestEventEmitter } from "@/events";
import { Guest } from "./guest";
import { vec } from "excalibur";
import { Reward } from "@/reward";
import { Resources } from "@/resources";
import { DifficultyOptions } from "./guestOrder";

export class GuestMidBuzz extends Guest {
  constructor({ eventEmitter }: { eventEmitter?: GuestEventEmitter }) {
    super({ eventEmitter });

    this.reward = new Reward({ buzz: 2 });
    this.difficulty = DifficultyOptions.Medium;
    this.sprite = Resources.Guest3.toSprite();
    this.sprite.scale = vec(0.5, 0.5);
  }
}
