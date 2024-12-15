import {
  Color,
  Engine,
  Font,
  GraphicsGroup,
  Rectangle,
  ScreenElement,
  Text,
  Vector,
  vec,
} from "excalibur";

export class Tooltip extends ScreenElement {
  private text: string;

  constructor({ text }: { text: string }) {
    super({
      pos: vec(950, 525),
    });

    this.text = text;
  }

  onInitialize(engine: Engine<any>): void {
    const textDisplay = new Text({
      text: this.text,
      font: new Font({ size: 16 }),
      color: Color.Black,
    });

    const box = new Rectangle({
      width: 120,
      height: 60,
      color: Color.White,
    });

    this.graphics.use(new GraphicsGroup({ members: [box, textDisplay] }), {
      anchor: Vector.Half,
    });
  }
}
