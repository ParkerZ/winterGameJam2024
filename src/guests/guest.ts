import { Engine, Label, ScreenElement, Sprite, Vector, vec } from "excalibur";
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
import { guestScale } from "@/resources";

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

export class Guest extends ScreenElement {
  protected eventEmitter: GuestEventEmitter;

  protected reward: Reward;
  protected difficulty: Difficulty;
  protected sprite: Sprite;
  protected state: GuestState;
  protected hoverState: "idle" | "hovered" | "end-hover" = "idle";

  protected order: GuestOrder | null;

  protected tooltip: Tooltip | null;
  protected isTooltipActive: boolean = false;

  public canBeAutoFulfilled: boolean = false;

  constructor({
    eventEmitter,
    label = "",
    tooltipText = {},
    sprite,
  }: {
    eventEmitter?: GuestEventEmitter;
    tooltipText?: {
      top?: string;
      buzz?: string;
      cash?: string;
      difficulty?: Difficulty;
    };
    label?: string;
    sprite?: Sprite;
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

    this.tooltip = tooltipText
      ? new Tooltip({
          label: label,
          topText: tooltipText.top,
          buzzText: tooltipText.buzz,
          cashText: tooltipText.cash,
          difficulty: tooltipText.difficulty,
        })
      : null;
  }

  onInitialize(engine: Engine<any>): void {
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
      this.kill();
    }
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
    this.order.pos = vec(0, 0);
    this.addChild(this.order);
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
}
