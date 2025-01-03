import { Engine, Vector, vec } from "excalibur";
import { Resources, sizzleVolume, spriteScale } from "../resources";
import { ApplianceEventEmitter } from "../events";
import { Appliance } from "./appliance";
import { Mince } from "@/foodStuffs/mince";
import { Food } from "@/foodStuffs/food";
import { Patty } from "@/foodStuffs/patty";
import { PlayerData } from "@/playerData";

export class Stove extends Appliance {
  constructor(applianceEventEmitter: ApplianceEventEmitter, pos: Vector) {
    const sprite = Resources.Stove.toSprite();
    super({
      eventEmitter: applianceEventEmitter,
      name: "Stove",
      sprite,
      pos,
    });

    this.heldItem = null;
  }

  public setHeldItem(incomingItem: Food): boolean {
    const canSetHeldItem =
      this.heldItem === null &&
      (incomingItem instanceof Mince || incomingItem instanceof Patty);
    if (!canSetHeldItem) {
      return false;
    }

    Resources.soundSizzle.play(sizzleVolume);

    PlayerData.onMinceCooking();

    this.heldItem = incomingItem;
    this.heldItem.unparent();
    this.addChild(this.heldItem);
    this.heldItem.pos = vec(-3, -50);
    this.heldItem.z = 1;
    this.heldItem.setState("cooking");
    this.heldItem.events.on("cooked", () => {
      this.handleMinceCookedEvent();
    });

    return true;
  }

  public getHeldItem(): Food | null {
    const item = this.heldItem;
    if (item === null) {
      return null;
    }

    this.heldItem.setState("idle");
    this.removeChild(this.heldItem);
    this.heldItem = null;
    return item;
  }

  private handleMinceCookedEvent() {
    this.heldItem.unparent();
    this.heldItem.kill();
    this.heldItem = new Patty();
    this.addChild(this.heldItem);
    this.heldItem.pos = vec(-3, -50);
    this.heldItem.z = 1;
    PlayerData.onMinceCooking();
  }
}
