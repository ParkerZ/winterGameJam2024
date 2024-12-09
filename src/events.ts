import { ActorEvents, EventEmitter, GameEvent } from "excalibur";
import { Fridge } from "./appliances/fridge";
import { Appliance } from "./appliances/appliance";
import { Food } from "./foodStuffs/food";
import { GuestOrder } from "./guests/guestOrder";
import { Guest } from "./guests/guest";

export class ExchangeEvent extends GameEvent<Appliance> {
  constructor(public appliance: Appliance) {
    super();
  }
}

export class InteractEvent extends GameEvent<Appliance> {
  constructor(public appliance: Appliance) {
    super();
  }
}

export type ApplianceEvents = {
  exchange: ExchangeEvent;
  interact: InteractEvent;
  interactStart: InteractEvent;
  InteractStop: InteractEvent;
};

export class ApplianceEventEmitter extends EventEmitter<
  ActorEvents & ApplianceEvents
> {
  constructor() {
    super();
  }
}

export class CookedEvent extends GameEvent<Food> {
  constructor() {
    super();
  }
}

export class ChoppedEvent extends GameEvent<Food> {
  constructor() {
    super();
  }
}

export type FoodEvents = {
  cooked: CookedEvent;
  chopped: ChoppedEvent;
};

export class FoodEventEmitter extends EventEmitter<ActorEvents & FoodEvents> {
  constructor() {
    super();
  }
}

export class ClearOrderEvent extends GameEvent<Guest> {
  constructor(public guest: Guest) {
    super();
  }
}

export class GuestInteractEvent extends GameEvent<Guest> {
  constructor(public guest: Guest) {
    super();
  }
}

export class AbilityActivateEvent extends GameEvent<Guest> {
  constructor() {
    super();
  }
}

export class AbilityCompleteEvent extends GameEvent<Guest> {
  constructor(public guest: Guest) {
    super();
  }
}

export class AbilityCancelEvent extends GameEvent<Guest> {
  constructor() {
    super();
  }
}

export type GuestEvents = {
  interact: GuestInteractEvent;
  clearOrder: ClearOrderEvent;
  autoFulfillActivate: AbilityActivateEvent;
  autoFulfillConfirm: AbilityCompleteEvent;
  removeActivate: AbilityActivateEvent;
  removeConfirm: AbilityCompleteEvent;
  abilityCancel: AbilityCancelEvent;
};

export class GuestEventEmitter extends EventEmitter<ActorEvents & GuestEvents> {
  constructor() {
    super();
  }
}
