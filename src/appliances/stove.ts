import { vec } from "excalibur";
import { Resources } from "../resources";
import { ApplianceEventEmitter, InteractEvent } from "../events";
import { Appliance } from "./appliance";

export class Stove extends Appliance {
  constructor(applianceEventEmitter: ApplianceEventEmitter) {
    const sprite = Resources.Stove.toSprite();
    sprite.scale = vec(0.5, 0.5);
    super({
      eventEmitter: applianceEventEmitter,
      name: "Stove",
      sprite,
      pos: vec(550, 150),
    });

    this.heldItem = null;
  }

  public setHeldItem(incomingItem: string): boolean {
    const canSetHeldItem =
      this.heldItem === null && ["mince", "burger"].includes(incomingItem);
    console.log("stove setting held...", canSetHeldItem);
    if (!canSetHeldItem) {
      return false;
    }

    this.heldItem = incomingItem;
    return true;
  }

  public getHeldItem(): string | null {
    const item = this.heldItem;
    this.heldItem = null;
    console.log("stove getting held...", item);
    return item;
  }
}
