import { Resources } from "@/resources";
import { Food } from "./food";
import { Engine, vec } from "excalibur";
import { PlayerData } from "@/playerData";

export class Lettuce extends Food {
  private elapsedChopTime: number;
  private lastChopCheckTime: number;

  constructor() {
    const sprite = Resources.Lettuce.toSprite();
    sprite.scale = vec(0.5, 0.5);
    super({
      name: "Lettuce",
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
      if (this.elapsedChopTime > PlayerData.choppingTimeThreshold) {
        this.events.emit("chopped");
      }
    } else {
      this.lastChopCheckTime = 0;
    }
  }
}
