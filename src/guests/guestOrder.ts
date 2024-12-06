import { Actor, Engine, ScreenElement, Vector, vec } from "excalibur";
import { Resources } from "../resources";
import { Burger } from "../foodStuffs/burger";
import { GuestEventEmitter } from "../events";

export type Difficulty = "easy" | "medium" | "hard" | "na";

export const DifficultyOptions: Record<string, Difficulty> = {
  Easy: "easy",
  Medium: "medium",
  Hard: "hard",
  NA: "na",
};

export class GuestOrder extends ScreenElement {
  protected ingredients: Set<string>;
  protected burger: Burger;

  protected eventEmitter: GuestEventEmitter;

  constructor(eventEmitter: GuestEventEmitter, difficulty: Difficulty) {
    super({
      pos: vec(600, 100),
      anchor: Vector.Half,
    });

    const ingredients = new Set(["Patty"]);
    if (Math.random() * 2 >= 1) {
      ingredients.add("Cheese");
    }

    if (difficulty === DifficultyOptions.Medium) {
      ingredients.add("TomatoSlice");
    }

    this.ingredients = new Set(ingredients);
    this.burger = new Burger(this.ingredients);

    this.eventEmitter = eventEmitter;
  }

  onInitialize(engine: Engine<any>): void {
    const sprite = Resources.OrderBanner.toSprite();
    sprite.scale = vec(0.5, 0.5);
    this.graphics.use(sprite);
    this.addChild(this.burger);
    this.burger.pos = this.burger.pos.add(vec(0, 60));
  }

  public doesBurgerMatchOrder(incomingBurger: Burger): boolean {
    if (
      this.burger.getIngredients().size !== incomingBurger.getIngredients().size
    ) {
      return false;
    }

    return Array.from(this.burger.getIngredients()).every((ingredient) =>
      incomingBurger.getIngredients().has(ingredient)
    );
  }
}
