import { ApplianceEventEmitter, ExchangeEvent, InteractEvent } from "@/events";
import { Food } from "@/foodStuffs/food";
import {
  Actor,
  Buttons,
  Color,
  Engine,
  PointerButton,
  Sprite,
  Vector,
  vec,
} from "excalibur";

export abstract class Appliance extends Actor {
  private sprite: Sprite;

  protected tempHighlight: Actor;
  protected state: "idle" | "hovered" | "end-hover";
  protected allowsInteraction: boolean = false;
  protected heldItem: Food | null;

  protected eventEmitter: ApplianceEventEmitter;

  constructor({
    eventEmitter,
    name,
    sprite,
    pos = vec(100, 100),
  }: {
    eventEmitter: ApplianceEventEmitter;
    name: string;
    sprite: Sprite;
    pos: Vector;
  }) {
    super({
      name,
      pos,
    });

    this.eventEmitter = eventEmitter;
    this.sprite = sprite;

    this.heldItem = null;

    this.state = "idle";

    this.pointer.useGraphicsBounds = true;

    // TODO: this should move to the child in some fashion
    this.tempHighlight = new Actor({
      x: this.pos.x,
      y: this.pos.y,
      width: 100,
      height: 100,
      color: Color.Green,
    });
  }

  onInitialize(engine: Engine<any>): void {
    this.graphics.add(this.sprite);

    this.on("pointerdown", (evt) => {
      if (evt.button === PointerButton.Left) {
        this.eventEmitter.emit("exchange", new ExchangeEvent(this));
      } else if (evt.button === PointerButton.Right) {
        if (this.allowsInteraction) {
          this.eventEmitter.emit("interactStart", new InteractEvent(this));
        }
      }
    });

    this.on("pointerup", (evt) => {
      this.stopInteract();
    });

    this.on("pointerenter", (evt) => {
      this.state = "hovered";
      engine.add(this.tempHighlight);
    });

    this.on("pointerleave", (evt) => {
      // Queue up a check for hover end. This event fires on click.
      this.state = "end-hover";
    });
  }

  onPostUpdate(engine: Engine<any>, elapsedMs: number): void {
    // Check if the mouse is no longer over the element before clearing state.
    if (
      this.state === "end-hover" &&
      !this.graphics.bounds.contains(engine.input.pointers.primary.lastWorldPos)
    ) {
      this.state = "idle";
      engine.remove(this.tempHighlight);
      this.stopInteract();
    }
  }

  public hasItem(): boolean {
    return this.heldItem !== null;
  }

  private stopInteract() {
    if (this.heldItem && this.heldItem.getState() === "chopping") {
      this.heldItem.setState("idle");
    }

    this.eventEmitter.emit("interactStop");
  }

  // Methods to handle interaction
  // Returns success of operation
  public abstract setHeldItem(incomingItem: Food): boolean;
  // Returns held item if any
  public abstract getHeldItem(): Food | null;
}
