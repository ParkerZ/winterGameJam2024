import { GuestEventEmitter } from "@/events";
import { Guest } from "./guest";
import { Engine } from "excalibur";
import { Reward } from "@/reward";
import { Resources } from "@/resources";
import { DifficultyOptions } from "./guestOrder";
import { PlayerData } from "@/playerData";

export class GuestHardStar extends Guest {
  constructor({ eventEmitter }: { eventEmitter?: GuestEventEmitter }) {
    super({
      eventEmitter,
      label: "Critic",
      tooltipText: {
        top: "Awards a star\nthen removes\nself from\nyour invite\nlist",
        difficulty: DifficultyOptions.Hard,
      },
      sprite: Resources.Guest13.toSprite(),
    });

    this.reward = new Reward({ star: 1 });
    this.difficulty = DifficultyOptions.Hard;
    this.canBeAutoFulfilled = true;
  }

  override cleanup(engine: Engine<any>): void {
    super.cleanup(engine);

    // Remove from deck after cleanup
    PlayerData.remove(this, engine);
  }
}
