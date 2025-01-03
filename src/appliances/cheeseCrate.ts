import { Vector, vec } from "excalibur";
import { Resources, grabVolume } from "../resources";
import { ApplianceEventEmitter } from "../events";
import { Appliance } from "./appliance";
import { Food } from "@/foodStuffs/food";
import { Cheese } from "@/foodStuffs/cheese";

export class CheeseCrate extends Appliance {
  constructor(applianceEventEmitter: ApplianceEventEmitter, pos: Vector) {
    const sprite = Resources.CheeseCrate.toSprite();
    super({
      eventEmitter: applianceEventEmitter,
      name: "CheeseCrate",
      sprite,
      pos,
    });

    this.heldItem = null;
  }

  public setHeldItem(incomingItem: Food): boolean {
    const canSetHeldItem = incomingItem instanceof Cheese;

    if (!canSetHeldItem) {
      return false;
    }

    incomingItem.unparent();

    return canSetHeldItem;
  }

  public getHeldItem(): Food | null {
    return new Cheese();
  }
}
