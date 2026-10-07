import app from './app';
import { config } from './config/environment';
import { connectDatabase } from './config/database';

async function bootstrap() {
  // Connect to DB asynchronously (with graceful fallback)
  await connectDatabase();

  const server = app.listen(config.port, () => {
    console.log(`====================================================`);
    console.log(`🚀 DroneTV Backend API running on port ${config.port}`);
    console.log(`📡 Health Check: http://localhost:${config.port}/api/health`);
    console.log(`📋 Enquiries API: http://localhost:${config.port}/api/enquiries`);
    console.log(`🤖 Chatbot API: http://localhost:${config.port}/api/chat/questions`);
    console.log(`🌍 Environment: ${config.nodeEnv}`);
    console.log(`====================================================`);
  });

  const gracefulShutdown = () => {
    console.log('\n[Server] Gracefully shutting down server...');
    server.close(() => {
      console.log('[Server] Closed remaining connections. Exiting process.');
      process.exit(0);
    });
  };

  process.on('SIGTERM', gracefulShutdown);
  process.on('SIGINT', gracefulShutdown);
}

bootstrap().catch((err) => {
  console.error('[Fatal] Error starting backend server:', err);
  process.exit(1);
});
