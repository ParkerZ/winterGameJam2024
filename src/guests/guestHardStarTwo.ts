import { GuestEventEmitter } from "@/events";
import { Guest } from "./guest";
import { vec } from "excalibur";
import { Reward } from "@/reward";
import { Resources } from "@/resources";
import { DifficultyOptions } from "./guestOrder";
import { PlayerData } from "@/playerData";

export class GuestHardStarTwo extends Guest {
  constructor({ eventEmitter }: { eventEmitter?: GuestEventEmitter }) {
    super({ eventEmitter });

    this.reward = new Reward({ star: 2 });
    this.difficulty = DifficultyOptions.Hard;
    this.sprite = Resources.Guest13.toSprite();
    this.sprite.scale = vec(0.5, 0.5);
    this.canBeAutoFulfilled = true;
  }

  override cleanup(): void {
    // Remove from deck after cleanup
    PlayerData.remove(this);
  }
}
