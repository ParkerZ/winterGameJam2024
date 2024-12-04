import { ActorEvents, EventEmitter, GameEvent } from "excalibur";
import { Fridge } from "./appliances/fridge";
import { Appliance } from "./appliances/appliance";

export class InteractEvent extends GameEvent<Fridge> {
  constructor(public appliance: Appliance) {
    super();
  }
}

export type ApplianceEvents = {
  interact: InteractEvent;
};

export class ApplianceEventEmitter extends EventEmitter<
  ActorEvents & ApplianceEvents
> {
  constructor() {
    super();
  }
}
