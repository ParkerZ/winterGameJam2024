import { Engine, ScreenElement, Sprite, Vector, vec } from "excalibur";
import { Guest } from "./guest";
import { InviteGuestButton } from "@/ui/inviteGuestButton";
import { PlayerData } from "@/playerData";

// TODO: realistically, it needs a name, an image + icons, a price, and a description
// The name / image + icons need to line up with the actual item
// I think a Guest will have a core of an image + icons, plus a tooltip description
export class GuestInviteCard extends ScreenElement {
  protected GuestType: typeof Guest;
  protected guest: Guest;
  protected buzzCost: number;

  constructor({
    pos,
    GuestType,
    buzzCost,
  }: {
    pos: Vector;
    GuestType: typeof Guest;
    buzzCost: number;
  }) {
    super({ pos, anchor: Vector.Half });

    this.guest = new GuestType({});
    this.GuestType = GuestType;
    this.buzzCost = buzzCost;
  }

  onInitialize(engine: Engine<any>): void {
    this.addChild(this.guest);

    const button = new InviteGuestButton(this.buzzCost, vec(0, 50));
    this.addChild(button);

    button.on("pointerup", (evt) => {
      if (this.buzzCost <= PlayerData.buzz) {
        PlayerData.buzz -= this.buzzCost;
        PlayerData.deck.push(new this.GuestType({}));
      }
    });
  }
}
