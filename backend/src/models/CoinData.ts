import mongoose, { Schema, Document } from 'mongoose';

export interface ICoinData extends Document {
  code: string;
  rate: number;
  volume: number;
  cap: number;
  delta: {
    hour: number;
    day: number;
    week: number;
    month: number;
    quarter: number;
    year: number;
  };
  timestamp: Date;
}

const coinDataSchema: Schema = new Schema({
  code: { type: String, required: true },
  rate: { type: Number, required: true },
  volume: { type: Number, required: true },
  cap: { type: Number, required: true },
  delta: {
    hour: { type: Number, required: true },
    day: { type: Number, required: true },
    week: { type: Number, required: true },
    month: { type: Number, required: true },
    quarter: { type: Number, required: true },
    year: { type: Number, required: true },
  },
  timestamp: { type: Date, default: Date.now },
});

export default mongoose.model<ICoinData>('Coin', coinDataSchema, 'Coins');