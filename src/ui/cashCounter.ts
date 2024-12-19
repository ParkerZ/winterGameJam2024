import { PlayerData } from "@/playerData";
import { colorPrimaryCash } from "@/resources";
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

export class CashCounter extends ScreenElement {
  private count = 0;
  private text: Text;

  constructor() {
    super({
      pos: vec(1036, 130),
      z: 2,
    });

    this.count = PlayerData.cash;
  }

  private updateGraphics() {
    this.text = new Text({
      text: `${this.count}`,
      font: new Font({
        family: "Kaph",
        size: 36,
        color: colorPrimaryCash,
        textAlign: TextAlign.Right,
      }),
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
