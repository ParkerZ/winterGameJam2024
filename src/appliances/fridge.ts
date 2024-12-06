import { Vector, vec } from "excalibur";
import { Resources } from "../resources";
import { ApplianceEventEmitter } from "../events";
import { Appliance } from "./appliance";
import { Mince } from "@/foodStuffs/mince";
import { Food } from "@/foodStuffs/food";

export class Fridge extends Appliance {
  constructor(applianceEventEmitter: ApplianceEventEmitter, pos: Vector) {
    const sprite = Resources.Fridge.toSprite();
    sprite.scale = vec(0.5, 0.5);
    super({
      eventEmitter: applianceEventEmitter,
      name: "Fridge",
      sprite,
      pos,
    });

    this.heldItem = null;
  }

  public setHeldItem(incomingItem: Food): boolean {
    const canSetHeldItem = incomingItem instanceof Mince;

    if (!canSetHeldItem) {
      return false;
    }

    incomingItem.unparent();

    return canSetHeldItem;
  }

  public getHeldItem(): Food | null {
    return new Mince();
  }
}
