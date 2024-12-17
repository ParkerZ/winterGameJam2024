import { GuestEventEmitter } from "@/events";
import { Guest, GuestStates, TooltipText } from "./guest";
import {
  Engine,
  Font,
  Label,
  ScreenElement,
  TextAlign,
  Vector,
  vec,
} from "excalibur";
import { Reward } from "@/reward";
import { Resources, colorPrimaryBuzz } from "@/resources";
import { DifficultyOptions } from "./guestOrder";
import { GuestRemove } from "./guestRemove";
import { GuestAutoFulfill } from "./guestAutoFulfill";

const watchTooltip: TooltipText = {
  top: "Gains +2 Buzz\nper order\nserved while\nwaiting",
  buzz: "+2 Buzz",
  difficulty: DifficultyOptions.Easy,
};

export class GuestSimpleWatch extends Guest {
  constructor({ eventEmitter }: { eventEmitter?: GuestEventEmitter }) {
    super({
      eventEmitter,
      label: "Watcher",
      tooltipText: watchTooltip,
      sprite: Resources.Guest6.toSprite(),
      icon: Resources.IconWatch.toSprite(),
    });

    this.reward = new Reward({ buzz: 2 });
    this.difficulty = DifficultyOptions.Easy;
    this.canBeAutoFulfilled = true;
  }

  override attachEventEmitter(eventEmitter: GuestEventEmitter): void {
    super.attachEventEmitter(eventEmitter);

    // Reset reward to baseline
    this.reward = new Reward({ buzz: 1 });

    // Upgrade reward when an order is completed
    this.eventEmitter.on("clearOrder", (evt) => {
      // Skip if not in the store
      if (
        this.state !== GuestStates.Idle &&
        this.state !== GuestStates.Ordering
      ) {
        return;
      }

      // Skip if order was a Bouncer or Dasher
      if (
        evt.guest instanceof GuestRemove ||
        evt.guest instanceof GuestAutoFulfill
      ) {
        return;
      }

      // Skip own order
      if (evt.guest === this) {
        return;
      }

      this.reward = new Reward({ buzz: this.reward.buzz + 2 });
      this.updateTooltip({
        ...watchTooltip,
        buzz: `+${this.reward.buzz} Buzz`,
      });

      // Mega hacky overlaid icon
      const iconBacking = Resources.IconBacking.toSprite();
      iconBacking.scale = vec(0.55, 0.55);
      const box = new ScreenElement({ pos: vec(52, -17), anchor: Vector.Half });
      box.graphics.use(iconBacking);

      this.addChild(box);
      const label = new Label({
        pos: vec(60, -25),
        text: `${this.reward.buzz}`,
        font: new Font({
          family: "Kaph",
          size: 18,
          color: colorPrimaryBuzz,
          textAlign: TextAlign.Right,
        }),
      });
      this.addChild(label);
    });
  }
}
