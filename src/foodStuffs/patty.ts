import { Resources } from "@/resources";
import { Food } from "./food";
import { vec } from "excalibur";

export class Patty extends Food {
  constructor() {
    const sprite = Resources.Burger.toSprite();
    sprite.scale = vec(0.5, 0.5);
    super({
      name: "Patty",
      sprite,
    });

    this.isBurgerCompatible = true;
  }
}
