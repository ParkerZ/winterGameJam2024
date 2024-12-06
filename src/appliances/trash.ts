import { Vector, vec } from "excalibur";
import { Resources } from "../resources";
import { ApplianceEventEmitter } from "../events";
import { Appliance } from "./appliance";
import { Food } from "@/foodStuffs/food";

export class Trash extends Appliance {
  constructor(applianceEventEmitter: ApplianceEventEmitter, pos: Vector) {
    const sprite = Resources.Trash.toSprite();
    sprite.scale = vec(0.5, 0.5);
    super({
      eventEmitter: applianceEventEmitter,
      name: "Trash",
      sprite,
      pos,
    });

    this.heldItem = null;
  }

  public setHeldItem(incomingItem: Food): boolean {
    console.log("Deleting:", incomingItem);
    incomingItem.unparent();
    incomingItem.kill();
    return true;
  }

  public getHeldItem(): Food | null {
    return null;
  }
}
