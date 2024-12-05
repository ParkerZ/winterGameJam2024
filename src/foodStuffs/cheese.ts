import { Resources } from "@/resources";
import { Food } from "./food";
import { vec } from "excalibur";

export class Cheese extends Food {
  constructor() {
    const sprite = Resources.Cheese.toSprite();
    sprite.scale = vec(0.5, 0.5);
    super({
      name: "Cheese",
      sprite,
    });

    this.isBurgerCompatible = true;
  }
}
