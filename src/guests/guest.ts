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

// TODO: will eventually need tooltip, maybe a name
export class Guest extends ScreenElement {
  protected eventEmitter: GuestEventEmitter;

  protected reward: Reward;
  protected difficulty: Difficulty;
  protected sprite: Sprite;
  protected state: GuestState;

  protected order: GuestOrder | null;

  public canBeAutoFulfilled: boolean = false;

  constructor({ eventEmitter }: { eventEmitter?: GuestEventEmitter }) {
    super({
      anchor: Vector.Half,
    });

    this.eventEmitter = eventEmitter;
    this.state = GuestStates.Dormant;
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

  public orderOrActivate() {
    if (this.order || this.state !== GuestStates.Idle) {
      return;
    }

    if (this.difficulty === DifficultyOptions.NA) {
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

  // Use this for any effects when guest has no associated order
  protected activateAbility() {}

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

  // Use this for any effects after order completion
  protected cleanup() {}

  public remove() {
    if (this.order) {
      this.removeChild(this.order);
      this.order.kill();
      this.order = null;
    }
    this.state = GuestStates.Cleanup;
  }

  onPostUpdate(engine: Engine<any>, elapsedMs: number): void {
    if (this.state === GuestStates.Cleanup) {
      this.cleanup();
      this.state = GuestStates.Dormant;
      this.kill();
    }
  }
}
