import { GuestEventEmitter } from "@/events";
import { Guest } from "./guest";
import { Engine, vec } from "excalibur";
import { Reward } from "@/reward";
import { Resources } from "@/resources";
import { DifficultyOptions } from "./guestOrder";
import { PlayerData } from "@/playerData";

export class GuestHardStarTwo extends Guest {
  constructor({ eventEmitter }: { eventEmitter?: GuestEventEmitter }) {
    super({
      eventEmitter,
      tooltipText: "Gives 2nd star\nthen removes\nfrom deck",
    });

    this.reward = new Reward({ star: 2 });
    this.difficulty = DifficultyOptions.Hard;
    this.sprite = Resources.Guest13.toSprite();
    this.sprite.scale = vec(0.5, 0.5);
    this.canBeAutoFulfilled = true;
  }

  override cleanup(engine: Engine<any>): void {
    super.cleanup(engine);

    // Remove from deck after cleanup
    PlayerData.remove(this, engine);
  }
}
