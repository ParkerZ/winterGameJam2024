import { PlayerData } from "@/playerData";
import { Engine, Font, ScreenElement, Text, Vector, vec } from "excalibur";

export class BuzzCounter extends ScreenElement {
  private count = 0;
  private text: Text;

  constructor(pos: Vector) {
    super({
      pos,
      z: 2,
    });

    this.count = PlayerData.buzz;
  }

  private updateGraphics() {
    this.text = new Text({
      text: `Burger Buzz: ${this.count}`,
      font: new Font({ size: 30 }),
    });

    this.graphics.use(this.text);
  }

  onInitialize(engine: Engine<any>): void {
    this.updateGraphics();
  }

  onPreUpdate(engine: Engine<any>, elapsedMs: number): void {
    if (PlayerData.buzz !== this.count) {
      this.count = PlayerData.buzz;
      this.updateGraphics();
    }
  }
}
