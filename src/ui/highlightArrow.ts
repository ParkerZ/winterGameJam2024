import { easeInOutCubic } from "@/animations";
import { Resources } from "@/resources";
import { Engine, ScreenElement, Vector, vec } from "excalibur";

export class HighlightArrow extends ScreenElement {
  private t = 0;
  private animationLengthMs = 300;
  private elapsedTimeMult = 1;
  private startingHeight = 0;

  constructor({ pos, z = 5 }: { pos: Vector; z?: number }) {
    super({
      pos,
      z,
    });

    this.startingHeight = pos.y;
  }

  onInitialize(engine: Engine<any>): void {
    this.graphics.use(Resources.ArrowDown.toSprite({ scale: vec(0.6, 0.6) }));
  }

  onPreUpdate(engine: Engine<any>, elapsedMs: number): void {
    this.t += elapsedMs * this.elapsedTimeMult;

    const tNormalized =
      1 - (this.animationLengthMs - this.t) / this.animationLengthMs;

    const val = easeInOutCubic(tNormalized);
    this.pos.y = this.startingHeight + 10 * val;

    if (tNormalized >= 1) {
      this.elapsedTimeMult = -1;
    } else if (tNormalized <= 0) {
      this.elapsedTimeMult = 1;
    }
  }
}
