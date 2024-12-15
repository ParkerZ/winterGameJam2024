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

// TODO: realistically, it needs a name, an image + icons, a price, and a description
// The name / image + icons need to line up with the actual item
// I think a Guest will have a core of an image + icons, plus a tooltip description
export class GuestInviteCard extends ScreenElement {
  protected GuestType: typeof Guest;
  protected guest: Guest;
  protected buzzCost: number;
  protected max: number;
  protected minStar: number;
  protected isDisabled: boolean;

  constructor({
    pos,
    GuestType,
    buzzCost,
    max = 4,
    minStar = 0,
    isDisabled = false,
  }: {
    pos: Vector;
    GuestType: typeof Guest;
    buzzCost: number;
    max?: number;
    minStar?: number;
    isDisabled?: boolean;
  }) {
    super({ pos, anchor: Vector.Half });

    this.guest = new GuestType({});
    this.GuestType = GuestType;
    this.buzzCost = buzzCost;
    this.max = max;
    this.minStar = minStar;
    this.isDisabled = isDisabled;
  }

  onInitialize(engine: Engine<any>): void {
    this.addChild(this.guest);

    const count = new Label({
      pos: vec(20, -65),
      text: this.getCountText(),
      font: new Font({ size: 24 }),
    });

    this.addChild(count);

    this.addIcons(-45);

    if (
      this.max > PlayerData.getCountOfGuestType(this.GuestType) &&
      this.minStar <= PlayerData.star &&
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
        case DifficultyOptions.NA:
          text = "N/A";
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
          pos: vec(60, yPos),
          text,
          font: new Font({ size: 18, textAlign: TextAlign.Right }),
        })
      );

      yPos += 20;
    }
    // TODO: temporarily disabling icons as this was a temp solution that didn't demo well
    // if (reward.buzz) {
    //   this.addChild(
    //     new Label({
    //       pos: vec(20, yPos),
    //       text: `B ${reward.buzz}`,
    //       font: new Font({ size: 24 }),
    //     })
    //   );

    //   yPos += 20;
    // }

    // if (reward.cash) {
    //   this.addChild(
    //     new Label({
    //       pos: vec(20, yPos),
    //       text: `$ ${reward.cash}`,
    //       font: new Font({ size: 24 }),
    //     })
    //   );

    //   yPos += 20;
    // }

    // if (reward.star) {
    //   this.addChild(
    //     new Label({
    //       pos: vec(20, yPos),
    //       text: `* ${reward.star}`,
    //       font: new Font({ size: 24 }),
    //     })
    //   );

    //   yPos += 20;
    // }

    // if (this.guest.getIcon()) {
    //   const label = this.guest.getIcon();
    //   label.pos = vec(20, yPos);
    //   this.addChild(label);
    // }
  }
}
