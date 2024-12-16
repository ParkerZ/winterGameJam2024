import { GuestEventEmitter } from "@/events";
import { Guest } from "./guest";
import { vec } from "excalibur";
import { Reward } from "@/reward";
import { Resources } from "@/resources";
import { DifficultyOptions } from "./guestOrder";

export class GuestSimpleBuzz extends Guest {
  constructor({ eventEmitter }: { eventEmitter?: GuestEventEmitter }) {
    super({
      eventEmitter,
      label: "Old Friend",
      tooltipText: {
        buzz: "+1 Buzz",
        difficulty: DifficultyOptions.Easy,
      },
      sprite: Resources.Guest1.toSprite(),
    });

    this.reward = new Reward({ buzz: 1 });
    this.difficulty = DifficultyOptions.Easy;
    this.canBeAutoFulfilled = true;
  }
}
