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
import {
  Resources,
  colorLabel,
  colorPrimaryBuzz,
  colorPrimaryCash,
} from "@/resources";

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
      pos: vec(-40, -65),
      text: this.getCountText(),
      font: new Font({
        family: "Kaph",
        size: 18,
        textAlign: TextAlign.Center,
        color: colorLabel,
      }),
    });

    this.addChild(count);

    if (
      this.max > PlayerData.getCountOfGuestType(this.GuestType) &&
      !this.isDisabled
    ) {
      const button = new InviteGuestButton(this.buzzCost, vec(0, 60));
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
}
