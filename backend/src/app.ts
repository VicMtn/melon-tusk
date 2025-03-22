import express from 'express';
import cors from 'cors';
import mongoClient from './config/mongoDB';
import router from './routes';
import envConfig from './config/envConfig';
import swaggerUi from 'swagger-ui-express';
import { specs } from './config/swagger';

// Configuration
const app = express();

// Middleware
app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Documentation API - Important: place these routes before the API routes
app.use('/api/docs', swaggerUi.serve);
app.get('/api/docs', swaggerUi.setup(specs, {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
    swaggerOptions: {
        docExpansion: 'list',
        filter: true,
        showRequestDuration: true,
    }
}));

// Routes API
app.use('/api', router);

// Database connection
mongoClient();

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something broke!', message: err.message });
});


// Add listen port
app.listen(envConfig.port, () => {
    console.log(`Server is running on port ${envConfig.port}`);
    console.log(`API Documentation available at http://localhost:${envConfig.port}/api/docs`);
});

export default app;