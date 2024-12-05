import { ActorEvents, EventEmitter, GameEvent } from "excalibur";
import { Fridge } from "./appliances/fridge";
import { Appliance } from "./appliances/appliance";
import { Food } from "./foodStuffs/food";

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
