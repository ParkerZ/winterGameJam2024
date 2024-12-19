import {
  Resources,
  getRandomClickSound,
  nextButtonScale,
  orderVolume,
} from "@/resources";
import { Engine, ScreenElement, Vector, vec } from "excalibur";

export class OpenKitchenButton extends ScreenElement {
  constructor(pos?: Vector) {
    super({
      pos: pos ?? vec(710, 500),
      anchor: Vector.Half,
      z: 6,
    });
  }

  onInitialize(engine: Engine<any>): void {
    const sprite = Resources.ButtonNext.toSprite();
    sprite.scale = nextButtonScale;
    this.graphics.use(sprite);

    this.on("pointerup", () => {
      Resources.soundRight.play(orderVolume);
      engine.goToScene("kitchen");
    });

    this.on("pointerenter", () => {
      getRandomClickSound().play();
    });
  }
}
