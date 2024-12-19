import {
  Engine,
  Font,
  Label,
  ScreenElement,
  TextAlign,
  Vector,
  vec,
} from "excalibur";
import { OpenShopButton } from "./openShopButton";
import { Resources, colorLabel } from "@/resources";
import { easeOutBack } from "@/animations";

export class DayCompleteModal extends ScreenElement {
  private t = 0;
  private animationLengthMs = 750;
  private startingHeight = 0;
  private text: string;
  constructor({ text }: { text: string }) {
    super({ pos: vec(430, 300), anchor: Vector.Half, z: 7 });
    this.text = text;
  }

  onInitialize(engine: Engine<any>): void {
    this.startingHeight = this.pos.y;
    this.graphics.use(Resources.DayCompleteModal.toSprite());
    const label = new Label({
      pos: vec(0, -15),
      text: this.text,
      font: new Font({
        family: "Kaph",
        size: 24,
        textAlign: TextAlign.Center,
        color: colorLabel,
      }),
    });

    const button = new OpenShopButton({ pos: vec(0, 100) });

    this.addChild(label);
    this.addChild(button);
  }

  onPreUpdate(engine: Engine<any>, elapsedMs: number): void {
    if (this.t < this.animationLengthMs) {
      this.t += elapsedMs;

      const tNormalized =
        1 - (this.animationLengthMs - this.t) / this.animationLengthMs;

      const val = easeOutBack(tNormalized);
      this.pos.y = this.startingHeight + 600 - 600 * val;
    }
  }
}
