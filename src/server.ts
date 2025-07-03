import "dotenv/config";
import { App } from "./app";
import { Logger } from "@/config/logger";
import { Server as HttpServer } from "http";

class Server {
  private readonly app: App;
  private readonly logger = new Logger(Server.name);
  private readonly port = process.env.PORT || 3000;
  private httpServer: HttpServer | null = null;
  private isShuttingDown = false;

  constructor() {
    this.app = new App();
  }

  public async start(): Promise<void> {
    try {
      await this.app.initialize();

      this.app.mapRoutes();

      this.httpServer = this.app.getExpressApp().listen(this.port, () => {
        this.logger.info(`🚀 Server is running on port ${this.port}`);
        this.logger.info(
          `📝 Environment: ${process.env.NODE_ENV || "development"}`
        );
        this.logger.info(
          `🗄️  Database: ${process.env.DB_NAME || "phase2_challenge"}`
        );
        const memoryUsage = process.memoryUsage();
        const formatBytes = (bytes: number): string => {
          const kb = (bytes / 1024).toFixed(2);
          const mb = (bytes / 1024 / 1024).toFixed(2);
          return `${bytes} bytes (${kb} KB / ${mb} MB)`;
        };

        this.logger.info("💾 Memory Usage Information:");
        this.logger.info(
          `  RSS (Resident Set Size): ${formatBytes(
            memoryUsage.rss
          )} - Total memory allocated`
        );
        this.logger.info(
          `  Heap Used: ${formatBytes(
            memoryUsage.heapUsed
          )} - V8 heap memory currently used`
        );
        this.logger.info(
          `  Heap Total: ${formatBytes(
            memoryUsage.heapTotal
          )} - V8 heap memory allocated`
        );
        this.logger.info(
          `  External: ${formatBytes(
            memoryUsage.external
          )} - Memory used by C++ objects bound to JS`
        );
        this.logger.info(
          `  Array Buffers: ${formatBytes(
            memoryUsage.arrayBuffers
          )} - Memory allocated for ArrayBuffers`
        );
      });

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
      if (this.httpServer) {
        await new Promise<void>((resolve, reject) => {
          const timeout = setTimeout(() => {
            reject(new Error("Server shutdown timeout"));
          }, 10000);

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

      await this.app.shutdown();
      this.logger.info("🛑 Server stopped gracefully");
    } catch (error) {
      this.logger.error("❌ Error during server shutdown:", error);
      process.exit(1);
    }
  }
}

const server = new Server();

const processLogger = new Logger("Process");

process.on("SIGTERM", async () => {
  processLogger.info("❌ SIGTERM received");
  await server.stop();
  process.exit(0);
});

process.on("SIGINT", async () => {
  processLogger.info("❌ SIGINT received");
  await server.stop();
  process.exit(0);
});

process.on("unhandledRejection", (reason: unknown) => {
  processLogger.error("❌ Unhandled Promise Rejection:", reason);
  process.exit(1);
});

process.on("uncaughtException", (error: Error) => {
  processLogger.error("❌ Uncaught Exception:", error);
  process.exit(1);
});

process.on("SIGHUP", async () => {
  processLogger.info("❌ SIGHUP received");
  await server.stop();
  process.exit(0);
});

void server.start();
