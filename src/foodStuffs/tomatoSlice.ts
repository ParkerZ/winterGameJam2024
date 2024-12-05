import { Resources } from "@/resources";
import { Food } from "./food";
import { vec } from "excalibur";

export class TomatoSlice extends Food {
  constructor() {
    const sprite = Resources.TomatoSlice.toSprite();
    sprite.scale = vec(0.5, 0.5);
    super({
      name: "TomatoSlice",
      sprite,
    });

    this.isBurgerCompatible = true;
  }
}
