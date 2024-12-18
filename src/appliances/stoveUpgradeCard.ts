import {
  Engine,
  Font,
  Label,
  ScreenElement,
  Sprite,
  TextAlign,
  Vector,
  vec,
} from "excalibur";
import { PlayerData } from "@/playerData";
import { Resources, colorLabel, orderVolume, spriteScale } from "@/resources";
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
    this.sprite = Resources.StoveUpgrade.toSprite();
    this.sprite.scale = spriteScale;
    this.tooltip = new Tooltip({
      label: "Quick Cook",
      topText: "Burgers cook\nfaster",
    });
  }

  onInitialize(engine: Engine<any>): void {
    this.graphics.use(this.sprite);

    const count = new Label({
      pos: vec(-40, -65),
      text: this.getCountText(),
      font: new Font({
        family: "Kaph",
        size: 18,
        textAlign: TextAlign.Center,
        color: colorLabel,
      }),
    });

    this.addChild(count);

    const getIsDisabled = () =>
      this.max === PlayerData.cookingLevel || this.cashCost > PlayerData.cash;
    const button = new UpgradeSkillButton(vec(0, 50), getIsDisabled());
    button.setPrice(this.cashCost);
    this.addChild(button);

    button.on("pointerup", (evt) => {
      if (!getIsDisabled()) {
        Resources.soundRight.play(orderVolume);
        PlayerData.cash -= this.cashCost;
        PlayerData.upgradeCookingTimeThreshold();
        this.cashCost += 1;
        button.setPrice(this.cashCost);

        count.text = this.getCountText();
      } else {
        Resources.soundWrong.play(orderVolume);
      }
    });

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
