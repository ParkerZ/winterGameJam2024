import { Vector, vec } from "excalibur";
import { Resources } from "../resources";
import { ApplianceEventEmitter } from "../events";
import { Appliance } from "./appliance";
import { Food } from "@/foodStuffs/food";
import { Tomato } from "@/foodStuffs/tomato";

export class TomatoCrate extends Appliance {
  constructor(applianceEventEmitter: ApplianceEventEmitter, pos: Vector) {
    const sprite = Resources.TomatoCrate.toSprite();
    super({
      eventEmitter: applianceEventEmitter,
      name: "TomatoCrate",
      sprite,
      pos,
    });

    this.heldItem = null;
  }

  public setHeldItem(incomingItem: Food): boolean {
    const canSetHeldItem = incomingItem instanceof Tomato;

    if (!canSetHeldItem) {
      return false;
    }

    incomingItem.unparent();

    return canSetHeldItem;
  }

  public getHeldItem(): Food | null {
    return new Tomato();
  }
}
