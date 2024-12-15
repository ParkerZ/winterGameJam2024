import { PlayerData } from "@/playerData";
import { Engine, Font, ScreenElement, Text, Vector, vec } from "excalibur";

export class CashCounter extends ScreenElement {
  private count = 0;
  private text: Text;

  constructor(pos: Vector) {
    super({
      pos,
      z: 2,
    });

    this.count = PlayerData.cash;
  }

  private updateGraphics() {
    this.text = new Text({
      text: `Cash: ${this.count}`,
      font: new Font({ size: 24 }),
    });

    this.graphics.use(this.text);
  }

  onInitialize(engine: Engine<any>): void {
    this.updateGraphics();
  }

  onPreUpdate(engine: Engine<any>, elapsedMs: number): void {
    if (PlayerData.cash !== this.count) {
      this.count = PlayerData.cash;
      this.updateGraphics();
    }
  }
}
