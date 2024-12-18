import {
  Resources,
  chopVolume,
  colorPrimaryCash,
  colorSecondaryCash,
  getRandomChopSound,
} from "@/resources";
import { Food } from "./food";
import { Engine, vec } from "excalibur";
import { PlayerData } from "@/playerData";
import { StatusBar } from "@/ui/statusBar";

export class Lettuce extends Food {
  private elapsedChopTime: number;
  private lastChopCheckTime: number;
  private chopBar: StatusBar;
  private isChopBarRendered: boolean = false;
  private refireChopSoundCounter: number = 0;

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

      this.elapsedChopTime += elapsedMs;
      this.chopBar.setCurrVal(this.elapsedChopTime);
      this.lastChopCheckTime = now;
      if (this.elapsedChopTime > PlayerData.choppingTimeThreshold) {
        this.events.emit("chopped");
      }

      if (this.refireChopSoundCounter) {
        this.refireChopSoundCounter += elapsedMs;
        if (this.refireChopSoundCounter >= 325) {
          getRandomChopSound().play(chopVolume);
          this.refireChopSoundCounter = 0;
        }
      }

      if (
        !Resources.soundChop1.isPlaying() &&
        !Resources.soundChop2.isPlaying() &&
        !Resources.soundChop3.isPlaying() &&
        !this.refireChopSoundCounter
      ) {
        this.refireChopSoundCounter = 1;
      }
    } else {
      this.refireChopSoundCounter = 0;
      this.lastChopCheckTime = 0;
    }
  }
}
