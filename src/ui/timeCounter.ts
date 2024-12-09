import { PlayerData } from "@/playerData";
import {
  Engine,
  Font,
  ScreenElement,
  Text,
  TextAlign,
  Vector,
  vec,
} from "excalibur";

export class TimeCounter extends ScreenElement {
  private count = 0;
  private text: Text;

  constructor(count: number, pos: Vector) {
    super({
      pos,
      z: 2,
    });

    this.count = count;
  }

  private updateGraphics() {
    this.text = new Text({
      text: `Seconds: ${this.count}`,
      font: new Font({ size: 30, textAlign: TextAlign.Right }),
    });

    this.graphics.use(this.text);
  }

  onInitialize(engine: Engine<any>): void {
    this.updateGraphics();
  }

  public setCount(count: number) {
    this.count = count;
    this.updateGraphics();
  }

  public getCount() {
    return this.count;
  }
}
