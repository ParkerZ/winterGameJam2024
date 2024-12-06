import { GuestEventEmitter } from "@/events";
import { Guest } from "./guest";
import { vec } from "excalibur";
import { Reward } from "@/reward";
import { Resources } from "@/resources";
import { DifficultyOptions } from "./guestOrder";

export class GuestFreeBuzz extends Guest {
  constructor({ eventEmitter }: { eventEmitter?: GuestEventEmitter }) {
    super({ eventEmitter });

    this.reward = new Reward({ buzz: 1 });
    this.difficulty = DifficultyOptions.NA;
    this.sprite = Resources.Guest5.toSprite();
    this.sprite.scale = vec(0.5, 0.5);
  }

  override activateAbility(): void {
    this.completeOrder();
  }
}
