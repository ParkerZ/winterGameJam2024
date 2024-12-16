import {
  Engine,
  Font,
  Label,
  ScreenElement,
  Sprite,
  TextAlign,
  Vector,
  vec,
} from "excalibur";
import { Guest } from "./guest";
import { InviteGuestButton } from "@/ui/inviteGuestButton";
import { PlayerData } from "@/playerData";
import { DifficultyOptions } from "./guestOrder";
import { Resources, colorPrimaryBuzz, colorPrimaryCash } from "@/resources";

export class GuestInviteCard extends ScreenElement {
  protected GuestType: typeof Guest;
  protected guest: Guest;
  protected buzzCost: number;
  protected max: number;
  protected isDisabled: boolean;

  constructor({
    pos,
    GuestType,
    buzzCost,
    max = 4,
    isDisabled = false,
  }: {
    pos: Vector;
    GuestType: typeof Guest;
    buzzCost: number;
    max?: number;
    isDisabled?: boolean;
  }) {
    super({ pos, anchor: Vector.Half });

    this.guest = new GuestType({});
    this.GuestType = GuestType;
    this.buzzCost = buzzCost;
    this.max = max;
    this.isDisabled = isDisabled;
  }

  onInitialize(engine: Engine<any>): void {
    this.addChild(this.guest);

    const count = new Label({
      pos: vec(20, -65),
      text: this.getCountText(),
      font: new Font({ size: 24 }),
    });

    // TODO: this count should move and it should only be on the invite card
    this.addChild(count);

    // TODO: the remaining icons should all be on the guest
    this.addIcons(-45);

    if (
      this.max > PlayerData.getCountOfGuestType(this.GuestType) &&
      !this.isDisabled
    ) {
      const button = new InviteGuestButton(this.buzzCost, vec(0, 50));
      this.addChild(button);

      button.on("pointerup", (evt) => {
        if (this.buzzCost <= PlayerData.buzz) {
          PlayerData.buzz -= this.buzzCost;
          PlayerData.deck.push(new this.GuestType({}));

          count.text = this.getCountText();

          if (this.max <= PlayerData.getCountOfGuestType(this.GuestType)) {
            this.removeChild(button);
            button.kill();
          }
        }
      });
    }
  }

  private getCountText(): string {
    return `${
      this.isDisabled
        ? this.max
        : PlayerData.getCountOfGuestType(this.GuestType)
    }/${this.max}`;
  }

  private addIcons(startingYPos: number) {
    const reward = this.guest.getReward();
    let yPos = startingYPos;

    if (this.guest.getDifficulty()) {
      let text = "";
      switch (this.guest.getDifficulty()) {
        case DifficultyOptions.None:
          text = "None";
          break;
        case DifficultyOptions.Easy:
          text = "Easy";
          break;
        case DifficultyOptions.Medium:
          text = "Med";
          break;
        case DifficultyOptions.Hard:
          text = "Hard";
          break;
      }
      this.addChild(
        new Label({
          pos: vec(-20, -65),
          text,
          font: new Font({ size: 18, textAlign: TextAlign.Right }),
        })
      );
    }

    if (reward.star) {
      const star = new ScreenElement({ pos: vec(30, yPos) });
      const sprite = Resources.Star.toSprite();
      sprite.scale = Vector.Half;
      star.graphics.use(sprite);
      this.addChild(star);

      yPos += 20;
    }

    if (reward.buzz) {
      this.addChild(
        new Label({
          pos: vec(50, yPos),
          text: `${reward.buzz}`,
          font: new Font({
            family: "Kaph",
            size: 18,
            color: colorPrimaryBuzz,
            textAlign: TextAlign.Right,
          }),
        })
      );

      yPos += 20;
    }

    if (reward.cash) {
      this.addChild(
        new Label({
          pos: vec(50, yPos),
          text: `${reward.cash}`,
          font: new Font({
            family: "Kaph",
            size: 18,
            color: colorPrimaryCash,
            textAlign: TextAlign.Right,
          }),
        })
      );

      yPos += 20;
    }

    // if (this.guest.getIcon()) {
    //   const label = this.guest.getIcon();
    //   label.pos = vec(20, yPos);
    //   this.addChild(label);
    // }
  }
}
