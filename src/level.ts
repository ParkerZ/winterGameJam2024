import {
  DefaultLoader,
  Engine,
  ExcaliburGraphicsContext,
  Scene,
  SceneActivationContext,
} from "excalibur";
import { Fridge } from "./appliances/fridge";
import { Glove } from "./glove";
import { ApplianceEventEmitter } from "./events";
import { Counter } from "./appliances/counter";
import { Stove } from "./appliances/stove";
import { Trash } from "./appliances/trash";
import { BunCrate } from "./appliances/bunCrate";

export class MyLevel extends Scene {
  override onInitialize(engine: Engine): void {
    // Create shared event emitter to connect appliance interactions to player
    const applianceEventEmitter = new ApplianceEventEmitter();

    const door = new Fridge(applianceEventEmitter);
    const counter = new Counter(applianceEventEmitter);
    const stove = new Stove(applianceEventEmitter);
    const bunCrate = new BunCrate(applianceEventEmitter);
    const trash = new Trash(applianceEventEmitter);
    const glove = new Glove(applianceEventEmitter);

    this.add(door);
    this.add(counter);
    this.add(stove);
    this.add(bunCrate);
    this.add(trash);
    this.add(glove);
  }

  override onPreLoad(loader: DefaultLoader): void {
    // Add any scene specific resources to load
  }

  override onActivate(context: SceneActivationContext<unknown>): void {
    // Called when Excalibur transitions to this scene
    // Only 1 scene is active at a time
  }

  override onDeactivate(context: SceneActivationContext): void {
    // Called when Excalibur transitions away from this scene
    // Only 1 scene is active at a time
  }

  override onPreUpdate(engine: Engine, elapsedMs: number): void {
    // Called before anything updates in the scene
  }

  override onPostUpdate(engine: Engine, elapsedMs: number): void {
    // Called after everything updates in the scene
  }

  override onPreDraw(ctx: ExcaliburGraphicsContext, elapsedMs: number): void {
    // Called before Excalibur draws to the screen
  }

  override onPostDraw(ctx: ExcaliburGraphicsContext, elapsedMs: number): void {
    // Called after Excalibur draws to the screen
  }
}
