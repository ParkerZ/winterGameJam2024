import { vec } from "excalibur";
import { Resources } from "../resources";
import { ApplianceEventEmitter } from "../events";
import { Appliance } from "./appliance";
import { Food } from "@/foodStuffs/food";
import { Tomato } from "@/foodStuffs/tomato";

export class TomatoCrate extends Appliance {
  constructor(applianceEventEmitter: ApplianceEventEmitter) {
    const sprite = Resources.TomatoCrate.toSprite();
    sprite.scale = vec(0.5, 0.5);
    super({
      eventEmitter: applianceEventEmitter,
      name: "TomatoCrate",
      sprite,
      pos: vec(300, 500),
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
