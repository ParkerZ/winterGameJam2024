import { vec } from "excalibur";
import { Resources } from "../resources";
import { ApplianceEventEmitter, InteractEvent } from "../events";
import { Appliance } from "./appliance";

export class Counter extends Appliance {
  constructor(applianceEventEmitter: ApplianceEventEmitter) {
    const sprite = Resources.Counter.toSprite();
    sprite.scale = vec(0.5, 0.5);
    super({
      eventEmitter: applianceEventEmitter,
      name: "Counter",
      sprite,
      pos: vec(350, 150),
    });

    this.heldItem = null;
  }

  public setHeldItem(incomingItem: string): boolean {
    const canSetHeldItem = this.heldItem === null;

    console.log("counter setting held...", canSetHeldItem);
    if (!canSetHeldItem) {
      return false;
    }

    this.heldItem = incomingItem;
    return true;
  }

  public getHeldItem(): string | null {
    const item = this.heldItem;
    this.heldItem = null;
    console.log("counter getting held...", item);
    return item;
  }
}
