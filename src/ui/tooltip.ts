import { Difficulty, DifficultyOptions } from "@/guests/guestOrder";
import {
  Resources,
  colorLabel,
  colorPrimaryBuzz,
  colorPrimaryCash,
} from "@/resources";
import {
  Color,
  Engine,
  Font,
  Graphic,
  GraphicsGroup,
  Rectangle,
  ScreenElement,
  Text,
  TextAlign,
  Vector,
  vec,
} from "excalibur";

export class Tooltip extends ScreenElement {
  private text: string;
  private label: string;
  private difficultyText: string;
  private topText: string | undefined;
  private buzzText: string | undefined;
  private cashText: string | undefined;

  constructor({
    label,
    topText,
    buzzText,
    cashText,
    difficulty,
  }: {
    label: string;
    topText?: string;
    buzzText?: string;
    cashText?: string;
    difficulty?: Difficulty;
  }) {
    super({
      pos: vec(958, 415),
    });

    this.label = label;
    this.difficultyText = Object.keys(DifficultyOptions).find(
      (option) => DifficultyOptions[option] === difficulty
    );
    this.topText = topText;
    this.buzzText = buzzText;
    this.cashText = cashText;
  }

  onInitialize(engine: Engine<any>): void {
    const labelDisplay = {
      graphic: new Text({
        text: this.label,
        font: new Font({
          family: "Kaph",
          size: 18,
          color: colorLabel,
          textAlign: TextAlign.Center,
        }),
      }),
      offset: vec(3, -25),
    };

    const box = {
      graphic: Resources.Tooltip.toSprite(),
      offset: vec(-81, 0),
    };

    const members = [labelDisplay, box];

    const spacer = 5;
    let runningHeight = 15;
    if (this.topText) {
      const top = {
        graphic: new Text({
          text: this.topText,
          font: new Font({
            family: "Kaph",
            size: 14,
            color: colorLabel,
            textAlign: TextAlign.Left,
            lineHeight: 16,
          }),
        }),
        offset: vec(-70, runningHeight),
      };
      members.push(top);
      // Adjust height using added line height
      runningHeight += (top.graphic.height * 16) / 14 + spacer;
    }

    if (this.buzzText) {
      const buzz = {
        graphic: new Text({
          text: this.buzzText,
          font: new Font({
            family: "Kaph",
            size: 14,
            color: colorPrimaryBuzz,
            textAlign: TextAlign.Left,
          }),
        }),
        offset: vec(-70, runningHeight),
      };
      members.push(buzz);
      runningHeight += buzz.graphic.height + spacer;
    }

    if (this.cashText) {
      const buzz = {
        graphic: new Text({
          text: this.cashText,
          font: new Font({
            family: "Kaph",
            size: 14,
            color: colorPrimaryCash,
            textAlign: TextAlign.Left,
          }),
        }),
        offset: vec(-70, runningHeight),
      };
      members.push(buzz);
      runningHeight += buzz.graphic.height + spacer;
    }

    if (this.difficultyText) {
      const difficulty = {
        graphic: new Text({
          text: `Order: ${this.difficultyText}`,
          font: new Font({
            family: "Kaph",
            size: 14,
            color: colorLabel,
            textAlign: TextAlign.Left,
          }),
        }),
        offset: vec(-70, 140),
      };
      members.push(difficulty);
    }

    this.graphics.use(new GraphicsGroup({ members: members }));
  }
}
