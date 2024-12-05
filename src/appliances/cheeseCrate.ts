import { vec } from "excalibur";
import { Resources } from "../resources";
import { ApplianceEventEmitter } from "../events";
import { Appliance } from "./appliance";
import { Food } from "@/foodStuffs/food";
import { Cheese } from "@/foodStuffs/cheese";

export class CheeseCrate extends Appliance {
  constructor(applianceEventEmitter: ApplianceEventEmitter) {
    const sprite = Resources.CheeseCrate.toSprite();
    sprite.scale = vec(0.5, 0.5);
    super({
      eventEmitter: applianceEventEmitter,
      name: "CheeseCrate",
      sprite,
      pos: vec(500, 500),
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
