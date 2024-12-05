import { Resources } from "@/resources";
import { Food } from "./food";
import { Engine, vec } from "excalibur";

export class Tomato extends Food {
  private elapsedChopTime: number;
  private lastChopCheckTime: number;
  private choppingTimeThreshold: number = 1000;

  constructor() {
    const sprite = Resources.Tomato.toSprite();
    sprite.scale = vec(0.5, 0.5);
    super({
      name: "Tomato",
      sprite,
    });

    this.lastChopCheckTime = 0;
    this.elapsedChopTime = 0;
    this.allowsInteraction = true;
  }

  onPostUpdate(engine: Engine<any>, elapsedMs: number): void {
    if (this.state === "chopping") {
      const now = Date.now();
      if (!this.lastChopCheckTime) {
        this.lastChopCheckTime = now;
      }

      const elapsedMs = now - this.lastChopCheckTime;
      this.elapsedChopTime += elapsedMs;
      this.lastChopCheckTime = now;
      if (this.elapsedChopTime > this.choppingTimeThreshold) {
        this.events.emit("chopped");
      }
    } else {
      this.lastChopCheckTime = 0;
    }
  }
}
