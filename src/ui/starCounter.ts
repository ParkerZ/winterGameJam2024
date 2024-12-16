import { PlayerData } from "@/playerData";
import { Resources } from "@/resources";
import { Engine, Font, ScreenElement, Text, Vector, vec } from "excalibur";

export class StarCounter extends ScreenElement {
  private count = 0;
  private text: Text;

  constructor() {
    super({
      z: 2,
    });

    this.count = PlayerData.star;
  }

  private updateGraphics() {
    this.removeAllChildren();

    const sprite = Resources.Star.toSprite();
    if (this.count >= 1) {
      const star1 = new ScreenElement({ pos: vec(875, 263) });
      star1.graphics.use(sprite);
      this.addChild(star1);
    }

    if (this.count >= 2) {
      const star1 = new ScreenElement({ pos: vec(938, 263) });
      star1.graphics.use(sprite);
      this.addChild(star1);
    }

    if (this.count >= 3) {
      const star = new ScreenElement({ pos: vec(1000, 263) });
      star.graphics.use(sprite);
      this.addChild(star);
    }
  }

  onInitialize(engine: Engine<any>): void {
    this.updateGraphics();
  }

  onPreUpdate(engine: Engine<any>, elapsedMs: number): void {
    if (PlayerData.star !== this.count) {
      this.count = PlayerData.star;
      this.updateGraphics();
    }
  }
}
