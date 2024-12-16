import { Resources } from "@/resources";
import { Food } from "./food";
import { Engine, GraphicsGroup, Vector, vec } from "excalibur";

const burgerIngredientSpriteMap = {
  Patty: Resources.Burger,
  TomatoSlice: Resources.TomatoSlice,
  LettuceSlice: Resources.LettuceSlice,
  Cheese: Resources.Cheese,
};

const burgerIngredientHeightMap = {
  Patty: 12,
  Cheese: 8,
  LettuceSlice: 4,
  TomatoSlice: 6,
};

const burgerIngredientXOffsetMap = {
  Patty: 1,
  Cheese: -3,
  LettuceSlice: -1,
  TomatoSlice: 2,
};

export class Burger extends Food {
  protected ingredients: Set<string>;

  constructor(ingredients: Set<string> = new Set()) {
    const sprite = Resources.BunBottom.toSprite();
    sprite.scale = vec(0.5, 0.5);
    super({
      name: "Burger",
      sprite,
      anchor: Vector.Half,
    });

    this.ingredients = new Set(ingredients);
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
    let runningHeight = 0;
    if (this.ingredients.has("LettuceSlice"))
      sortedIngredients.push("LettuceSlice");
    if (this.ingredients.has("TomatoSlice"))
      sortedIngredients.push("TomatoSlice");
    if (this.ingredients.has("Patty")) sortedIngredients.push("Patty");
    if (this.ingredients.has("Cheese")) sortedIngredients.push("Cheese");

    sortedIngredients.forEach((ingredient, i) => {
      const newSprite = burgerIngredientSpriteMap[ingredient].toSprite();
      newSprite.scale = vec(0.5, 0.5);
      runningHeight += burgerIngredientHeightMap[ingredient];
      members.push({
        graphic: newSprite,
        offset: vec(burgerIngredientXOffsetMap[ingredient], -1 * runningHeight),
      });
    });

    runningHeight += 16;
    const newSprite = Resources.BunTop.toSprite();
    newSprite.scale = vec(0.5, 0.5);
    members.push({
      graphic: newSprite,
      offset: vec(1, -1 * runningHeight),
    });

    // Align all members
    members.forEach((member) => (member.offset.y += runningHeight / 2));

    this.graphics.use(new GraphicsGroup({ members }));
  }

  onInitialize(engine: Engine<any>): void {
    super.onInitialize(engine);

    const sp = Resources.Burger.toSprite();
    sp.scale = Vector.Half;
    this.graphics.use(sp);

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

  public getIngredients(): Set<string> {
    return this.ingredients;
  }
}
