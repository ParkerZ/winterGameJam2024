import { PlayerData } from "@/playerData";
import { Resources } from "@/resources";
import {
  Engine,
  Font,
  Label,
  ScreenElement,
  Text,
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
    sprite.scale = vec(0.5, 0.5);
    this.graphics.use(sprite);

    this.addChild(
      new Label({
        pos: vec(20, -20),
        text: `${this.price}`,
        font: new Font({ size: 48 }),
        anchor: Vector.Half,
      })
    );
  }
}
