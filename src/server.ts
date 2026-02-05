import app from './app';
import { logger } from './common/utils/logger';
import { connectDB } from './config/db.config';
import { env } from './config/env.config';

const startServer = async () => {
  await connectDB();
logger.info(`Server running on port ${env.PORT}`);
  app.listen(env.PORT, () => {
    console.log(`🚀 Server running on port ${env.PORT}`);
  });
};

startServer();
