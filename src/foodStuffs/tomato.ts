import { Resources, colorPrimaryCash, colorSecondaryCash } from "@/resources";
import { Food } from "./food";
import { Engine, vec } from "excalibur";
import { PlayerData } from "@/playerData";
import { StatusBar } from "@/ui/statusBar";

export class Tomato extends Food {
  private elapsedChopTime: number;
  private lastChopCheckTime: number;
  private chopBar: StatusBar;
  private isChopBarRendered: boolean = false;

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
    this.chopBar = new StatusBar({
      x: 0,
      y: -20,
      z: 2,
      maxVal: PlayerData.choppingTimeThreshold,
      size: "md",
      color: colorPrimaryCash,
      complementaryColor: colorSecondaryCash,
    });
  }

  onPostUpdate(engine: Engine<any>, elapsedMs: number): void {
    if (this.state === "chopping") {
      if (!this.isChopBarRendered) {
        this.addChild(this.chopBar);
        this.chopBar.setCurrVal(0);
        this.isChopBarRendered = true;
      }

      const now = Date.now();
      if (!this.lastChopCheckTime) {
        this.lastChopCheckTime = now;
      }

      const elapsedMs = now - this.lastChopCheckTime;
      this.elapsedChopTime += elapsedMs;
      this.chopBar.setCurrVal(this.elapsedChopTime);
      this.lastChopCheckTime = now;
      if (this.elapsedChopTime > PlayerData.choppingTimeThreshold) {
        this.events.emit("chopped");
      }
    } else {
      this.lastChopCheckTime = 0;
    }
  }
}
