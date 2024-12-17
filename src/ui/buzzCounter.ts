import { PlayerData } from "@/playerData";
import { colorPrimaryBuzz } from "@/resources";
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

export class BuzzCounter extends ScreenElement {
  private count = 0;
  private text: Text;

  constructor() {
    super({
      pos: vec(1038, 44),
      z: 2,
    });

    this.count = PlayerData.buzz;
  }

  private updateGraphics() {
    this.text = new Text({
      text: `${this.count}`,
      font: new Font({
        family: "Kaph",
        size: 36,
        color: colorPrimaryBuzz,
        textAlign: TextAlign.Right,
      }),
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
