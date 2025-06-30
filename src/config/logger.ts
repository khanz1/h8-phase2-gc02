import pino from "pino";
import { join } from "path";
import { mkdirSync, existsSync } from "fs";

export class Logger {
  private static instance: Logger;
  private readonly logger: pino.Logger;

  private constructor() {
    const logLevel = process.env.LOG_LEVEL || "info";
    const isProduction = process.env.NODE_ENV === "production";
    const enableFileLogging = process.env.LOG_FILE === "true";

    // Create logs directory if it doesn't exist
    const logsDir = join(process.cwd(), "logs");
    if (enableFileLogging && !existsSync(logsDir)) {
      mkdirSync(logsDir, { recursive: true });
    }

    if (isProduction && enableFileLogging) {
      // Production: Log to both files and console
      const today = new Date().toISOString().split("T")[0];
      const appLogFile = join(logsDir, `app-${today}.log`);
      const errorLogFile = join(logsDir, `error-${today}.log`);

      this.logger = pino({
        level: logLevel,
        timestamp: pino.stdTimeFunctions.isoTime,
        transport: {
          targets: [
            // Console output with pretty formatting
            {
              target: "pino-pretty",
              level: logLevel,
              options: {
                colorize: true,
                ignore: "pid,hostname",
                translateTime: "SYS:yyyy-mm-dd HH:MM:ss",
              },
            },
            // File output for all logs
            {
              target: "pino/file",
              level: logLevel,
              options: {
                destination: appLogFile,
              },
            },
            // Separate error file
            {
              target: "pino/file",
              level: "error",
              options: {
                destination: errorLogFile,
              },
            },
          ],
        },
      });
    } else {
      // Development: Pretty print to console with custom formatters
      this.logger = pino({
        level: logLevel,
        timestamp: pino.stdTimeFunctions.isoTime,
        formatters: {
          level: (label: string): Record<string, string> => {
            return { level: label };
          },
        },
        transport: {
          target: "pino-pretty",
          options: {
            colorize: true,
            ignore: "pid,hostname",
            translateTime: "SYS:yyyy-mm-dd HH:MM:ss",
          },
        },
      });
    }
  }

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  public info(message: string, ...args: unknown[]): void {
    this.logger.info(message, ...args);
  }

  public error(message: string, error?: unknown): void {
    this.logger.error({ error }, message);
  }

  public warn(message: string, ...args: unknown[]): void {
    this.logger.warn(message, ...args);
  }

  public debug(message: string, ...args: unknown[]): void {
    this.logger.debug(message, ...args);
  }

  public trace(message: string, ...args: unknown[]): void {
    this.logger.trace(message, ...args);
  }

  public fatal(message: string, error?: unknown): void {
    this.logger.fatal({ error }, message);
  }

  public getLogger(): pino.Logger {
    return this.logger;
  }
}
