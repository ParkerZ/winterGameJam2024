import { Resources, nextButtonScale } from "@/resources";
import { Engine, ScreenElement, Vector, vec } from "excalibur";

export class OpenShopButton extends ScreenElement {
  constructor() {
    super({
      pos: vec(430, 300),
      anchor: Vector.Half,
    });
  }

  onInitialize(engine: Engine<any>): void {
    const sprite = Resources.ButtonNext.toSprite();
    sprite.scale = nextButtonScale;
    this.graphics.use(sprite);

    this.on("pointerup", () => {
      engine.goToScene("shop");
    });
  }
}
