import { Client } from "pg";
import * as fs from "fs";
import * as path from "path";
import { Logger } from "../src/config/logger";
import "dotenv/config";

// Create logger instance
const logger = Logger.getInstance();

interface DatabaseConfig {
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
}

class MigrationRunner {
  private client: Client;
  private readonly migrationFile: string;
  private readonly undoFile: string;

  constructor(config: DatabaseConfig) {
    this.client = new Client({
      host: config.host,
      port: config.port,
      database: config.database,
      user: config.username,
      password: config.password,
    });

    this.migrationFile = path.join(__dirname, "migrations.sql");
    this.undoFile = path.join(__dirname, "migrations-undo.sql");
  }

  /**
   * Connect to the PostgreSQL database
   */
  private async connect(): Promise<void> {
    try {
      await this.client.connect();
      logger.info("Successfully connected to PostgreSQL database");
    } catch (error) {
      logger.error("Failed to connect to database", { error });
      throw new Error(`Database connection failed: ${error}`);
    }
  }

  /**
   * Disconnect from the PostgreSQL database
   */
  private async disconnect(): Promise<void> {
    try {
      await this.client.end();
      logger.info("Database connection closed");
    } catch (error) {
      logger.error("Error closing database connection", { error });
    }
  }

  /**
   * Read SQL file content
   */
  private readSqlFile(filePath: string): string {
    try {
      if (!fs.existsSync(filePath)) {
        throw new Error(`SQL file not found: ${filePath}`);
      }

      const content = fs.readFileSync(filePath, "utf8");

      if (!content.trim()) {
        throw new Error(`SQL file is empty: ${filePath}`);
      }

      return content;
    } catch (error) {
      logger.error(`Failed to read SQL file: ${filePath}`, { error });
      throw error;
    }
  }

  /**
   * Execute SQL commands from a file
   */
  private async executeSqlFile(
    filePath: string,
    operation: string
  ): Promise<void> {
    const startTime = Date.now();

    try {
      logger.info(`Starting ${operation}...`);

      const sqlContent = this.readSqlFile(filePath);

      // Execute the SQL content
      await this.client.query(sqlContent);

      const duration = Date.now() - startTime;
      logger.info(`${operation} completed successfully`, {
        duration: `${duration}ms`,
        file: path.basename(filePath),
      });
    } catch (error) {
      const duration = Date.now() - startTime;
      logger.error(`${operation} failed`, {
        error: error instanceof Error ? error.message : error,
        duration: `${duration}ms`,
        file: path.basename(filePath),
      });
      throw error;
    }
  }

  /**
   * Run database migrations (create tables, indexes, etc.)
   */
  public async migrate(): Promise<void> {
    try {
      await this.connect();
      await this.executeSqlFile(this.migrationFile, "Database Migration");
    } catch (error) {
      logger.error("Migration failed", { error });
      throw error;
    } finally {
      await this.disconnect();
    }
  }

  /**
   * Rollback database migrations (drop tables, indexes, etc.)
   */
  public async rollback(): Promise<void> {
    try {
      await this.connect();
      await this.executeSqlFile(this.undoFile, "Database Rollback");
    } catch (error) {
      logger.error("Rollback failed", { error });
      throw error;
    } finally {
      await this.disconnect();
    }
  }

  /**
   * Reset database (rollback then migrate)
   */
  public async reset(): Promise<void> {
    try {
      logger.info("Starting database reset...");

      await this.connect();

      // First rollback
      await this.executeSqlFile(this.undoFile, "Database Rollback");

      // Then migrate
      await this.executeSqlFile(this.migrationFile, "Database Migration");

      logger.info("Database reset completed successfully");
    } catch (error) {
      logger.error("Database reset failed", { error });
      throw error;
    } finally {
      await this.disconnect();
    }
  }

  /**
   * Check database connection
   */
  public async checkConnection(): Promise<boolean> {
    try {
      await this.connect();

      const result = await this.client.query("SELECT NOW() as current_time");

      logger.info("Database connection test successful", {
        currentTime: result.rows[0].current_time,
      });

      return true;
    } catch (error) {
      logger.error("Database connection test failed", { error });
      return false;
    } finally {
      await this.disconnect();
    }
  }

  /**
   * Synchronize database schema with current models
   * This will create tables that don't exist and update existing ones
   */
  public async sync(): Promise<void> {
    try {
      logger.info("Starting database synchronization...");

      // Import Sequelize and models for sync
      const { Sequelize } = require("sequelize");
      const { DatabaseConnection } = require("../src/config/database");

      // Get database connection
      const dbConnection = DatabaseConnection.getInstance();
      await dbConnection.connect();
      const sequelize = dbConnection.getSequelize();

      // Import all models to ensure they are registered
      require("../src/features/users/user.model");
      require("../src/features/blog/blog.model");
      require("../src/features/products/product.model");
      require("../src/features/movies/movie.model");
      require("../src/features/rentals/rental.model");
      require("../src/features/rooms/room.model");
      require("../src/features/news/news.model");
      require("../src/features/careers/career.model");
      require("../src/features/restaurants/restaurant.model");

      // Sync all models with database
      await sequelize.sync({ alter: true });

      logger.info("Database synchronization completed successfully");
    } catch (error) {
      logger.error("Database synchronization failed", { error });
      throw error;
    }
  }

  /**
   * Force sync database schema (drops and recreates all tables)
   * WARNING: This will destroy all data!
   */
  public async forceSync(): Promise<void> {
    try {
      logger.warn(
        "Starting FORCE database synchronization (WILL DESTROY ALL DATA)"
      );

      // Import Sequelize and models for sync
      const { Sequelize } = require("sequelize");
      const { DatabaseConnection } = require("../src/config/database");

      // Get database connection
      const dbConnection = DatabaseConnection.getInstance();
      await dbConnection.connect();
      const sequelize = dbConnection.getSequelize();

      // Import all models to ensure they are registered
      require("../src/features/users/user.model");
      require("../src/features/blog/blog.model");
      require("../src/features/products/product.model");
      require("../src/features/movies/movie.model");
      require("../src/features/rentals/rental.model");
      require("../src/features/rooms/room.model");
      require("../src/features/news/news.model");
      require("../src/features/careers/career.model");
      require("../src/features/restaurants/restaurant.model");

      // Force sync all models with database (drops and recreates)
      await sequelize.sync({ force: true });

      logger.info("FORCE database synchronization completed successfully");
    } catch (error) {
      logger.error("FORCE database synchronization failed", { error });
      throw error;
    }
  }

  /**
   * Get database schema information
   */
  public async getSchemaInfo(): Promise<any> {
    try {
      await this.connect();

      // Get all tables
      const tablesResult = await this.client.query(`
        SELECT 
          table_name,
          table_type
        FROM information_schema.tables 
        WHERE table_schema = 'public'
        ORDER BY table_name
      `);

      // Get table details
      const tableDetails: Array<{
        table: string;
        type: string;
        columns: any[];
      }> = [];

      for (const table of tablesResult.rows) {
        const columnsResult = await this.client.query(
          `
          SELECT 
            column_name,
            data_type,
            is_nullable,
            column_default
          FROM information_schema.columns 
          WHERE table_name = $1
          ORDER BY ordinal_position
        `,
          [table.table_name]
        );

        tableDetails.push({
          table: table.table_name,
          type: table.table_type,
          columns: columnsResult.rows,
        });
      }

      logger.info("Schema information retrieved successfully", {
        tableCount: tableDetails.length,
      });

      return tableDetails;
    } catch (error) {
      logger.error("Failed to get schema information", { error });
      throw error;
    } finally {
      await this.disconnect();
    }
  }
}

/**
 * Get database configuration from environment variables
 */
function getDatabaseConfig(): DatabaseConfig {
  const requiredEnvVars = [
    "DB_HOST",
    "DB_PORT",
    "DB_NAME",
    "DB_USERNAME",
    "DB_PASSWORD",
  ];
  const missingVars = requiredEnvVars.filter(
    (varName) => !process.env[varName]
  );

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(", ")}`
    );
  }

  return {
    host: process.env.DB_HOST!,
    port: parseInt(process.env.DB_PORT!),
    database: process.env.DB_NAME!,
    username: process.env.DB_USERNAME!,
    password: process.env.DB_PASSWORD!,
  };
}

/**
 * Main function to handle command line arguments
 */
async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const command = args[0];

  if (!command) {
    console.log(`
Usage: npx ts-node scripts/migration-runner.ts <command>

Commands:
  migrate    - Run database migrations
  rollback   - Rollback database migrations
  reset      - Rollback then migrate (complete reset)
  sync       - Synchronize database schema with current models
  force-sync - Force sync (drops and recreates all tables - DESTROYS DATA!)
  schema     - Get database schema information
  check      - Test database connection

Examples:
  npx ts-node scripts/migration-runner.ts migrate
  npx ts-node scripts/migration-runner.ts rollback
  npx ts-node scripts/migration-runner.ts reset
  npx ts-node scripts/migration-runner.ts sync
  npx ts-node scripts/migration-runner.ts force-sync
  npx ts-node scripts/migration-runner.ts schema
  npx ts-node scripts/migration-runner.ts check
    `);
    process.exit(1);
  }

  try {
    const config = getDatabaseConfig();
    const runner = new MigrationRunner(config);

    switch (command) {
      case "migrate":
        await runner.migrate();
        break;

      case "rollback":
        await runner.rollback();
        break;

      case "reset":
        await runner.reset();
        break;

      case "sync":
        await runner.sync();
        break;

      case "force-sync":
        await runner.forceSync();
        break;

      case "schema":
        const schemaInfo = await runner.getSchemaInfo();
        console.log(JSON.stringify(schemaInfo, null, 2));
        break;

      case "check":
        const isConnected = await runner.checkConnection();
        process.exit(isConnected ? 0 : 1);
        break;

      default:
        logger.error(`Unknown command: ${command}`);
        process.exit(1);
    }

    logger.info(`Command '${command}' completed successfully`);
    process.exit(0);
  } catch (error) {
    logger.error(`Command '${command}' failed`, {
      error: error instanceof Error ? error.message : error,
    });
    process.exit(1);
  }
}

// Export the MigrationRunner class for programmatic use
export { MigrationRunner, type DatabaseConfig };

// Run main function if this file is executed directly
if (require.main === module) {
  main();
}
