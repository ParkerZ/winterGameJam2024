import { Actor, Engine, ScreenElement, Vector, vec } from "excalibur";
import { Resources } from "../resources";
import { Burger } from "../foodStuffs/burger";
import { GuestEventEmitter, OrderInteractEvent } from "../events";

export type Difficulty = "easy" | "medium" | "hard" | "na";

export const DifficultyOptions: Record<string, Difficulty> = {
  Easy: "easy",
  Medium: "medium",
  Hard: "hard",
  None: "na",
};

export class GuestOrder extends ScreenElement {
  protected ingredients: Set<string>;
  protected burger: Burger;

  protected eventEmitter: GuestEventEmitter;

  constructor(eventEmitter: GuestEventEmitter, difficulty: Difficulty) {
    super({
      pos: vec(0, -110),
      anchor: Vector.Half,
    });

    const ingredients = new Set(["Patty"]);
    if (Math.random() * 2 >= 1) {
      ingredients.add("Cheese");
    }

    if (difficulty === DifficultyOptions.Medium) {
      if (Math.random() * 2 >= 1) {
        ingredients.add("TomatoSlice");
      } else {
        ingredients.add("LettuceSlice");
      }
    }

    if (difficulty === DifficultyOptions.Hard) {
      ingredients.add("LettuceSlice");
      ingredients.add("TomatoSlice");
    }

    this.ingredients = new Set(ingredients);
    this.burger = new Burger(this.ingredients);

    this.eventEmitter = eventEmitter;
  }

  onInitialize(engine: Engine<any>): void {
    const sprite = Resources.ThoughtBubble.toSprite();
    sprite.scale = vec(0.55, 0.55);
    this.graphics.use(sprite);
    this.addChild(this.burger);
    this.burger.pos = this.burger.pos.add(vec(1, 7));

    this.on("pointerdown", () => {
      if (this.eventEmitter) {
        this.eventEmitter.emit("interactOrder", new OrderInteractEvent(this));
      }
    });
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
