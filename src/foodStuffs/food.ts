import { FoodEventEmitter } from "@/events";
import { Actor, Engine, ScreenElement, Sprite, Vector } from "excalibur";

export type FoodState = "idle" | "cooking" | "chopping";
export class Food extends ScreenElement {
  public events = new FoodEventEmitter();
  protected sprite: Sprite;
  protected state: FoodState;
  public isBurgerCompatible = false;
  public isBurgerBase = false;
  public allowsInteraction: boolean = false;

  constructor({
    name,
    sprite,
    anchor = Vector.Half,
  }: {
    name: string;
    sprite: Sprite;
    anchor?: Vector;
  }) {
    super({ name, anchor });

    this.sprite = sprite;
    this.state = "idle";
  }

  onInitialize(engine: Engine<any>): void {
    this.graphics.add(this.sprite);
  }

  public setState(newState: FoodState) {
    this.state = newState;
  }

  public getState(): FoodState {
    return this.state;
  }
}
