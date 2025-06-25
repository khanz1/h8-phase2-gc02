import "dotenv/config";
import { App } from "./app";
import { Logger } from "@/config/logger";
import { Server as HttpServer } from "http";

class Server {
  private readonly app: App;
  private readonly logger = Logger.getInstance();
  private readonly port = process.env.PORT || 3000;
  private httpServer: HttpServer | null = null;
  private isShuttingDown = false;

  constructor() {
    this.app = new App();
  }

  public async start(): Promise<void> {
    try {
      await this.app.initialize();

      this.httpServer = this.app.getExpressApp().listen(this.port, () => {
        this.logger.info(`🚀 Server is running on port ${this.port}`);
        this.logger.info(
          `📝 Environment: ${process.env.NODE_ENV || "development"}`
        );
        this.logger.info(
          `🗄️  Database: ${process.env.DB_NAME || "phase2_challenge"}`
        );
      });

      // Handle server errors
      this.httpServer.on("error", (error: Error) => {
        this.logger.error("❌ Server error:", error);
        process.exit(1);
      });
    } catch (error) {
      this.logger.error("❌ Failed to start server:", error);
      process.exit(1);
    }
  }

  public async stop(): Promise<void> {
    if (this.isShuttingDown) {
      return;
    }

    this.isShuttingDown = true;
    this.logger.info("🛑 Starting graceful shutdown...");

    try {
      // Close HTTP server first
      if (this.httpServer) {
        await new Promise<void>((resolve, reject) => {
          const timeout = setTimeout(() => {
            reject(new Error("Server shutdown timeout"));
          }, 10000); // 10 second timeout

          this.httpServer!.close((error) => {
            clearTimeout(timeout);
            if (error) {
              reject(error);
            } else {
              resolve();
            }
          });
        });
        this.logger.info("✅ HTTP server closed");
      }

      // Then close database connections
      await this.app.shutdown();
      this.logger.info("🛑 Server stopped gracefully");
    } catch (error) {
      this.logger.error("❌ Error during server shutdown:", error);
      process.exit(1);
    }
  }
}

const server = new Server();

// Graceful shutdown handlers
process.on("SIGTERM", async () => {
  Logger.getInstance().info("📨 SIGTERM received");
  await server.stop();
  process.exit(0);
});

process.on("SIGINT", async () => {
  Logger.getInstance().info("📨 SIGINT received");
  await server.stop();
  process.exit(0);
});

process.on("unhandledRejection", (reason: unknown) => {
  Logger.getInstance().error("🚨 Unhandled Promise Rejection:", reason);
  process.exit(1);
});

process.on("uncaughtException", (error: Error) => {
  Logger.getInstance().error("🚨 Uncaught Exception:", error);
  process.exit(1);
});

// Handle additional signals for Docker and other environments
process.on("SIGHUP", async () => {
  Logger.getInstance().info("📨 SIGHUP received");
  await server.stop();
  process.exit(0);
});

// Start the server
void server.start();
