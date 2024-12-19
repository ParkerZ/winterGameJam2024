import {
  Resources,
  getRandomClickSound,
  nextButtonScale,
  orderVolume,
} from "@/resources";
import { Engine, ScreenElement, Vector, vec } from "excalibur";

export class PlayButton extends ScreenElement {
  private isTutorialMode: boolean = false;

  constructor(hasCompletedTutorial: boolean) {
    super({
      pos: vec(300, hasCompletedTutorial ? 350 : 400),
      anchor: Vector.Half,
      z: 6,
    });

    this.isTutorialMode = !hasCompletedTutorial;
  }

  onInitialize(engine: Engine<any>): void {
    const sprite = Resources.PlayButton.toSprite();
    this.graphics.use(sprite);

    this.on("pointerup", () => {
      Resources.soundRight.play(orderVolume);
      if (this.isTutorialMode) {
        engine.goToScene("tutorial");
      } else {
        engine.goToScene("kitchen");
      }
    });

    this.on("pointerenter", () => {
      getRandomClickSound().play();
    });
  }
}
