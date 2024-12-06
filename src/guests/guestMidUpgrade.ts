import { GuestEventEmitter } from "@/events";
import { Guest } from "./guest";
import { vec } from "excalibur";
import { Reward } from "@/reward";
import { Resources } from "@/resources";
import { DifficultyOptions } from "./guestOrder";

export class GuestMidUpgrade extends Guest {
  constructor({ eventEmitter }: { eventEmitter?: GuestEventEmitter }) {
    super({ eventEmitter });

    this.reward = new Reward({ buzz: 1 });
    this.difficulty = DifficultyOptions.Medium;
    this.sprite = Resources.Guest4.toSprite();
    this.sprite.scale = vec(0.5, 0.5);
  }

  override cleanup(): void {
    this.reward = new Reward({ buzz: this.reward.buzz + 1 });
  }
}
