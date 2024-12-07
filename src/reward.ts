import { PlayerData } from "./playerData";

export class Reward {
  public buzz: number;
  public cash: number;

  constructor({ buzz = 0, cash = 0 }: { buzz?: number; cash?: number }) {
    this.buzz = buzz;
    this.cash = cash;
  }

  public distribute() {
    PlayerData.buzz = Math.max(PlayerData.buzz + this.buzz, 0);
    PlayerData.cash = Math.max(PlayerData.cash + this.cash, 0);
  }
}
