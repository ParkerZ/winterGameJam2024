import { Resources } from "@/resources";
import { Food } from "./food";
import { vec } from "excalibur";

export class Bun extends Food {
  constructor() {
    const sprite = Resources.Bun.toSprite();
    sprite.scale = vec(0.5, 0.5);
    super({
      name: "Bun",
      sprite,
    });

    this.isBurgerCompatible = true;
    this.isBurgerBase = true;
  }
}
