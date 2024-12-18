import { PlayerData } from "@/playerData";
import { colorLabel } from "@/resources";
import {
  Engine,
  Font,
  ScreenElement,
  Text,
  TextAlign,
  Vector,
  vec,
} from "excalibur";

export class DeckCounter extends ScreenElement {
  private count = 0;
  private text: Text;

  constructor() {
    super({
      pos: vec(1023, 352),
      anchor: Vector.Half,
      z: 2,
    });

    this.count = PlayerData.deck.length;
  }

  private updateGraphics() {
    this.text = new Text({
      text: `Invite List\nTotal: ${this.count}`,
      font: new Font({
        family: "Kaph",
        size: 16,
        color: colorLabel,
        lineHeight: 18,
        textAlign: TextAlign.Center,
      }),
    });

    this.graphics.use(this.text);
  }

  onInitialize(engine: Engine<any>): void {
    this.updateGraphics();
  }

  onPreUpdate(engine: Engine<any>, elapsedMs: number): void {
    if (PlayerData.deck.length !== this.count) {
      this.count = PlayerData.deck.length;
      this.updateGraphics();
    }
  }
}
