import {
  Resources,
  colorPrimaryBuzz,
  colorPrimaryCash,
  musicVolume,
} from "@/resources";
import {
  Engine,
  Font,
  Label,
  Scene,
  SceneActivationContext,
  ScreenElement,
  TextAlign,
  vec,
} from "excalibur";
import { PlayerData } from "@/playerData";

export class GameOver extends Scene {
  override onInitialize(engine: Engine): void {
    Resources.musicShop.loop = true;
  }

  override onActivate(context: SceneActivationContext<unknown>): void {
    Resources.musicShop.play(musicVolume);

    const menuBG = new ScreenElement({ z: -2 });
    menuBG.graphics.use(Resources.GameOver.toSprite());

    const buzzCount = new Label({
      pos: vec(472, 389),
      text: `${PlayerData.buzzEarned}`,
      font: new Font({
        family: "Kaph",
        size: 56,
        color: colorPrimaryBuzz,
        textAlign: TextAlign.Right,
      }),
    });

    const cashCount = new Label({
      pos: vec(850, 389),
      text: `${PlayerData.cashEarned}`,
      font: new Font({
        family: "Kaph",
        size: 56,
        color: colorPrimaryCash,
        textAlign: TextAlign.Right,
      }),
    });

    this.add(menuBG);
    this.add(buzzCount);
    this.add(cashCount);

    const sprite = Resources.StarLarge.toSprite();
    if (PlayerData.star >= 1) {
      const star1 = new ScreenElement({ pos: vec(332, 195) });
      star1.graphics.use(sprite);
      this.add(star1);
    }

    if (PlayerData.star >= 2) {
      const star1 = new ScreenElement({ pos: vec(472, 195) });
      star1.graphics.use(sprite);
      this.add(star1);
    }

    if (PlayerData.star >= 3) {
      const star = new ScreenElement({ pos: vec(612, 195) });
      star.graphics.use(sprite);
      this.add(star);
    }
  }

  override onDeactivate(context: SceneActivationContext): void {
    // Called when Excalibur transitions away from this scene
    // Only 1 scene is active at a time
    this.clear();
  }

  override onPreUpdate(engine: Engine, elapsedMs: number): void {}
}
