import { Resources, colorPrimaryCash, colorSecondaryCash } from "@/resources";
import { Food } from "./food";
import { Engine, vec } from "excalibur";
import { PlayerData } from "@/playerData";
import { StatusBar } from "@/ui/statusBar";

export class Mince extends Food {
  private elapsedCookTime: number;
  private lastCookCheckTime: number;
  private cookBar: StatusBar;
  private isCookBarRendered: boolean = false;

  constructor() {
    const sprite = Resources.Mince.toSprite();
    sprite.scale = vec(0.5, 0.5);
    super({
      name: "Mince",
      sprite,
    });

    this.lastCookCheckTime = 0;
    this.elapsedCookTime = 0;
    this.cookBar = new StatusBar({
      x: 0,
      y: -20,
      z: 2,
      maxVal: PlayerData.cookingTimeThreshold,
      size: "md",
      color: colorPrimaryCash,
      complementaryColor: colorSecondaryCash,
    });
  }

  onPostUpdate(engine: Engine<any>, elapsedMs: number): void {
    if (this.state === "cooking") {
      if (!this.isCookBarRendered) {
        this.addChild(this.cookBar);
        this.cookBar.setCurrVal(0);
        this.isCookBarRendered = true;
      }

      const now = Date.now();
      if (!this.lastCookCheckTime) {
        this.lastCookCheckTime = now;
      }

      const elapsedMs = now - this.lastCookCheckTime;
      this.elapsedCookTime += elapsedMs;
      this.cookBar.setCurrVal(this.elapsedCookTime);
      this.lastCookCheckTime = now;
      if (this.elapsedCookTime > PlayerData.cookingTimeThreshold) {
        this.events.emit("cooked");
      }
    } else {
      this.lastCookCheckTime = 0;
    }
  }
}
