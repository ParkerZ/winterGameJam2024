import { Sprite, Vector, vec } from "excalibur";
import { Resources, spriteScale } from "../resources";
import { ApplianceEventEmitter } from "../events";
import { Appliance } from "./appliance";
import { Food } from "@/foodStuffs/food";
import { TomatoSlice } from "@/foodStuffs/tomatoSlice";
import { Lettuce } from "@/foodStuffs/lettuce";
import { LettuceSlice } from "@/foodStuffs/lettuceSlice";
import { Tomato } from "@/foodStuffs/tomato";

export class Counter extends Appliance {
  constructor(
    applianceEventEmitter: ApplianceEventEmitter,
    pos: Vector,
    sprite: Sprite
  ) {
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
      this.handleChopEvent();
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

  private handleChopEvent() {
    if (this.heldItem instanceof Tomato) {
      this.heldItem.unparent();
      this.heldItem.kill();
      this.heldItem = new TomatoSlice();
      this.addChild(this.heldItem);
    } else if (this.heldItem instanceof Lettuce) {
      this.heldItem.unparent();
      this.heldItem.kill();
      this.heldItem = new LettuceSlice();
      this.addChild(this.heldItem);
    }
  }
}
