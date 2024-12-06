import { Vector, vec } from "excalibur";
import { Resources } from "../resources";
import { ApplianceEventEmitter } from "../events";
import { Appliance } from "./appliance";
import { Food } from "@/foodStuffs/food";
import { TomatoSlice } from "@/foodStuffs/tomatoSlice";

export class Counter extends Appliance {
  constructor(applianceEventEmitter: ApplianceEventEmitter, pos: Vector) {
    const sprite = Resources.Counter.toSprite();
    sprite.scale = vec(0.5, 0.5);
    super({
      eventEmitter: applianceEventEmitter,
      name: "Counter",
      sprite,
      pos,
    });

    this.heldItem = null;
    this.allowsInteraction = true;
  }

  public setHeldItem(incomingItem: Food): boolean {
    const canSetHeldItem = this.heldItem === null;

    if (!canSetHeldItem) {
      return false;
    }

    this.heldItem = incomingItem;
    this.heldItem.unparent();
    this.addChild(this.heldItem);
    this.heldItem.events.on("chopped", () => {
      this.handleTomatoChopEvent();
    });
    return true;
  }

  public getHeldItem(): Food | null {
    const item = this.heldItem;
    if (item === null) {
      return null;
    }

    this.removeChild(this.heldItem);
    this.heldItem = null;
    return item;
  }

  private handleTomatoChopEvent() {
    this.heldItem.unparent();
    this.heldItem.kill();
    this.heldItem = new TomatoSlice();
    this.addChild(this.heldItem);
  }
}
