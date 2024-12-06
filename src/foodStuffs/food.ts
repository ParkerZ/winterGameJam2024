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

  constructor({ name, sprite }: { name: string; sprite: Sprite }) {
    super({ name, anchor: Vector.Half });

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
