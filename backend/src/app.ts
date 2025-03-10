import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { startFetching } from './services/liveCoinWatchService';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';



const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI!)
  .then(() => console.log('Connected to MongoDB: melon-tusk'))
  .catch((err) => console.error('MongoDB connection error:', err));

  startFetching();

const swaggerDocument = YAML.load('src/openapi.yaml');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});