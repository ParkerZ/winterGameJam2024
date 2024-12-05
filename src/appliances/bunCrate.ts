import { vec } from "excalibur";
import { Resources } from "../resources";
import { ApplianceEventEmitter } from "../events";
import { Appliance } from "./appliance";
import { Food } from "@/foodStuffs/food";
import { Bun } from "@/foodStuffs/bun";

export class BunCrate extends Appliance {
  constructor(applianceEventEmitter: ApplianceEventEmitter) {
    const sprite = Resources.BunCrate.toSprite();
    sprite.scale = vec(0.5, 0.5);
    super({
      eventEmitter: applianceEventEmitter,
      name: "BunCrate",
      sprite,
      pos: vec(100, 500),
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
