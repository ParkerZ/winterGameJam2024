import { GuestEventEmitter } from "@/events";
import { Guest } from "./guest";
import { Reward } from "@/reward";
import { Resources } from "@/resources";
import { DifficultyOptions } from "./guestOrder";

export class GuestFreeBuzz extends Guest {
  constructor({ eventEmitter }: { eventEmitter?: GuestEventEmitter }) {
    super({
      eventEmitter,
      label: "Chatterbox",
      tooltipText: {
        top: "Orders no\nfood",
        buzz: "+1 Buzz",
        difficulty: DifficultyOptions.None,
      },
      sprite: Resources.Guest4.toSprite(),
    });

    this.reward = new Reward({ buzz: 1 });
    this.difficulty = DifficultyOptions.None;
    this.canBeAutoFulfilled = true;
  }

  override activateAbility(): void {
    this.completeOrder();
  }
}
