import { ApplianceEventEmitter, ExchangeEvent, InteractEvent } from "@/events";
import { Food } from "@/foodStuffs/food";
import { Resources, getRandomClickSound, spriteScale } from "@/resources";
import {
  Actor,
  Buttons,
  Color,
  Engine,
  PointerButton,
  ScreenElement,
  Sprite,
  Vector,
  vec,
} from "excalibur";

export abstract class Appliance extends ScreenElement {
  protected sprite: Sprite;

  protected tempHighlight: Actor;
  protected state: "idle" | "hovered" | "end-hover";
  protected allowsInteraction: boolean = false;
  protected heldItem: Food | null;
  protected isActiveAppliance: boolean = false;

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
      anchor: Vector.Half,
    });

    this.eventEmitter = eventEmitter;
    this.sprite = sprite;
    this.sprite.scale = spriteScale;

    this.heldItem = null;

    this.state = "idle";

    this.pointer.useGraphicsBounds = true;

    // TODO: Fix highlights for active element
    this.tempHighlight = new ScreenElement({
      x: this.pos.x,
      y: this.pos.y,
      width: 50,
      height: 50,
      color: Color.Green,
      anchor: Vector.Half,
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
      this.eventEmitter.emit("hoverStart", new InteractEvent(this));
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
      this.eventEmitter.emit("hoverEnd", new InteractEvent(this));
    }
  }

  public setActive(active: boolean, engine: Engine<any>) {
    if (active && !this.isActiveAppliance) {
      this.isActiveAppliance = true;
      engine.add(this.tempHighlight);
      getRandomClickSound().play();
    } else if (!active) {
      this.isActiveAppliance = false;
      engine.remove(this.tempHighlight);
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
