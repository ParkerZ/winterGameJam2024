import { Resources } from "@/resources";
import { Food } from "./food";
import { vec } from "excalibur";

export class LettuceSlice extends Food {
  constructor() {
    const sprite = Resources.LettuceSlice.toSprite();
    sprite.scale = vec(0.5, 0.5);
    super({
      name: "LettuceSlice",
      sprite,
    });

    this.isBurgerCompatible = true;
  }
}
