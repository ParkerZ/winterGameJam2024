import { Resources } from "@/resources";
import { Food } from "./food";
import { Engine, vec } from "excalibur";

export class Mince extends Food {
  private elapsedCookTime: number;
  private lastCookCheckTime: number;
  private cookingTimeThreshold: number = 1000;

  constructor() {
    const sprite = Resources.Mince.toSprite();
    sprite.scale = vec(0.5, 0.5);
    super({
      name: "Mince",
      sprite,
    });

    this.lastCookCheckTime = 0;
    this.elapsedCookTime = 0;
  }

  onPostUpdate(engine: Engine<any>, elapsedMs: number): void {
    if (this.state === "cooking") {
      const now = Date.now();
      if (!this.lastCookCheckTime) {
        this.lastCookCheckTime = now;
      }

      const elapsedMs = now - this.lastCookCheckTime;
      this.elapsedCookTime += elapsedMs;
      this.lastCookCheckTime = now;
      if (this.elapsedCookTime > this.cookingTimeThreshold) {
        this.events.emit("cooked");
      }
    } else {
      this.lastCookCheckTime = 0;
    }
  }
}
