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
import { Tooltip } from "@/ui/tooltip";

export class StoveUpgradeCard extends ScreenElement {
  protected cashCost: number;
  protected max: number;
  protected sprite: Sprite;
  protected hoverState: "idle" | "hovered" | "end-hover" = "idle";

  protected tooltip: Tooltip;
  protected isTooltipActive: boolean = false;

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
    this.sprite = Resources.Stove.toSprite();
    this.sprite.scale = vec(0.5, 0.5);
    this.tooltip = new Tooltip({ text: "Stove cooks\nfaster" });
  }

  onInitialize(engine: Engine<any>): void {
    this.graphics.use(this.sprite);

    const count = new Label({
      pos: vec(20, -65),
      text: this.getCountText(),
      font: new Font({ size: 24 }),
    });

    this.addChild(count);

    if (this.max > PlayerData.cookingLevel) {
      const button = new UpgradeSkillButton(vec(0, 50));
      button.setPrice(this.cashCost);
      this.addChild(button);

      button.on("pointerup", (evt) => {
        if (this.cashCost <= PlayerData.cash) {
          PlayerData.cash -= this.cashCost;
          PlayerData.upgradeCookingTimeThreshold();
          this.cashCost += 1;
          button.setPrice(this.cashCost);

          count.text = this.getCountText();

          if (this.max <= PlayerData.cookingLevel) {
            this.removeChild(button);
            button.kill();
          }
        }
      });
    }

    this.on("pointerenter", () => {
      this.hoverState = "hovered";
    });

    this.on("pointerleave", () => {
      this.hoverState = "end-hover";
    });
  }

  onPreUpdate(engine: Engine<any>, elapsedMs: number): void {
    if (this.hoverState === "hovered" && !this.isTooltipActive) {
      engine.add(this.tooltip);
      this.isTooltipActive = true;
    } else if (
      this.hoverState === "end-hover" &&
      !this.graphics.bounds.contains(engine.input.pointers.primary.lastWorldPos)
    ) {
      this.hoverState = "idle";
      if (this.isTooltipActive) {
        engine.remove(this.tooltip);
        this.isTooltipActive = false;
      }
    }
  }

  private getCountText(): string {
    return `${PlayerData.cookingLevel}/${this.max}`;
  }
}
