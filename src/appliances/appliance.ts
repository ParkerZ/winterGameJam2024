import { ApplianceEventEmitter, InteractEvent } from "@/events";
import { Actor, Color, Engine, Sprite, Vector, vec } from "excalibur";

export abstract class Appliance extends Actor {
  private sprite: Sprite;

  protected tempHighlight: Actor;
  protected state: "idle" | "hovered" | "end-hover";
  protected heldItem: string | null;

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
      this.eventEmitter.emit("interact", new InteractEvent(this));
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
    }
  }

  // Methods to handle interaction
  // Returns success of operation
  public abstract setHeldItem(incomingItem: string): boolean;
  // Returns held item if any
  public abstract getHeldItem(): string | null;
}
