import { Engine, Vector, vec } from "excalibur";
import { Resources, cutoutScale, spriteScale } from "../resources";
import { ApplianceEventEmitter } from "../events";
import { Appliance } from "./appliance";
import { Mince } from "@/foodStuffs/mince";
import { Food } from "@/foodStuffs/food";

export class Fridge extends Appliance {
  constructor(applianceEventEmitter: ApplianceEventEmitter, pos: Vector) {
    const sprite = Resources.Fridge.toSprite();
    super({
      eventEmitter: applianceEventEmitter,
      name: "Fridge",
      sprite,
      pos,
    });

    this.heldItem = null;
    this.sprite.scale = cutoutScale;
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
