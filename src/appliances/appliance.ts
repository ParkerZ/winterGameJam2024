import { ApplianceEventEmitter, ExchangeEvent, InteractEvent } from "@/events";
import { Food } from "@/foodStuffs/food";
import { Resources, getRandomClickSound, spriteScale } from "@/resources";
import { HighlightArrow } from "@/ui/highlightArrow";
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

  protected activeIndicator: Actor;
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

    this.activeIndicator = new HighlightArrow({ pos: vec(-15, -120), z: 7 });
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
      this.eventEmitter.emit("hoverStart", new InteractEvent(this));
    });

    this.on("pointerleave", (evt) => {
      // Queue up a check for hover end. This event fires on click.
      if (this.state === "hovered") {
        this.state = "end-hover";
      }
    });
  }

  onPostUpdate(engine: Engine<any>, elapsedMs: number): void {
    // Check if the mouse is no longer over the element before clearing state.
    if (
      this.state === "end-hover" &&
      !this.graphics.bounds.contains(engine.input.pointers.primary.lastWorldPos)
    ) {
      this.state = "idle";
      engine.remove(this.activeIndicator);
      this.stopInteract();
      this.eventEmitter.emit("hoverEnd", new InteractEvent(this));
    }
  }

  public setActive(active: boolean, engine: Engine<any>) {
    if (active && !this.isActiveAppliance) {
      this.isActiveAppliance = true;
      this.addChild(this.activeIndicator);
      getRandomClickSound().play();
    } else if (!active) {
      this.isActiveAppliance = false;
      engine.remove(this.activeIndicator);
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
