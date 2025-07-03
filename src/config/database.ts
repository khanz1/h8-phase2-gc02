import { Sequelize } from "sequelize";
import { Logger } from "./logger";
import { initializeModels, associateModels } from "@/database/models";

export class DatabaseConnection {
  private static instance: DatabaseConnection;
  private sequelize: Sequelize | null = null;
  private readonly logger = Logger.getInstance();

  private constructor() {}

  public static getInstance(): DatabaseConnection {
    if (!DatabaseConnection.instance) {
      DatabaseConnection.instance = new DatabaseConnection();
    }
    return DatabaseConnection.instance;
  }

  public async connect(): Promise<void> {
    try {
      const dbConfig = {
        host: process.env.DB_HOST || "localhost",
        port: parseInt(process.env.DB_PORT || "5432"),
        database: process.env.DB_NAME || "phase2_challenge",
        username: process.env.DB_USERNAME || "postgres",
        password: process.env.DB_PASSWORD || "password",
      };

      this.sequelize = new Sequelize({
        ...dbConfig,
        dialect: "postgres",
        logging: (msg: string): void => {
          if (process.env.NODE_ENV === "development") {
            this.logger.debug(msg);
          }
        },
        pool: {
          max: 10,
          min: 0,
          acquire: 30000,
          idle: 10000,
        },
        define: {
          timestamps: true,
          underscored: true,
          freezeTableName: true,
        },
      });

      await this.sequelize.authenticate();
      this.logger.info(
        `✅ Database connected successfully to ${dbConfig.database}`
      );

      initializeModels(this.sequelize);
      associateModels();
      this.logger.info("✅ Database models initialized and associated");

      if (process.env.NODE_ENV === "development") {
        await this.sequelize.sync({ alter: true });
        this.logger.info("✅ Database models force synced");
      } else {
        await this.sequelize.sync({ alter: true });
        this.logger.info("✅ Database models synced");
      }
    } catch (error) {
      this.logger.error("❌ Database connection failed:", error);
      throw error;
    }
  }

  public async disconnect(): Promise<void> {
    try {
      if (this.sequelize) {
        this.logger.info("🔌 Closing database connections...");

        await Promise.race([
          this.sequelize.close(),
          new Promise((_, reject) =>
            setTimeout(
              () => reject(new Error("Database disconnect timeout")),
              5000
            )
          ),
        ]);

        this.sequelize = null;
        this.logger.info("✅ Database disconnected successfully");
      }
    } catch (error) {
      this.logger.error("❌ Database disconnection failed:", error);

      if (this.sequelize) {
        try {
          await this.sequelize.connectionManager.close();
          this.sequelize = null;
          this.logger.info("✅ Database connections force closed");
        } catch (forceError) {
          this.logger.error("❌ Failed to force close database:", forceError);
        }
      }
      throw error;
    }
  }

  public getSequelize(): Sequelize {
    if (!this.sequelize) {
      throw new Error("Database not connected. Call connect() first.");
    }
    return this.sequelize;
  }

  public async testConnection(): Promise<boolean> {
    try {
      if (!this.sequelize) {
        return false;
      }
      await this.sequelize.authenticate();
      return true;
    } catch (error) {
      this.logger.error("❌ Database connection test failed:", error);
      return false;
    }
  }
}
