import { vec } from "excalibur";
import { Resources } from "../resources";
import { ApplianceEventEmitter, InteractEvent } from "../events";
import { Appliance } from "./appliance";

export class Fridge extends Appliance {
  constructor(applianceEventEmitter: ApplianceEventEmitter) {
    const sprite = Resources.Fridge.toSprite();
    sprite.scale = vec(0.5, 0.5);
    super({
      eventEmitter: applianceEventEmitter,
      name: "Fridge",
      sprite,
      pos: vec(150, 150),
    });

    this.heldItem = "mince";
  }

  public setHeldItem(incomingItem: string): boolean {
    const canSetHeldItem = incomingItem === "mince";
    console.log("fridge setting held...", canSetHeldItem);
    return canSetHeldItem;
  }

  public getHeldItem(): string | null {
    console.log("fridge getting held...", this.heldItem);
    return this.heldItem;
  }
}
