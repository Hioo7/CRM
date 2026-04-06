import cors, { CorsOptions } from 'cors';
import express, { Application, Request, Response, NextFunction } from 'express';
import { AppConfig } from './config/AppConfig';
import apiRouter from './routes/index';
import { AppError } from './lib/AppError';

export function createApp(): Application {
  const app = express();
  const config = AppConfig.getInstance();
  const corsOptions: CorsOptions = {
    origin(origin, callback) {
      if (!origin || config.corsAllowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new AppError(403, 'CORS origin not allowed'));
    },
  };

  app.use(cors(corsOptions));
  app.use(express.json());

  app.use('/api', apiRouter);

  app.use((_req: Request, res: Response) => {
    res.status(404).json({ message: 'Not found' });
  });

  app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
    if (err instanceof AppError) {
      res.status(err.statusCode).json({ message: err.message });
      return;
    }
    res.status(500).json({ message: 'Internal server error' });
  });

  return app;
}
