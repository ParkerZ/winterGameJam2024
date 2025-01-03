import { Engine, Scene, ScreenElement, Vector, vec } from "excalibur";
import {
  Resources,
  chopVolume,
  getRandomChopSound,
  getRandomClickSound,
  grabVolume,
  orderVolume,
} from "./resources";
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

  protected activeAppliances: Array<Appliance> = [];
  protected activeGuest: Guest | null = null;

  constructor(
    applianceEventEmitter: ApplianceEventEmitter,
    guestEventEmitter: GuestEventEmitter
  ) {
    super({
      name: "Glove",
      z: 50,
      anchor: Vector.Half,
    });

    this.applianceEventEmitter = applianceEventEmitter;
    this.guestEventEmitter = guestEventEmitter;

    this.heldItem = null;

    this.guestInteractionOverride = GuestInteractionOverrides.None;
  }

  onInitialize(engine: Engine<any>): void {
    this.activeAppliances = [];
    const sprite = Resources.Glove.toSprite();
    sprite.scale = vec(0.5, 0.5);
    this.graphics.use(sprite);

    this.applianceEventEmitter.on("exchange", (evt) => {
      if (this.guestInteractionOverride === GuestInteractionOverrides.None) {
        if (
          this.activeAppliances.length &&
          this.activeAppliances[0] === evt.appliance
        ) {
          this.onExchangeWithAppliance(evt.appliance);
        }
      }
    });

    this.applianceEventEmitter.on("interactStart", (evt) => {
      if (this.guestInteractionOverride === GuestInteractionOverrides.None) {
        if (
          this.activeAppliances.length &&
          this.activeAppliances[0] === evt.appliance
        ) {
          this.onInteractWithApplianceStart(evt.appliance);
        }
      }
    });

    this.applianceEventEmitter.on("InteractStop", (evt) => {
      if (this.guestInteractionOverride === GuestInteractionOverrides.None) {
        this.onInteractWithApplianceStop(evt.appliance);
      }
    });

    // Appliances can overlap other appliances and guests
    this.applianceEventEmitter.on("hoverStart", (evt) => {
      if (
        this.guestInteractionOverride === GuestInteractionOverrides.None &&
        !this.activeAppliances.includes(evt.appliance)
      ) {
        // Add hovered to font of list and mark all other hovered appliances as inactive
        this.activeAppliances.forEach((app) => app.setActive(false, engine));
        evt.appliance.setActive(true, engine);
        this.activeAppliances.unshift(evt.appliance);

        if (this.activeGuest) {
          this.activeGuest.setActive(false);
        }
      }
    });

    this.applianceEventEmitter.on("hoverEnd", (evt) => {
      if (
        this.guestInteractionOverride === GuestInteractionOverrides.None &&
        this.activeAppliances.includes(evt.appliance)
      ) {
        // Remove all unhovered activeAppliances, set first remaining to active
        this.activeAppliances = this.activeAppliances.filter((app) => {
          const isHovered = app.graphics.bounds.contains(
            engine.input.pointers.primary.lastWorldPos
          );

          if (!isHovered) {
            app.setActive(false, engine);
          }

          return isHovered;
        });

        if (this.activeAppliances.length) {
          this.activeAppliances[0].setActive(true, engine);
        } else if (this.activeGuest) {
          this.activeGuest.setActive(true);
        }
      }
    });

    // Guests can overlap appliances
    this.guestEventEmitter.on("hoverStart", (evt) => {
      if (
        this.guestInteractionOverride === GuestInteractionOverrides.None &&
        this.activeGuest === null
      ) {
        this.activeGuest = evt.guest;

        if (!this.activeAppliances.length) {
          this.activeGuest.setActive(true);
        }
      }
    });

    this.guestEventEmitter.on("hoverEnd", (evt) => {
      if (
        this.guestInteractionOverride === GuestInteractionOverrides.None &&
        this.activeGuest === evt.guest
      ) {
        this.activeGuest.setActive(false);
        this.activeGuest = null;
      }
    });

    this.guestEventEmitter.on("interact", (evt) => {
      if (this.activeAppliances.length === 0) {
        this.interactWithGuest(evt.guest, engine);
      }
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
      this.heldItem.z = -1;
      this.addChild(this.heldItem);
      this.heldItem.pos = vec(-25, -25);
      Resources.soundGrab.play(grabVolume);
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

            PlayerData.onBurgerMade(burger);
          }
        } else if (!this.heldItem.isBurgerBase && otherItem.isBurgerBase) {
          // Try to combine ingredients using other item as base
          const burger = this.makeBurgerFromEligibleIngredients(
            this.heldItem,
            otherItem
          );
          if (burger) {
            PlayerData.onBurgerMade(burger);

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
    Resources.soundGrab.play(grabVolume);
    this.removeChild(this.heldItem);
    this.heldItem = burger;
    this.addChild(this.heldItem);
    this.heldItem.pos = vec(-25, -25);
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
      getRandomChopSound().play(chopVolume);
    }

    // Make sure to give the appliance its item back
    if (otherItem) {
      appliance.setHeldItem(otherItem);
    }
  }

  private onInteractWithApplianceStop(appliance: Appliance) {}

  private interactWithGuest(guest: Guest, engine: Engine<any>) {
    const guestState = guest.getState();

    switch (guestState) {
      case GuestStates.Idle:
        this.interactWithIdleGuest(guest, engine);
        break;
      case GuestStates.Ordering:
        this.interactWithOrderingGuest(guest, engine);
        break;
      case GuestStates.Activating:
        this.interactWithActiveGuest(guest, engine);
        break;
    }
  }

  private interactWithIdleGuest(guest: Guest, engine: Engine<any>) {
    if (this.guestInteractionOverride === GuestInteractionOverrides.Remove) {
      PlayerData.remove(guest, engine);
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
      if (guest.canBeAutoFulfilled) {
        guest.completeOrder();
        this.guestEventEmitter.emit(
          "autoFulfillConfirm",
          new AbilityCompleteEvent(guest)
        );
      }

      return;
    }

    // Can't initiate interaction if holding something
    if (this.heldItem) {
      return;
    }

    guest.orderOrActivate();
  }

  private interactWithOrderingGuest(guest: Guest, engine: Engine<any>) {
    if (this.guestInteractionOverride === GuestInteractionOverrides.Remove) {
      PlayerData.remove(guest, engine);
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
      Resources.soundWrong.play(orderVolume);
      return;
    }

    const success = guest.doesBurgerMatchOrder(this.heldItem);
    if (success) {
      this.removeChild(this.heldItem);
      this.heldItem = null;
      guest.completeOrder();
    } else {
      Resources.soundWrong.play(orderVolume);
    }
  }

  private interactWithActiveGuest(guest: Guest, engine: Engine<any>) {
    if (this.guestInteractionOverride === GuestInteractionOverrides.Remove) {
      PlayerData.remove(guest, engine);
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
