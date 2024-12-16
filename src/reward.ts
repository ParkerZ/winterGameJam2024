import { PlayerData } from "./playerData";

export class Reward {
  public buzz: number;
  public cash: number;
  public star: number;

  constructor({
    buzz = 0,
    cash = 0,
    star = 0,
  }: {
    buzz?: number;
    cash?: number;
    star?: number;
  }) {
    this.buzz = buzz;
    this.cash = cash;
    this.star = star;
  }

  public distribute() {
    PlayerData.buzz = Math.max(PlayerData.buzz + this.buzz, 0);
    PlayerData.cash = Math.max(PlayerData.cash + this.cash, 0);

    if (this.star) {
      PlayerData.star += this.star;
    }

    if (PlayerData.star === 3) {
      alert("You win");
    }
  }
}
