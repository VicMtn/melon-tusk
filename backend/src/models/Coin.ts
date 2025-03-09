import CoinData, { ICoinData } from './CoinData.js';

export class Coin {
  constructor(
    public code: string,
    public rate: number,
    public volume: number,
    public cap: number,
    public delta: {
      hour: number;
      day: number;
      week: number;
      month: number;
      quarter: number;
      year: number;
    }
  ) {}

  static async getInstancesInLastNHours(code: string, hours: number): Promise<ICoinData[]> {
    const now = new Date();
    const past = new Date(now.getTime() - hours * 60 * 60 * 1000);

    return CoinData.find({
      code,
      timestamp: { $gte: past, $lte: now },
    }).exec();
  }

  static async getLatestInstance(code: string): Promise<ICoinData | null> {
    return CoinData.findOne({ code }).sort({ timestamp: -1 }).exec();
  }

  async save(): Promise<ICoinData> {
    const coinData = new CoinData({
      code: this.code,
      rate: this.rate,
      volume: this.volume,
      cap: this.cap,
      delta: this.delta,
    });

    return coinData.save();
  }
}