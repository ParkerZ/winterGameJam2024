import {
  Resources,
  getRandomClickSound,
  nextButtonScale,
  orderVolume,
} from "@/resources";
import { Engine, ScreenElement, Vector, vec } from "excalibur";

export class OpenShopButton extends ScreenElement {
  constructor({ pos = vec(430, 300) }: { pos?: Vector }) {
    super({
      pos,
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
      engine.goToScene("shop");
    });

    this.on("pointerenter", () => {
      getRandomClickSound().play();
    });
  }
}
