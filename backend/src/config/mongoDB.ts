import mongoose from 'mongoose';
import config from './envConfig';

const mongoURI: string = config.mongoUri;

const mongoClient = async (): Promise<void> => {
  try {
    await mongoose.connect(mongoURI)
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
  }
};

export default mongoClient;