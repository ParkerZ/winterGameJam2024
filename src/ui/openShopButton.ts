import { Resources } from "@/resources";
import { Engine, ScreenElement, Vector, vec } from "excalibur";

export class OpenShopButton extends ScreenElement {
  constructor() {
    super({
      pos: vec(400, 300),
      anchor: Vector.Half,
    });
  }

  onInitialize(engine: Engine<any>): void {
    const sprite = Resources.ButtonNext.toSprite();
    sprite.scale = vec(0.5, 0.5);
    this.graphics.use(sprite);

    this.on("pointerup", () => {
      engine.goToScene("shop");
    });
  }
}
