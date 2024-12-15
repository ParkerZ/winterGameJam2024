import { Vector, vec } from "excalibur";
import { Resources } from "../resources";
import { ApplianceEventEmitter } from "../events";
import { Appliance } from "./appliance";
import { Food } from "@/foodStuffs/food";
import { Bun } from "@/foodStuffs/bun";

export class BunCrate extends Appliance {
  constructor(applianceEventEmitter: ApplianceEventEmitter, pos: Vector) {
    const sprite = Resources.BunCrate.toSprite();
    super({
      eventEmitter: applianceEventEmitter,
      name: "BunCrate",
      sprite,
      pos,
    });

    this.heldItem = null;
  }

  public setHeldItem(incomingItem: Food): boolean {
    const canSetHeldItem = incomingItem instanceof Bun;

    if (!canSetHeldItem) {
      return false;
    }

    incomingItem.unparent();

    return canSetHeldItem;
  }

  public getHeldItem(): Food | null {
    return new Bun();
  }
}
