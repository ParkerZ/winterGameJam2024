import {
  Actor,
  Engine,
  Font,
  Label,
  Rectangle,
  ScreenElement,
  Sprite,
  TextAlign,
  Vector,
  vec,
} from "excalibur";
import { Difficulty, DifficultyOptions, GuestOrder } from "./guestOrder";
import { Reward } from "../reward";
import { Burger } from "@/foodStuffs/burger";
import {
  ClearOrderEvent,
  GuestEventEmitter,
  GuestInteractEvent,
} from "@/events";
import { PlayerData } from "@/playerData";
import { Tooltip } from "@/ui/tooltip";
import {
  Resources,
  colorPrimaryBuzz,
  colorPrimaryCash,
  colorSecondaryBuzz,
  guestScale,
} from "@/resources";

export type GuestState =
  | "dormant"
  | "idle"
  | "ordering"
  | "activating"
  | "cleanup";

export const GuestStates: Record<string, GuestState> = {
  Dormant: "dormant",
  Idle: "idle",
  Ordering: "ordering",
  Activating: "activating",
  Cleanup: "cleanup",
};

export interface TooltipText {
  top?: string;
  buzz?: string;
  cash?: string;
  difficulty?: Difficulty;
}

export class Guest extends ScreenElement {
  protected eventEmitter: GuestEventEmitter;

  protected reward: Reward;
  protected difficulty: Difficulty;
  protected sprite: Sprite;
  protected state: GuestState;
  protected hoverState: "idle" | "hovered" | "end-hover" = "idle";

  protected order: GuestOrder | null;

  protected label: string;
  protected tooltip: Tooltip | null;
  protected isTooltipActive: boolean = false;
  protected icon: Sprite | null;

  public canBeAutoFulfilled: boolean = false;

  constructor({
    eventEmitter,
    label = "",
    tooltipText = {},
    sprite,
    icon,
  }: {
    eventEmitter?: GuestEventEmitter;
    tooltipText?: TooltipText;
    label?: string;
    sprite?: Sprite;
    icon?: Sprite;
  }) {
    super({
      anchor: Vector.Half,
      z: -1,
    });

    this.eventEmitter = eventEmitter;
    this.state = GuestStates.Dormant;
    if (sprite) {
      this.sprite = sprite;
      this.sprite.scale = guestScale;
    }

    this.icon = icon ?? null;

    this.label = label;
    if (tooltipText) this.updateTooltip(tooltipText);
  }

  onInitialize(engine: Engine<any>): void {
    this.addIcons();

    this.graphics.use(this.sprite);

    // It feels like we need to know whenever this is clicked regardless
    // This can be to activate an ability, begin an order, fulfill an order, or fulfill an ability.
    // The last case complicates things
    this.on("pointerdown", (evt) => {
      if (this.eventEmitter) {
        this.eventEmitter.emit("interact", new GuestInteractEvent(this));
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
    if (
      this.hoverState === "hovered" &&
      this.tooltip &&
      !this.isTooltipActive
    ) {
      engine.add(this.tooltip);
      this.isTooltipActive = true;
    } else if (
      this.hoverState === "end-hover" &&
      !this.graphics.bounds.contains(engine.input.pointers.primary.lastWorldPos)
    ) {
      this.hoverState = "idle";
      if (this.tooltip && this.isTooltipActive) {
        engine.remove(this.tooltip);
        this.isTooltipActive = false;
      }
    }
  }

  onPostUpdate(engine: Engine<any>, elapsedMs: number): void {
    if (this.state === GuestStates.Cleanup) {
      this.cleanup(engine);
      this.state = GuestStates.Dormant;
      this.removeAllChildren();
      this.kill();
    }
  }

  public updateTooltip(tooltipText: TooltipText) {
    this.tooltip = new Tooltip({
      label: this.label,
      topText: tooltipText.top,
      buzzText: tooltipText.buzz,
      cashText: tooltipText.cash,
      difficulty: tooltipText.difficulty,
    });
  }

  public attachEventEmitter(eventEmitter: GuestEventEmitter) {
    this.eventEmitter = eventEmitter;
  }

  public onAddToScene() {
    if (this.order) {
      this.removeChild(this.order);
      this.order.kill();
      this.order = null;
    }
    this.state = GuestStates.Idle;
    this.hoverState = "idle";
    this.addIcons();
  }

  public getState(): GuestState {
    return this.state;
  }

  public getReward(): Reward {
    return this.reward;
  }

  public getIcon(): Label | null {
    return null;
  }

  public getDifficulty(): Difficulty {
    return this.difficulty;
  }

  public orderOrActivate() {
    if (this.order || this.state !== GuestStates.Idle) {
      return;
    }

    if (this.difficulty === DifficultyOptions.None) {
      this.state = GuestStates.Activating;
      this.activateAbility();
      return;
    }

    this.state = GuestStates.Ordering;

    this.order = new GuestOrder(this.eventEmitter, this.difficulty);
    this.addChild(this.order);

    // Make sure to capture clicks on order
    this.eventEmitter.on("interactOrder", (evt) => {
      if (evt.order === this.order) {
        this.eventEmitter.emit("interact", new GuestInteractEvent(this));
      }
    });
  }

  public doesBurgerMatchOrder(burger: Burger): boolean {
    return this.order && this.order.doesBurgerMatchOrder(burger);
  }

  public completeOrder() {
    this.eventEmitter.emit("clearOrder", new ClearOrderEvent(this));
    this.reward.distribute();
    if (this.order) {
      this.removeChild(this.order);
      this.order.kill();
      this.order = null;
    }

    this.state = GuestStates.Cleanup;
  }

  public remove(engine: Engine<any>) {
    if (this.order) {
      this.removeChild(this.order);
      this.order.kill();
      this.order = null;
    }
    this.state = GuestStates.Cleanup;
  }

  // Use this for any effects when guest has no associated order
  protected activateAbility() {}

  // Use this for any effects after order completion
  protected cleanup(engine: Engine<any>) {
    if (this.tooltip && this.isTooltipActive) {
      engine.remove(this.tooltip);
      this.isTooltipActive = false;
    }
  }

  private addIcons() {
    const iconBacking = Resources.IconBacking.toSprite();
    iconBacking.scale = vec(0.55, 0.55);

    // Top Right
    if (this.reward.star) {
      const star = new ScreenElement({
        pos: vec(52, -56),
        anchor: Vector.Half,
      });
      const sprite = Resources.Star.toSprite();
      sprite.scale = Vector.Half;
      star.graphics.use(sprite);
      this.addChild(star);
    } else if (this.icon) {
      const icon = new ScreenElement({
        pos: vec(52, -56),
        anchor: Vector.Half,
      });
      const sprite = this.icon.clone();
      sprite.scale = Vector.Half;
      icon.graphics.use(sprite);
      this.addChild(icon);
    }

    // Middle Right
    if (this.reward.buzz) {
      const box = new ScreenElement({ pos: vec(52, -17), anchor: Vector.Half });
      box.graphics.use(iconBacking);

      this.addChild(box);
      const label = new Label({
        pos: vec(60, -25),
        text: `${this.reward.buzz}`,
        font: new Font({
          family: "Kaph",
          size: 18,
          color: colorPrimaryBuzz,
          textAlign: TextAlign.Right,
        }),
      });
      this.addChild(label);
    }

    // Bottom Right
    if (this.reward.cash) {
      const box = new ScreenElement({ pos: vec(52, 18), anchor: Vector.Half });
      box.graphics.use(iconBacking);

      this.addChild(box);
      const label = new Label({
        pos: vec(60, 10),
        text: `${this.reward.cash}`,
        font: new Font({
          family: "Kaph",
          size: 18,
          color: colorPrimaryCash,
          textAlign: TextAlign.Right,
        }),
      });
      this.addChild(label);
    }

    // Bottom Left
    if (this.difficulty !== DifficultyOptions.None) {
      const icon = new ScreenElement({
        pos: vec(-52, 18),
        anchor: Vector.Half,
      });
      let sprite;
      switch (this.difficulty) {
        case DifficultyOptions.Easy:
          sprite = Resources.IconEasy.toSprite();
          break;
        case DifficultyOptions.Medium:
          sprite = Resources.iconMedium.toSprite();
          break;
        case DifficultyOptions.Hard:
          sprite = Resources.iconHard.toSprite();
          break;
      }
      sprite.scale = Vector.Half;
      icon.graphics.use(sprite);
      this.addChild(icon);
    }
  }
}
