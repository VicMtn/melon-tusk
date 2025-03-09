import mongoose, { Schema, Document } from 'mongoose';

export interface IAsset extends Document {
  userId: mongoose.Types.ObjectId;
  coinId: string;
  amount: number;
}

const assetSchema: Schema = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  coinId: { type: String, required: true },
  amount: { type: Number, required: true, default: 0 },
});

export default mongoose.model<IAsset>('Asset', assetSchema);