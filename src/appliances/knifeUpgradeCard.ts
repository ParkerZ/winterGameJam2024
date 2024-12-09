import {
  Engine,
  Font,
  Label,
  ScreenElement,
  Sprite,
  Vector,
  vec,
} from "excalibur";
import { PlayerData } from "@/playerData";
import { Resources } from "@/resources";
import { UpgradeSkillButton } from "@/ui/UpgradeSkillButton";

export class KnifeUpgradeCard extends ScreenElement {
  protected cashCost: number;
  protected max: number;
  protected sprite: Sprite;

  constructor({
    pos,
    cashCost,
    max = 5,
  }: {
    pos: Vector;
    cashCost: number;
    max?: number;
  }) {
    super({ pos, anchor: Vector.Half });

    this.cashCost = cashCost;
    this.max = max;
    this.sprite = Resources.Counter.toSprite();
    this.sprite.scale = vec(0.5, 0.5);
  }

  onInitialize(engine: Engine<any>): void {
    this.graphics.use(this.sprite);

    const count = new Label({
      pos: vec(20, -65),
      text: this.getCountText(),
      font: new Font({ size: 24 }),
    });

    this.addChild(count);

    if (this.max > PlayerData.choppingLevel) {
      const button = new UpgradeSkillButton(vec(0, 50));
      button.setPrice(this.cashCost);
      this.addChild(button);

      button.on("pointerup", (evt) => {
        if (this.cashCost <= PlayerData.cash) {
          PlayerData.cash -= this.cashCost;
          PlayerData.upgradeChoppingTimeThreshold();
          this.cashCost += 1;
          button.setPrice(this.cashCost);

          count.text = this.getCountText();

          if (this.max <= PlayerData.choppingLevel) {
            this.removeChild(button);
            button.kill();
          }
        }
      });
    }
  }

  private getCountText(): string {
    return `${PlayerData.choppingLevel}/${this.max}`;
  }
}
