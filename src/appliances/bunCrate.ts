import { vec } from "excalibur";
import { Resources } from "../resources";
import { ApplianceEventEmitter, InteractEvent } from "../events";
import { Appliance } from "./appliance";

export class BunCrate extends Appliance {
  constructor(applianceEventEmitter: ApplianceEventEmitter) {
    const sprite = Resources.BunCrate.toSprite();
    sprite.scale = vec(0.5, 0.5);
    super({
      eventEmitter: applianceEventEmitter,
      name: "BunCrate",
      sprite,
      pos: vec(150, 500),
    });

    this.heldItem = "bun";
  }

  public setHeldItem(incomingItem: string): boolean {
    const canSetHeldItem = incomingItem === "bun";
    console.log("bunCrate setting held...", canSetHeldItem);
    return canSetHeldItem;
  }

  public getHeldItem(): string | null {
    console.log("bunCrate getting held...", this.heldItem);
    return this.heldItem;
  }
}
