import { Document, Model, Types } from "mongoose";

export type TransactionType = 'buy' | 'sell' | 'deposit' | 'withdraw';

export interface ITransaction extends Document {
  userId: Types.ObjectId;
  walletId: Types.ObjectId;
  type: TransactionType;
  code?: string;
  amount: number;
  rate?: number;
  total: number;
  currency: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTransactionInput {
  userId: Types.ObjectId;
  walletId: Types.ObjectId;
  type: TransactionType;
  code?: string;
  amount: number;
  rate?: number;
  total: number;
  currency: string;
}

export interface TransactionModel extends Model<ITransaction> {
  findByUserId(userId: string): Promise<ITransaction[]>;
  findByUserIdAndType(userId: string, type: TransactionType): Promise<ITransaction[]>;
  findByWalletId(walletId: string): Promise<ITransaction[]>;
  createTransaction(data: CreateTransactionInput): Promise<ITransaction>;
}