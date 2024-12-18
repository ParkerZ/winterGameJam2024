import { PlayerData } from "@/playerData";
import {
  Resources,
  colorLabel,
  colorPrimaryCash,
  getRandomClickSound,
} from "@/resources";
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
  private isDisabled: boolean;

  constructor(pos: Vector, isDisabled: boolean) {
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
        color: isDisabled ? colorLabel : colorPrimaryCash,
      }),
      anchor: Vector.Half,
    });

    this.isDisabled = isDisabled;
  }

  onInitialize(engine: Engine<any>): void {
    this.updateGraphics();

    this.on("pointerenter", () => {
      getRandomClickSound().play();
    });
  }

  onPostUpdate(engine: Engine<any>, elapsedMs: number): void {
    if (this.price !== 0 && !this.isDisabled && PlayerData.cash < this.price) {
      this.isDisabled = true;
      this.updateGraphics();
    }
  }

  private updateGraphics() {
    this.removeAllChildren();

    this.graphics.use(Resources.ButtonInvite.toSprite());

    this.label.font.color = this.isDisabled ? colorLabel : colorPrimaryCash;

    this.addChild(this.label);
  }

  public setPrice(price: number) {
    this.price = price;

    this.label.text = `${this.price}`;
    this.updateGraphics();
  }
}
