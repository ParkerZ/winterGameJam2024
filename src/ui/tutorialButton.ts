import {
  Resources,
  getRandomClickSound,
  nextButtonScale,
  orderVolume,
} from "@/resources";
import { Engine, ScreenElement, Vector, vec } from "excalibur";

export class TutorialButton extends ScreenElement {
  constructor() {
    super({
      pos: vec(300, 500),
      anchor: Vector.Half,
      z: 6,
    });
  }

  onInitialize(engine: Engine<any>): void {
    const sprite = Resources.TutorialButton.toSprite({ scale: vec(0.8, 0.8) });
    this.graphics.use(sprite);

    this.on("pointerup", () => {
      Resources.soundRight.play(orderVolume);
      engine.goToScene("tutorial");
    });

    this.on("pointerenter", () => {
      getRandomClickSound().play();
    });
  }
}
