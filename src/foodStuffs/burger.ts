import { Resources } from "@/resources";
import { Food } from "./food";
import { Engine, GraphicsGroup, Vector, vec } from "excalibur";

const burgerIngredientSpriteMap = {
  Patty: Resources.Burger,
  TomatoSlice: Resources.TomatoSlice,
  Cheese: Resources.Cheese,
};

export class Burger extends Food {
  protected ingredients: Set<string>;

  constructor() {
    const sprite = Resources.BunBottom.toSprite();
    sprite.scale = vec(0.5, 0.5);
    super({
      name: "Burger",
      sprite,
    });

    this.ingredients = new Set();
    this.isBurgerCompatible = true;
    this.isBurgerBase = true;
  }

  private updateGraphics() {
    const members = [
      {
        graphic: this.sprite,
        offset: Vector.Zero,
      },
    ];

    const sortedIngredients = [];
    if (this.ingredients.has("TomatoSlice"))
      sortedIngredients.push("TomatoSlice");
    if (this.ingredients.has("Patty")) sortedIngredients.push("Patty");
    if (this.ingredients.has("Cheese")) sortedIngredients.push("Cheese");

    sortedIngredients.forEach((ingredient, i) => {
      const newSprite = burgerIngredientSpriteMap[ingredient].toSprite();
      newSprite.scale = vec(0.5, 0.5);
      members.push({ graphic: newSprite, offset: vec(0, -20 * (i + 1)) });
    });

    const newSprite = Resources.BunTop.toSprite();
    newSprite.scale = vec(0.5, 0.5);
    members.push({ graphic: newSprite, offset: vec(0, -20 * members.length) });

    this.graphics.use(new GraphicsGroup({ members }));
  }

  onInitialize(engine: Engine<any>): void {
    super.onInitialize(engine);

    this.updateGraphics();
  }

  public addIngredient(ingredient: Food): boolean {
    if (this.ingredients.has(ingredient.name)) {
      return false;
    }

    this.ingredients.add(ingredient.name);
    this.updateGraphics();
    return true;
  }
}
