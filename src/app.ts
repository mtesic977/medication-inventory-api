import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';

import { errorHandler } from './middlewares/error.middleware.js';
import { openApiDoc } from './config/openapi.js';
import { limiter } from './config/limiter.js';

import medicationRoutes from './routes/medication.routes.js';
import transactionRoutes from './routes/transaction.routes.js';
import auditRoutes from './routes/audit.routes.js';

// Create Express app instance
export const app = express();

// ----------------------
// Middleware
// ----------------------

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use('/api', limiter);

// ----------------------
// API Documentation
// ----------------------

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(openApiDoc));

// ----------------------
// API Routes
// ----------------------

app.use('/api/medications', medicationRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/audit-log', auditRoutes);

// ----------------------
// Error handling
// ----------------------

app.use(errorHandler);
