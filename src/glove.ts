import { Actor, Engine, EventEmitter, vec } from "excalibur";
import { Resources } from "./resources";
import { Fridge } from "./appliances/fridge";
import { ApplianceEventEmitter } from "./events";
import { Appliance } from "./appliances/appliance";

export class Glove extends Actor {
  protected heldItem: string | null;
  protected applianceEventEmitter: ApplianceEventEmitter;

  constructor(applianceEventEmitter: ApplianceEventEmitter) {
    super({
      name: "Glove",
      x: 2,
    });

    this.applianceEventEmitter = applianceEventEmitter;

    this.heldItem = null;
  }

  onInitialize(engine: Engine<any>): void {
    const sprite = Resources.Glove.toSprite();
    sprite.scale = vec(0.5, 0.5);
    this.graphics.use(sprite);

    this.applianceEventEmitter.on("interact", (evt) => {
      this.onInteractWithAppliance(evt.appliance);
    });
  }

  onPreUpdate(engine: Engine<any>, elapsedMs: number): void {
    this.pos = engine.input.pointers.primary.lastWorldPos;
  }

  public onInteractWithAppliance(appliance: Appliance) {
    console.log("BEFORE", this.heldItem);
    if (this.heldItem) {
      const giveSuccess = appliance.setHeldItem(this.heldItem);
      if (giveSuccess) {
        this.heldItem = null;
      }
    } else {
      const takenItem = appliance.getHeldItem();
      if (takenItem) {
        this.heldItem = takenItem;
      }
    }

    console.log("AFTER", this.heldItem);
  }
}
