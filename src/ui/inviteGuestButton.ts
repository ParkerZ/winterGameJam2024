import { PlayerData } from "@/playerData";
import { Resources, colorLabel, colorPrimaryBuzz } from "@/resources";
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
  private isDisabledCallback: () => boolean;

  constructor(price: number, pos: Vector, isDisabledCallback: () => boolean) {
    super({
      anchor: Vector.Half,
      pos,
    });

    this.price = price;
    this.isDisabledCallback = isDisabledCallback;
  }

  onInitialize(engine: Engine<any>): void {
    this.updateGraphics();
  }

  onPostUpdate(engine: Engine<any>, elapsedMs: number): void {
    if (this.isDisabledCallback()) {
      this.updateGraphics();
    }
  }

  private updateGraphics() {
    this.removeAllChildren();

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
          color: this.isDisabledCallback() ? colorLabel : colorPrimaryBuzz,
        }),
        anchor: Vector.Half,
      })
    );
  }
}
