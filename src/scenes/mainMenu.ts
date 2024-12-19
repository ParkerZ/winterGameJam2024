import { Resources, colorLabel, musicVolume } from "@/resources";
import { PlayButton } from "@/ui/playButton";
import { TutorialButton } from "@/ui/tutorialButton";
import {
  Engine,
  Font,
  Label,
  Scene,
  SceneActivationContext,
  ScreenElement,
  TextAlign,
  Vector,
  vec,
} from "excalibur";
import { shuffleArray } from "../../util";
import { DifficultyOptions, GuestOrder } from "@/guests/guestOrder";
import { GuestEventEmitter } from "@/events";
import { Burger } from "@/foodStuffs/burger";
import { HAS_COMPLETED_TUTORIAL_KEY } from "./tutorial";

export class MainMenu extends Scene {
  private bgParallaxElements: Array<ScreenElement> = [];

  override onInitialize(engine: Engine): void {}

  override onActivate(context: SceneActivationContext<unknown>): void {
    const menuBG = new ScreenElement();
    const bgSprite = Resources.MainMenu.toSprite();
    menuBG.graphics.use(bgSprite);
    this.add(menuBG);

    this.bgParallaxElements = [
      new ScreenElement({ z: -2, pos: vec(180 * -1, 1) }),
      new ScreenElement({ z: -2, pos: vec(180 * 0, 0) }),
      new ScreenElement({ z: -2, pos: vec(180 * 1, 0) }),
      new ScreenElement({ z: -2, pos: vec(180 * 2, 0) }),
      new ScreenElement({ z: -2, pos: vec(180 * 3, 0) }),
      new ScreenElement({ z: -2, pos: vec(180 * 4, 0) }),
      new ScreenElement({ z: -2, pos: vec(180 * 5, 0) }),
    ];

    this.bgParallaxElements.forEach((e) => {
      e.graphics.use(Resources.Parallax2.toSprite());
      this.add(e);
    });

    const guestImages = [
      Resources.Guest1,
      Resources.Guest2,
      Resources.Guest3,
      Resources.Guest4,
      Resources.Guest5,
      Resources.Guest6,
      Resources.Guest7,
      Resources.Guest8,
      Resources.Guest9,
      Resources.Guest10,
      Resources.Guest11,
      Resources.Guest12,
      Resources.Guest13,
    ];

    const guestImage1 = shuffleArray(guestImages)[0].toSprite({
      scale: vec(0.6, 0.6),
    });
    const guestImage2 = shuffleArray(guestImages)[0].toSprite({
      scale: vec(0.6, 0.6),
    });
    const guest1 = new ScreenElement({ pos: vec(500, 350) });
    const guest2 = new ScreenElement({ pos: vec(750, 350) });

    guest1.graphics.use(guestImage1);
    guest2.graphics.use(guestImage2);

    const hat1 = new ScreenElement({ pos: vec(548, 270) });
    const hat2 = new ScreenElement({ pos: vec(795, 270) });

    hat1.graphics.use(Resources.Hat.toSprite({ scale: vec(0.7, 0.7) }));
    hat2.graphics.use(Resources.Hat.toSprite({ scale: vec(0.7, 0.7) }));

    const dave = new ScreenElement({ pos: vec(870, 250) });
    dave.graphics.use(Resources.Dave.toSprite({ scale: Vector.Half }));

    const difficulties = [
      DifficultyOptions.Easy,
      DifficultyOptions.Medium,
      DifficultyOptions.Hard,
    ];
    const difficulty = shuffleArray(difficulties)[0];
    const ingredients = new Set(["Patty"]);
    if (Math.random() * 2 >= 1) {
      ingredients.add("Cheese");
    }

    if (difficulty === DifficultyOptions.Medium) {
      if (Math.random() * 2 >= 1) {
        ingredients.add("TomatoSlice");
      } else {
        ingredients.add("LettuceSlice");
      }
    }

    if (difficulty === DifficultyOptions.Hard) {
      ingredients.add("LettuceSlice");
      ingredients.add("TomatoSlice");
    }
    const burger = new Burger(ingredients);
    burger.pos = vec(732, 500);

    const hasCompletedTutorial = localStorage.getItem(
      HAS_COMPLETED_TUTORIAL_KEY
    );
    const button = new PlayButton(!!hasCompletedTutorial);
    const tutorialButton = new TutorialButton();

    const text = new Label({
      pos: vec(530, 190),
      text: "The Grand Opening of your Burger Shack is in 2 weeks!\nHow many Gold Star reviews can you get before then?",
      font: new Font({
        family: "Kaph",
        size: 24,
        textAlign: TextAlign.Center,
        color: colorLabel,
        lineHeight: 30,
      }),
    });

    this.add(button);
    this.add(text);
    this.add(guest1);
    this.add(burger);
    this.add(guest2);
    this.add(hat1);
    this.add(hat2);
    this.add(dave);
    if (hasCompletedTutorial) {
      this.add(tutorialButton);
    }
  }

  override onDeactivate(context: SceneActivationContext): void {
    // Called when Excalibur transitions away from this scene
    // Only 1 scene is active at a time
    this.clear();
  }

  override onPreUpdate(engine: Engine, elapsedMs: number): void {
    this.scrollParallax();
  }

  private scrollParallax() {
    this.bgParallaxElements.forEach((e) => {
      e.pos = e.pos.add(vec(0.5, -0.25));
      if (e.pos.x >= 180 * 5 + 180) {
        e.pos = vec(180 * -1, 0);
      }
    });
  }
}
