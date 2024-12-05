import { Actor, Engine, EventEmitter, Vector, vec } from "excalibur";
import { Resources } from "./resources";
import { Fridge } from "./appliances/fridge";
import { ApplianceEventEmitter } from "./events";
import { Appliance } from "./appliances/appliance";
import { Food } from "./foodStuffs/food";
import { Burger } from "./foodStuffs/burger";
import { Bun } from "./foodStuffs/bun";
import { BunCrate } from "./appliances/bunCrate";
import { TomatoCrate } from "./appliances/tomatoCrate";
import { CheeseCrate } from "./appliances/cheeseCrate";

export class Glove extends Actor {
  protected heldItem: Food | null;
  protected applianceEventEmitter: ApplianceEventEmitter;
  private heldItemOffset: Vector = vec(50, 50);

  constructor(applianceEventEmitter: ApplianceEventEmitter) {
    super({
      name: "Glove",
      x: 2,
    });

    this.applianceEventEmitter = applianceEventEmitter;

    this.heldItem = null;
  }

  onInitialize(engine: Engine<any>): void {
    const sprite = Resources.Glove.toSprite();
    sprite.scale = vec(0.5, 0.5);
    this.graphics.use(sprite);

    this.applianceEventEmitter.on("exchange", (evt) => {
      this.onExchangeWithAppliance(evt.appliance);
    });

    this.applianceEventEmitter.on("interactStart", (evt) => {
      this.onInteractWithApplianceStart(evt.appliance);
    });

    this.applianceEventEmitter.on("InteractStop", (evt) => {
      this.onInteractWithApplianceStop(evt.appliance);
    });
  }

  onPreUpdate(engine: Engine<any>, elapsedMs: number): void {
    this.pos = engine.input.pointers.primary.lastWorldPos;
  }

  private onExchangeWithAppliance(appliance: Appliance) {
    const otherItem = appliance.getHeldItem();

    if (this.heldItem && !otherItem) {
      this.giveHeldItemToAppliance(appliance);
    } else if (!this.heldItem && otherItem) {
      this.heldItem = otherItem;
      this.addChild(this.heldItem);
    } else if (this.heldItem && otherItem) {
      // If both have an item, determine which goes where
      // First, drop and return food if holding the same food as a food spawn appliance
      if (
        (appliance instanceof Fridge ||
          appliance instanceof BunCrate ||
          appliance instanceof TomatoCrate ||
          appliance instanceof CheeseCrate) &&
        this.heldItem.constructor === otherItem.constructor
      ) {
        // if holding the same food as a fridge, return other and drop held
        this.giveHeldItemToAppliance(appliance);
        return;
      }

      // Then, check if we can combine the two items into a burger
      let shouldReturnItem = true;
      if ([this.heldItem, otherItem].every((food) => food.isBurgerCompatible)) {
        if (this.heldItem.isBurgerBase && !otherItem.isBurgerBase) {
          // Try to combine ingredients using held item as base
          const burger = this.makeBurgerFromEligibleIngredients(
            this.heldItem,
            otherItem
          );
          if (burger) {
            // If successful, clear items and hold on to resulting burger
            this.holdBurger(burger);
            shouldReturnItem = false;
          }
        } else if (!this.heldItem.isBurgerBase && otherItem.isBurgerBase) {
          // Try to combine ingredients using other item as base
          const burger = this.makeBurgerFromEligibleIngredients(
            this.heldItem,
            otherItem
          );
          if (burger) {
            // If successful, give resulting burger to appliance UNLESS it is a bun crate
            if (appliance instanceof BunCrate) {
              this.holdBurger(burger);
            } else {
              appliance.setHeldItem(burger);
              this.removeChild(this.heldItem);
              this.heldItem = null;
            }
            shouldReturnItem = false;
          }
        }
      }

      // If we haven't figured out anything to do, give the appliance its item back
      if (shouldReturnItem) {
        appliance.setHeldItem(otherItem);
      }
    }
  }

  private giveHeldItemToAppliance(appliance: Appliance) {
    const giveSuccess = appliance.setHeldItem(this.heldItem);
    if (giveSuccess) {
      this.removeChild(this.heldItem);
      this.heldItem = null;
    }
  }

  private holdBurger(burger: Burger) {
    this.removeChild(this.heldItem);
    this.heldItem = burger;
    this.addChild(this.heldItem);
  }

  private makeBurgerFromEligibleIngredients(
    food1: Food,
    food2: Food
  ): Burger | null {
    if (food1 instanceof Bun) {
      const burger = new Burger();
      burger.addIngredient(food2);
      return burger;
    } else if (food2 instanceof Bun) {
      const burger = new Burger();
      burger.addIngredient(food1);
      return burger;
    } else if (food1 instanceof Burger) {
      const success = food1.addIngredient(food2);
      return success ? food1 : null;
    } else if (food2 instanceof Burger) {
      const success = food2.addIngredient(food1);
      return success ? food2 : null;
    }

    return null;
  }

  private onInteractWithApplianceStart(appliance: Appliance) {
    // Lets see if the item on the appliance is interactive
    const otherItem = appliance.getHeldItem();
    if (!this.heldItem && otherItem && otherItem.allowsInteraction) {
      otherItem.setState("chopping");
    }

    // Make sure to give the appliance its item back
    if (otherItem) {
      appliance.setHeldItem(otherItem);
    }
  }

  private onInteractWithApplianceStop(appliance: Appliance) {}
}
