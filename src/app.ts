import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import routes from './routes';
import { errorHandler } from './common/middleware/error.middleware';
import { setupSwagger } from './config/swagger.config';
import { mongoSanitizeMiddleware } from './common/middleware/mongoSanitize.middleware';
import { xssMiddleware } from './common/middleware/xss.middleware';
import { env } from './config/env.config';

const app = express();

/**
 * ✅ CORS CONFIGURATION (MUST BE FIRST)
 * Allows frontend to send:
 * - Authorization headers
 * - Cookies (refresh token)
 */
app.use(
  cors({
    origin: env.CLIENT_URL, // e.g. http://localhost:5173
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);



/**
 * 🔐 SECURITY MIDDLEWARE
 */
app.use(helmet());
app.use(express.json());
app.use(cookieParser()); 
app.use(morgan('dev'));
app.use(xssMiddleware);
app.use(mongoSanitizeMiddleware);

/**
 * 🚦 RATE LIMITER (Auth routes only)
 * Applied AFTER CORS so OPTIONS is not blocked
 */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/auth', authLimiter);

/**
 * 🛣️ ROUTES
 */
app.use('/api', routes);

/**
 * 📘 Swagger Docs
 */
setupSwagger(app);

/**
 * ❌ Global Error Handler (LAST)
 */
app.use(errorHandler);

export default app;