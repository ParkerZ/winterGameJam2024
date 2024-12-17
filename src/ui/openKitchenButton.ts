import { Resources, nextButtonScale } from "@/resources";
import { Engine, ScreenElement, Vector, vec } from "excalibur";

export class OpenKitchenButton extends ScreenElement {
  constructor() {
    super({
      pos: vec(710, 500),
      anchor: Vector.Half,
    });
  }

  onInitialize(engine: Engine<any>): void {
    const sprite = Resources.ButtonNext.toSprite();
    sprite.scale = nextButtonScale;
    this.graphics.use(sprite);

    this.on("pointerup", () => {
      engine.goToScene("kitchen");
    });
  }
}
