import { Resources, colorPrimaryBuzz } from "@/resources";
import {
  Engine,
  Font,
  Label,
  ScreenElement,
  TextAlign,
  Vector,
  vec,
} from "excalibur";

export class InviteGuestButton extends ScreenElement {
  private price: number;

  constructor(price: number, pos: Vector) {
    super({
      anchor: Vector.Half,
      pos,
    });

    this.price = price;
  }

  onInitialize(engine: Engine<any>): void {
    const sprite = Resources.ButtonInvite.toSprite();
    this.graphics.use(sprite);

    this.addChild(
      new Label({
        pos: vec(0, -15),
        text: `${this.price}`,
        font: new Font({
          family: "Kaph",
          size: 36,
          textAlign: TextAlign.Center,
          color: colorPrimaryBuzz,
        }),
        anchor: Vector.Half,
      })
    );
  }
}
