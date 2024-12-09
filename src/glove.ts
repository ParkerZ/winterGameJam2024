import { Engine, Scene, ScreenElement, Vector, vec } from "excalibur";
import { Resources } from "./resources";
import { Fridge } from "./appliances/fridge";
import {
  AbilityCompleteEvent,
  ApplianceEventEmitter,
  GuestEventEmitter,
} from "./events";
import { Appliance } from "./appliances/appliance";
import { Food } from "./foodStuffs/food";
import { Burger } from "./foodStuffs/burger";
import { Bun } from "./foodStuffs/bun";
import { BunCrate } from "./appliances/bunCrate";
import { TomatoCrate } from "./appliances/tomatoCrate";
import { CheeseCrate } from "./appliances/cheeseCrate";
import { GuestOrder } from "./guests/guestOrder";
import { Guest, GuestStates } from "./guests/guest";
import { PlayerData } from "./playerData";

export type GuestInteractionOverride = "none" | "autoFulfill" | "remove";

export const GuestInteractionOverrides: Record<
  string,
  GuestInteractionOverride
> = {
  None: "none",
  AutoFulfill: "autoFulfill",
  Remove: "remove",
};

export class Glove extends ScreenElement {
  protected heldItem: Food | null;
  protected applianceEventEmitter: ApplianceEventEmitter;
  protected guestEventEmitter: GuestEventEmitter;
  protected guestInteractionOverride: GuestInteractionOverride;

  constructor(
    applianceEventEmitter: ApplianceEventEmitter,
    guestEventEmitter: GuestEventEmitter
  ) {
    super({
      name: "Glove",
      z: 2,
      anchor: Vector.Half,
    });

    this.applianceEventEmitter = applianceEventEmitter;
    this.guestEventEmitter = guestEventEmitter;

    this.heldItem = null;

    this.guestInteractionOverride = GuestInteractionOverrides.None;
  }

  onInitialize(engine: Engine<any>): void {
    const sprite = Resources.Glove.toSprite();
    sprite.scale = vec(0.5, 0.5);
    this.graphics.use(sprite);

    this.applianceEventEmitter.on("exchange", (evt) => {
      if (this.guestInteractionOverride === GuestInteractionOverrides.None) {
        this.onExchangeWithAppliance(evt.appliance);
      }
    });

    this.applianceEventEmitter.on("interactStart", (evt) => {
      if (this.guestInteractionOverride === GuestInteractionOverrides.None) {
        this.onInteractWithApplianceStart(evt.appliance);
      }
    });

    this.applianceEventEmitter.on("InteractStop", (evt) => {
      if (this.guestInteractionOverride === GuestInteractionOverrides.None) {
        this.onInteractWithApplianceStop(evt.appliance);
      }
    });

    this.guestEventEmitter.on("interact", (evt) => {
      this.interactWithGuest(evt.guest);
    });

    this.guestEventEmitter.on("autoFulfillActivate", (evt) => {
      this.guestInteractionOverride = GuestInteractionOverrides.AutoFulfill;
    });

    this.guestEventEmitter.on("removeActivate", (evt) => {
      this.guestInteractionOverride = GuestInteractionOverrides.Remove;
    });

    this.guestEventEmitter.on("autoFulfillConfirm", (evt) => {
      this.guestInteractionOverride = GuestInteractionOverrides.None;
    });

    this.guestEventEmitter.on("removeConfirm", (evt) => {
      this.guestInteractionOverride = GuestInteractionOverrides.None;
    });

    this.guestEventEmitter.on("abilityCancel", (evt) => {
      this.guestInteractionOverride = GuestInteractionOverrides.None;
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

  private interactWithGuest(guest: Guest) {
    const guestState = guest.getState();

    switch (guestState) {
      case GuestStates.Idle:
        this.interactWithIdleGuest(guest);
        break;
      case GuestStates.Ordering:
        this.interactWithOrderingGuest(guest);
        break;
      case GuestStates.Activating:
        this.interactWithActiveGuest(guest);
        break;
    }
  }

  private interactWithIdleGuest(guest: Guest) {
    if (this.guestInteractionOverride === GuestInteractionOverrides.Remove) {
      PlayerData.remove(guest);
      this.guestEventEmitter.emit(
        "removeConfirm",
        new AbilityCompleteEvent(guest)
      );
      return;
    }

    // Auto fulfill orders in this mode, no item will be held in this mode
    if (
      this.guestInteractionOverride === GuestInteractionOverrides.AutoFulfill &&
      guest.canBeAutoFulfilled
    ) {
      guest.completeOrder();
      this.guestEventEmitter.emit(
        "autoFulfillConfirm",
        new AbilityCompleteEvent(guest)
      );

      return;
    }

    // Can't initiate interaction if holding something
    if (this.heldItem) {
      return;
    }

    guest.orderOrActivate();
  }

  private interactWithOrderingGuest(guest: Guest) {
    if (this.guestInteractionOverride === GuestInteractionOverrides.Remove) {
      PlayerData.remove(guest);
      this.guestEventEmitter.emit(
        "removeConfirm",
        new AbilityCompleteEvent(guest)
      );
      return;
    }

    // Auto fulfill orders in this mode, no item will be held in this mode
    if (
      this.guestInteractionOverride === GuestInteractionOverrides.AutoFulfill
    ) {
      guest.completeOrder();
      this.guestEventEmitter.emit(
        "autoFulfillConfirm",
        new AbilityCompleteEvent(guest)
      );

      return;
    }

    // Must be holding a burger to fulfill
    if (!this.heldItem || !(this.heldItem instanceof Burger)) {
      return;
    }

    const success = guest.doesBurgerMatchOrder(this.heldItem);
    if (success) {
      this.removeChild(this.heldItem);
      this.heldItem = null;
      guest.completeOrder();
    }
  }

  private interactWithActiveGuest(guest: Guest) {
    if (this.guestInteractionOverride === GuestInteractionOverrides.Remove) {
      PlayerData.remove(guest);
      this.guestEventEmitter.emit(
        "removeConfirm",
        new AbilityCompleteEvent(guest)
      );
      return;
    }
  }

  onPreKill(scene: Scene<unknown>): void {
    this.applianceEventEmitter.clear();
    this.guestEventEmitter.clear();
  }
}
