import { vec } from "excalibur";
import { Resources } from "../resources";
import { ApplianceEventEmitter, InteractEvent } from "../events";
import { Appliance } from "./appliance";

export class Trash extends Appliance {
  constructor(applianceEventEmitter: ApplianceEventEmitter) {
    const sprite = Resources.Trash.toSprite();
    sprite.scale = vec(0.5, 0.5);
    super({
      eventEmitter: applianceEventEmitter,
      name: "Trash",
      sprite,
      pos: vec(700, 500),
    });

    this.heldItem = null;
  }

  public setHeldItem(incomingItem: string): boolean {
    console.log("trash setting held...", true);
    return true;
  }

  public getHeldItem(): string | null {
    console.log("stove getting held...", null);
    return null;
  }
}
