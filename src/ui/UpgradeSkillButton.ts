import { Resources, colorPrimaryCash } from "@/resources";
import {
  Engine,
  Font,
  Label,
  ScreenElement,
  TextAlign,
  Vector,
  vec,
} from "excalibur";

export class UpgradeSkillButton extends ScreenElement {
  private price: number;
  private label: Label;

  constructor(pos: Vector) {
    super({
      anchor: Vector.Half,
      pos,
    });

    this.price = 0;
    this.label = new Label({
      pos: vec(0, -15),
      text: "",
      font: new Font({
        family: "Kaph",
        size: 36,
        textAlign: TextAlign.Center,
        color: colorPrimaryCash,
      }),
      anchor: Vector.Half,
    });
  }

  onInitialize(engine: Engine<any>): void {
    const sprite = Resources.ButtonInvite.toSprite();
    this.graphics.use(sprite);
  }

  public setPrice(price: number) {
    this.price = price;
    if (this.children.length) {
      this.removeChild(this.label);
    }

    this.label.text = `${this.price}`;

    this.addChild(this.label);
  }
}
