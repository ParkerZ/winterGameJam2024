import { PlayerData } from "@/playerData";
import { colorLabel } from "@/resources";
import {
  Color,
  Engine,
  Font,
  ScreenElement,
  Text,
  TextAlign,
  Vector,
  vec,
} from "excalibur";

export class DayCounter extends ScreenElement {
  private count = 0;
  private text: Text;

  constructor() {
    super({
      pos: vec(1037, 210),
      z: 2,
    });

    this.count = PlayerData.day;
  }

  private updateGraphics() {
    this.text = new Text({
      text: `${this.count}/${PlayerData.maxDay}`,
      font: new Font({
        family: "Kaph",
        size: 17,
        color: colorLabel,
        textAlign: TextAlign.Right,
      }),
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
