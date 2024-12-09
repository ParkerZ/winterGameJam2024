import { PlayerData } from "@/playerData";
import { Engine, Font, ScreenElement, Text, Vector, vec } from "excalibur";

export class DayCounter extends ScreenElement {
  private count = 0;
  private text: Text;

  constructor(pos: Vector) {
    super({
      pos,
      z: 2,
    });

    this.count = PlayerData.day;
  }

  private updateGraphics() {
    this.text = new Text({
      text: `Day: ${this.count}/${PlayerData.maxDay}`,
      font: new Font({ size: 30 }),
    });

    this.graphics.use(this.text);
  }

  onInitialize(engine: Engine<any>): void {
    this.updateGraphics();
  }

  onPreUpdate(engine: Engine<any>, elapsedMs: number): void {
    if (PlayerData.day !== this.count) {
      this.count = PlayerData.day;
      this.updateGraphics();
    }
  }
}
