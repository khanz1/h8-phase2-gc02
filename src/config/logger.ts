import pino from "pino";
import { join } from "path";
import { mkdirSync, existsSync } from "fs";

export class Logger {
  private static baseLogger: pino.Logger;
  private readonly logger: pino.Logger;

  constructor(context?: string) {
    if (!Logger.baseLogger) {
      Logger.baseLogger = Logger.createBaseLogger();
    }

    this.logger = context
      ? Logger.baseLogger.child({ context })
      : Logger.baseLogger;
  }

  private static createBaseLogger(): pino.Logger {
    const logLevel = process.env.LOG_LEVEL || "info";
    const isProduction = process.env.NODE_ENV === "production";
    const enableFileLogging = process.env.LOG_FILE === "true";

    const logsDir = join(process.cwd(), "logs");
    if (enableFileLogging && !existsSync(logsDir)) {
      mkdirSync(logsDir, { recursive: true });
    }

    if (isProduction) {
      if (enableFileLogging) {
        const today = new Date().toISOString().split("T")[0];
        const appLogFile = join(logsDir, `app-${today}.log`);
        const errorLogFile = join(logsDir, `error-${today}.log`);

        return pino({
          level: logLevel,
          timestamp: pino.stdTimeFunctions.isoTime,
          transport: {
            targets: [
              {
                target: "pino-pretty",
                level: logLevel,
                options: {
                  colorize: true,
                  ignore: "pid,hostname",
                  translateTime: "SYS:yyyy-mm-dd HH:MM:ss",
                  messageFormat: "{msg}",
                },
              },
              {
                target: "pino/file",
                level: logLevel,
                options: {
                  destination: appLogFile,
                },
              },
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
        return pino({
          level: logLevel,
          timestamp: pino.stdTimeFunctions.isoTime,
          transport: {
            target: "pino-pretty",
            options: {
              colorize: true,
              ignore: "pid,hostname",
              translateTime: "SYS:yyyy-mm-dd HH:MM:ss",
              messageFormat: "{msg}",
            },
          },
        });
      }
    } else {
      return pino({
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
    return new Logger();
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
