// @ts-nocheck
import "dotenv/config";
import { DatabaseConnection } from "../src/config/database";
import { Logger } from "../src/config/logger";
import { BcryptHelper } from "../src/shared/utils/bcrypt.helper";
import * as fs from "fs";
import * as path from "path";

// Create logger instance
const logger = Logger.getInstance();

// Interface for seed data structure
interface SeedData {
  [key: string]: any[];
}

class SeedRunner {
  private readonly dataDirectory: string;
  private models: any = {};

  constructor() {
    this.dataDirectory = path.join(__dirname, "..", "data");
  }

  private async initializeModels(): Promise<void> {
    // Import models dynamically after database connection
    const { User } = require("../src/features/users/user.model");
    const {
      BlogCategory,
      BlogPost,
    } = require("../src/features/blog/blog.model");
    const {
      BrandedCategory,
      BrandedProduct,
    } = require("../src/features/products/product.model");
    const { MovieGenre, Movie } = require("../src/features/movies/movie.model");
    const {
      RentalType,
      RentalTransportation,
    } = require("../src/features/rentals/rental.model");
    const {
      RoomType,
      RoomLodging,
    } = require("../src/features/rooms/room.model");
    const {
      NewsCategory,
      NewsArticle,
    } = require("../src/features/news/news.model");
    const {
      CareerCompany,
      CareerJob,
    } = require("../src/features/careers/career.model");
    const {
      RestaurantCategory,
      RestaurantCuisine,
    } = require("../src/features/restaurants/restaurant.model");

    this.models = {
      User,
      BlogCategory,
      BlogPost,
      BrandedCategory,
      BrandedProduct,
      MovieGenre,
      Movie,
      RentalType,
      RentalTransportation,
      RoomType,
      RoomLodging,
      NewsCategory,
      NewsArticle,
      CareerCompany,
      CareerJob,
      RestaurantCategory,
      RestaurantCuisine,
    };
  }

  /**
   * Read JSON file and return parsed data
   */
  private readJsonFile(filePath: string): any[] {
    try {
      if (!fs.existsSync(filePath)) {
        logger.warn(`JSON file not found: ${filePath}`);
        return [];
      }

      const content = fs.readFileSync(filePath, "utf8");

      if (!content.trim()) {
        logger.warn(`JSON file is empty: ${filePath}`);
        return [];
      }

      return JSON.parse(content);
    } catch (error) {
      logger.error(`Failed to read JSON file: ${filePath}`, { error });
      throw error;
    }
  }

  /**
   * Load all seed data from JSON files
   */
  private loadSeedData(): SeedData {
    const seedData: SeedData = {};

    try {
      // Blog data
      seedData.blogCategories = this.readJsonFile(
        path.join(this.dataDirectory, "blog", "categories.json")
      );
      seedData.blogPosts = this.readJsonFile(
        path.join(this.dataDirectory, "blog", "posts.json")
      );

      // Branded products data
      seedData.brandedCategories = this.readJsonFile(
        path.join(this.dataDirectory, "branded", "categories.json")
      );
      seedData.brandedProducts = this.readJsonFile(
        path.join(this.dataDirectory, "branded", "products.json")
      );

      // Career data
      seedData.careerCompanies = this.readJsonFile(
        path.join(this.dataDirectory, "career", "companies.json")
      );
      seedData.careerJobs = this.readJsonFile(
        path.join(this.dataDirectory, "career", "jobs.json")
      );

      // Movies data
      seedData.movieGenres = this.readJsonFile(
        path.join(this.dataDirectory, "movies", "genres.json")
      );
      seedData.movies = this.readJsonFile(
        path.join(this.dataDirectory, "movies", "movies.json")
      );

      // News data
      seedData.newsCategories = this.readJsonFile(
        path.join(this.dataDirectory, "news", "categories.json")
      );
      seedData.newsArticles = this.readJsonFile(
        path.join(this.dataDirectory, "news", "articles.json")
      );

      // Rental data
      seedData.rentalTypes = this.readJsonFile(
        path.join(this.dataDirectory, "rental", "types.json")
      );
      seedData.rentalTransportations = this.readJsonFile(
        path.join(this.dataDirectory, "rental", "transportations.json")
      );

      // Restaurant data
      seedData.restaurantCategories = this.readJsonFile(
        path.join(this.dataDirectory, "restaurant", "categories.json")
      );
      seedData.restaurantCuisines = this.readJsonFile(
        path.join(this.dataDirectory, "restaurant", "cuisines.json")
      );

      // Room data
      seedData.roomTypes = this.readJsonFile(
        path.join(this.dataDirectory, "room", "types.json")
      );
      seedData.roomLodgings = this.readJsonFile(
        path.join(this.dataDirectory, "room", "lodgings.json")
      );

      return seedData;
    } catch (error) {
      logger.error("Failed to load seed data", { error });
      throw error;
    }
  }

  /**
   * Create default users for seeding
   */
  private async createDefaultUsers(): Promise<any[]> {
    const users = [
      {
        username: "admin1",
        email: "admin@mail.com",
        password: "123456",
        role: "Admin",
        phoneNumber: "+1234567890",
        address: "123 Admin Street, Admin City",
      },
      {
        username: "staff1",
        email: "staff1@mail.com",
        password: "123456",
        role: "Staff",
        phoneNumber: "+1234567891",
        address: "124 Staff Street, Staff City",
      },
      {
        username: "staff2",
        email: "staff2@example.com",
        password: "123456",
        role: "Staff",
        phoneNumber: "+1234567892",
        address: "125 Staff Street, Staff City",
      },
      {
        username: "user1",
        email: "user1@example.com",
        password: "123456",
        role: "User",
        phoneNumber: "+1234567893",
        address: "126 User Street, User City",
      },
      {
        username: "user2",
        email: "user2@example.com",
        password: "123456",
        role: "User",
        phoneNumber: "+1234567894",
        address: "127 User Street, User City",
      },
      {
        username: "editor1",
        email: "editor1@example.com",
        password: "123456",
        role: "Staff",
        phoneNumber: "+1234567895",
        address: "128 Editor Street, Editor City",
      },
      {
        username: "editor2",
        email: "editor2@example.com",
        password: "123456",
        role: "Staff",
        phoneNumber: "+1234567896",
        address: "129 Editor Street, Editor City",
      },
      {
        username: "manager1",
        email: "manager1@example.com",
        password: "123456",
        role: "Admin",
        phoneNumber: "+1234567897",
        address: "130 Manager Street, Manager City",
      },
      {
        username: "moderator1",
        email: "moderator1@example.com",
        password: "123456",
        role: "Staff",
        phoneNumber: "+1234567898",
        address: "131 Moderator Street, Moderator City",
      },
      {
        username: "content_creator",
        email: "creator@example.com",
        password: "123456",
        role: "Staff",
        phoneNumber: "+1234567899",
        address: "132 Creator Street, Creator City",
      },
    ];

    // Hash passwords for all users
    for (const user of users) {
      user.password = await BcryptHelper.hashPassword(user.password);
    }

    return users;
  }

  /**
   * Seed users data
   */
  private async seedUsers(transaction: any): Promise<void> {
    try {
      logger.info("Seeding users...");

      // console.log(
      //   "ANGGA_DEBUG",
      //   await this.models.User.findAll({ transaction })
      // );
      const users = await this.createDefaultUsers();
      await this.models.User.bulkCreate(users, {
        transaction,
        individualHooks: false, // Skip model hooks since we already hashed passwords
      });

      logger.info(`Successfully seeded ${users.length} users`);
    } catch (error) {
      logger.error("Failed to seed users", { error });
      throw error;
    }
  }

  /**
   * Seed blog data
   */
  private async seedBlogData(
    seedData: SeedData,
    transaction: any
  ): Promise<void> {
    try {
      logger.info("Seeding blog data...");

      // Seed blog categories
      if (seedData.blogCategories.length > 0) {
        await this.models.BlogCategory.bulkCreate(seedData.blogCategories, {
          transaction,
        });
        logger.info(
          `Successfully seeded ${seedData.blogCategories.length} blog categories`
        );
      }

      // Seed blog posts
      if (seedData.blogPosts.length > 0) {
        await this.models.BlogPost.bulkCreate(seedData.blogPosts, {
          transaction,
        });
        logger.info(
          `Successfully seeded ${seedData.blogPosts.length} blog posts`
        );
      }
    } catch (error) {
      logger.error("Failed to seed blog data", { error });
      // @ts-ignore
      console.log(error.name, error.message, error.stack);
      // fs.writeFileSync(
      //   path.join(__dirname, "posts.json"),
      //   error
      // );
      throw error;
    }
  }

  /**
   * Seed branded products data
   */
  private async seedBrandedData(
    seedData: SeedData,
    transaction: any
  ): Promise<void> {
    try {
      logger.info("Seeding branded products data...");

      // Seed branded categories
      if (seedData.brandedCategories.length > 0) {
        await this.models.BrandedCategory.bulkCreate(
          seedData.brandedCategories,
          {
            transaction,
          }
        );
        logger.info(
          `Successfully seeded ${seedData.brandedCategories.length} branded categories`
        );
      }

      // Seed branded products
      if (seedData.brandedProducts.length > 0) {
        await this.models.BrandedProduct.bulkCreate(seedData.brandedProducts, {
          transaction,
        });
        logger.info(
          `Successfully seeded ${seedData.brandedProducts.length} branded products`
        );
      }
    } catch (error) {
      logger.error("Failed to seed branded products data", { error });
      throw error;
    }
  }

  /**
   * Seed movies data
   */
  private async seedMoviesData(
    seedData: SeedData,
    transaction: any
  ): Promise<void> {
    try {
      logger.info("Seeding movies data...");

      // Seed movie genres
      if (seedData.movieGenres.length > 0) {
        await this.models.MovieGenre.bulkCreate(seedData.movieGenres, {
          transaction,
        });
        logger.info(
          `Successfully seeded ${seedData.movieGenres.length} movie genres`
        );
      }

      // Seed movies
      if (seedData.movies.length > 0) {
        await this.models.Movie.bulkCreate(seedData.movies, { transaction });
        logger.info(`Successfully seeded ${seedData.movies.length} movies`);
      }
    } catch (error) {
      logger.error("Failed to seed movies data", { error });
      throw error;
    }
  }

  /**
   * Seed rental data
   */
  private async seedRentalData(
    seedData: SeedData,
    transaction: any
  ): Promise<void> {
    try {
      logger.info("Seeding rental data...");

      // Seed rental types
      if (seedData.rentalTypes.length > 0) {
        await this.models.RentalType.bulkCreate(seedData.rentalTypes, {
          transaction,
        });
        logger.info(
          `Successfully seeded ${seedData.rentalTypes.length} rental types`
        );
      }

      // Seed rental transportations
      if (seedData.rentalTransportations.length > 0) {
        await this.models.RentalTransportation.bulkCreate(
          seedData.rentalTransportations,
          {
            transaction,
          }
        );
        logger.info(
          `Successfully seeded ${seedData.rentalTransportations.length} rental transportations`
        );
      }
    } catch (error) {
      logger.error("Failed to seed rental data", { error });
      throw error;
    }
  }

  /**
   * Seed room data
   */
  private async seedRoomData(
    seedData: SeedData,
    transaction: any
  ): Promise<void> {
    try {
      logger.info("Seeding room data...");

      // Seed room types
      if (seedData.roomTypes.length > 0) {
        await this.models.RoomType.bulkCreate(seedData.roomTypes, {
          transaction,
        });
        logger.info(
          `Successfully seeded ${seedData.roomTypes.length} room types`
        );
      }

      // Seed room lodgings
      if (seedData.roomLodgings.length > 0) {
        await this.models.RoomLodging.bulkCreate(seedData.roomLodgings, {
          transaction,
        });
        logger.info(
          `Successfully seeded ${seedData.roomLodgings.length} room lodgings`
        );
      }
    } catch (error) {
      logger.error("Failed to seed room data", { error });
      throw error;
    }
  }

  /**
   * Seed news data
   */
  private async seedNewsData(
    seedData: SeedData,
    transaction: any
  ): Promise<void> {
    try {
      logger.info("Seeding news data...");

      // Seed news categories
      if (seedData.newsCategories.length > 0) {
        await this.models.NewsCategory.bulkCreate(seedData.newsCategories, {
          transaction,
        });
        logger.info(
          `Successfully seeded ${seedData.newsCategories.length} news categories`
        );
      }

      // Seed news articles
      if (seedData.newsArticles.length > 0) {
        await this.models.NewsArticle.bulkCreate(seedData.newsArticles, {
          transaction,
        });
        logger.info(
          `Successfully seeded ${seedData.newsArticles.length} news articles`
        );
      }
    } catch (error) {
      logger.error("Failed to seed news data", { error });
      throw error;
    }
  }

  /**
   * Seed career data
   */
  private async seedCareerData(
    seedData: SeedData,
    transaction: any
  ): Promise<void> {
    try {
      logger.info("Seeding career data...");

      // Seed career companies
      if (seedData.careerCompanies.length > 0) {
        await this.models.CareerCompany.bulkCreate(seedData.careerCompanies, {
          transaction,
        });
        logger.info(
          `Successfully seeded ${seedData.careerCompanies.length} career companies`
        );
      }

      // Seed career jobs
      if (seedData.careerJobs.length > 0) {
        await this.models.CareerJob.bulkCreate(seedData.careerJobs, {
          transaction,
        });
        logger.info(
          `Successfully seeded ${seedData.careerJobs.length} career jobs`
        );
      }
    } catch (error) {
      logger.error("Failed to seed career data", { error });
      throw error;
    }
  }

  /**
   * Seed restaurant data
   */
  private async seedRestaurantData(
    seedData: SeedData,
    transaction: any
  ): Promise<void> {
    try {
      logger.info("Seeding restaurant data...");

      // Seed restaurant categories
      if (seedData.restaurantCategories.length > 0) {
        await this.models.RestaurantCategory.bulkCreate(
          seedData.restaurantCategories,
          {
            transaction,
          }
        );
        logger.info(
          `Successfully seeded ${seedData.restaurantCategories.length} restaurant categories`
        );
      }

      // Seed restaurant cuisines
      if (seedData.restaurantCuisines.length > 0) {
        await this.models.RestaurantCuisine.bulkCreate(
          seedData.restaurantCuisines,
          {
            transaction,
          }
        );
        logger.info(
          `Successfully seeded ${seedData.restaurantCuisines.length} restaurant cuisines`
        );
      }
    } catch (error) {
      logger.error("Failed to seed restaurant data", { error });
      throw error;
    }
  }

  /**
   * Clear all data from database using destroy method
   */
  private async clearDatabase(transaction: any): Promise<void> {
    try {
      logger.info("Clearing existing database data...");

      // Clear in reverse dependency order
      await this.models.RestaurantCuisine.destroy({
        where: {},
        transaction,
        truncate: true,
        restartIdentity: true,
        cascade: true,
      });
      await this.models.RestaurantCategory.destroy({
        where: {},
        transaction,
        truncate: true,
        restartIdentity: true,
        cascade: true,
      });

      await this.models.CareerJob.destroy({
        where: {},
        transaction,
        truncate: true,
        restartIdentity: true,
        cascade: true,
      });
      await this.models.CareerCompany.destroy({
        where: {},
        transaction,
        truncate: true,
        restartIdentity: true,
        cascade: true,
      });

      await this.models.NewsArticle.destroy({
        where: {},
        transaction,
        truncate: true,
        restartIdentity: true,
        cascade: true,
      });
      await this.models.NewsCategory.destroy({
        where: {},
        transaction,
        truncate: true,
        restartIdentity: true,
        cascade: true,
      });

      await this.models.RoomLodging.destroy({
        where: {},
        transaction,
        truncate: true,
        restartIdentity: true,
        cascade: true,
      });
      await this.models.RoomType.destroy({
        where: {},
        transaction,
        truncate: true,
        restartIdentity: true,
        cascade: true,
      });
      await this.models.RentalType.destroy({
        where: {},
        transaction,
        truncate: true,
        restartIdentity: true,
        cascade: true,
      });

      await this.models.RentalTransportation.destroy({
        where: {},
        transaction,
        truncate: true,
        restartIdentity: true,
        cascade: true,
      });
      await this.models.RentalType.destroy({
        where: {},
        transaction,
        truncate: true,
        restartIdentity: true,
        cascade: true,
      });

      await this.models.Movie.destroy({
        where: {},
        transaction,
        truncate: true,
        restartIdentity: true,
        cascade: true,
      });
      await this.models.MovieGenre.destroy({
        where: {},
        transaction,
        truncate: true,
        restartIdentity: true,
        cascade: true,
      });

      await this.models.BrandedProduct.destroy({
        where: {},
        transaction,
        truncate: true,
        restartIdentity: true,
        cascade: true,
      });
      await this.models.BrandedCategory.destroy({
        where: {},
        transaction,
        truncate: true,
        restartIdentity: true,
        cascade: true,
      });

      await this.models.BlogPost.destroy({
        where: {},
        transaction,
        truncate: true,
        restartIdentity: true,
        cascade: true,
      });
      await this.models.BlogCategory.destroy({
        where: {},
        transaction,
        truncate: true,
        restartIdentity: true,
        cascade: true,
      });

      await this.models.User.destroy({
        where: {},
        transaction,
        truncate: true,
        restartIdentity: true,
        cascade: true,
      });

      logger.info("Database cleared successfully");
    } catch (error) {
      logger.error("Failed to clear database", { error });
      throw error;
    }
  }

  /**
   * Advanced undo functionality with options for truncate, restart identity, and cascade
   */
  public async undoSeeds(
    options: {
      restartIdentity?: boolean;
      truncate?: boolean;
      cascade?: boolean;
    } = {}
  ): Promise<void> {
    const dbConnection = DatabaseConnection.getInstance();
    await dbConnection.connect();
    await this.initializeModels();
    const sequelize = dbConnection.getSequelize();
    const transaction = await sequelize.transaction();
    const startTime = Date.now();

    try {
      logger.info("Starting database undo process...", { options });

      if (options.truncate) {
        await this.truncateAllTables(transaction, options);
      } else {
        // Use regular destroy method
        await this.clearDatabase(transaction);
      }

      await transaction.commit();

      const duration = Date.now() - startTime;
      logger.info("Database undo completed successfully", {
        duration: `${duration}ms`,
        options,
      });
    } catch (error) {
      await transaction.rollback();
      const duration = Date.now() - startTime;
      logger.error("Database undo failed", {
        error: error instanceof Error ? error.message : error,
        duration: `${duration}ms`,
        options,
      });
      throw error;
    }
  }

  /**
   * Truncate all tables with advanced options
   */
  private async truncateAllTables(
    transaction: any,
    options: {
      restartIdentity?: boolean;
      cascade?: boolean;
    }
  ): Promise<void> {
    try {
      logger.info("Truncating all tables...", { options });

      // Get sequelize instance
      const dbConnection = DatabaseConnection.getInstance();
      const sequelize = dbConnection.getSequelize();

      // Define table order for truncation (reverse dependency order)
      const tableOrder = [
        '"Restaurant_Cuisines"',
        '"Restaurant_Categories"',
        '"Career_Jobs"',
        '"Career_Companies"',
        '"News_Articles"',
        '"News_Categories"',
        '"Room_Lodgings"',
        '"Room_Types"',
        '"Rental_Transportations"',
        '"Rental_Types"',
        '"Movie_Movies"',
        '"Movie_Genres"',
        '"Branded_Products"',
        '"Branded_Categories"',
        '"Blog_Posts"',
        '"Blog_Categories"',
        '"Users"',
      ];

      // Build truncate options
      const truncateOptions: string[] = [];
      if (options.restartIdentity) {
        truncateOptions.push("RESTART IDENTITY");
      }
      if (options.cascade) {
        truncateOptions.push("CASCADE");
      }

      const optionsString =
        truncateOptions.length > 0 ? ` ${truncateOptions.join(" ")}` : "";

      // Method 1: Individual table truncation (safer, more control)
      if (!options.cascade) {
        for (const tableName of tableOrder) {
          try {
            const sql = `TRUNCATE TABLE ${tableName}${optionsString};`;
            logger.info(`Truncating table: ${tableName}`);
            await sequelize.query(sql, { transaction });
            logger.info(`Successfully truncated: ${tableName}`);
          } catch (error) {
            logger.warn(`Failed to truncate ${tableName}:`, {
              error: error instanceof Error ? error.message : error,
            });
            // Continue with other tables
          }
        }
      } else {
        // Method 2: Cascade truncation (all at once)
        try {
          const allTables = tableOrder.join(", ");
          const sql = `TRUNCATE TABLE ${allTables}${optionsString};`;
          logger.info("Truncating all tables with CASCADE");
          await sequelize.query(sql, { transaction });
          logger.info("Successfully truncated all tables");
        } catch (error) {
          logger.warn(
            "CASCADE truncation failed, falling back to individual truncation"
          );
          // Fallback to individual truncation
          for (const tableName of tableOrder) {
            try {
              const sql = `TRUNCATE TABLE ${tableName}${optionsString};`;
              await sequelize.query(sql, { transaction });
              logger.info(`Fallback truncated: ${tableName}`);
            } catch (innerError) {
              logger.warn(`Fallback truncation failed for ${tableName}:`, {
                error:
                  innerError instanceof Error ? innerError.message : innerError,
              });
            }
          }
        }
      }

      logger.info("Table truncation completed");
    } catch (error) {
      logger.error("Failed to truncate tables", { error });
      throw error;
    }
  }

  /**
   * Quick truncate method using Sequelize's built-in truncate
   */
  public async quickTruncate(
    options: {
      restartIdentity?: boolean;
      cascade?: boolean;
    } = {}
  ): Promise<void> {
    const dbConnection = DatabaseConnection.getInstance();
    await dbConnection.connect();
    await this.initializeModels();
    const sequelize = dbConnection.getSequelize();
    const transaction = await sequelize.transaction();
    const startTime = Date.now();

    try {
      logger.info("Starting quick truncate process...", { options });

      // Truncate using Sequelize's built-in method
      const modelOrder = [
        this.models.RestaurantCuisine,
        this.models.RestaurantCategory,
        this.models.CareerJob,
        this.models.CareerCompany,
        this.models.NewsArticle,
        this.models.NewsCategory,
        this.models.RoomLodging,
        this.models.RoomType,
        this.models.RentalTransportation,
        this.models.RentalType,
        this.models.Movie,
        this.models.MovieGenre,
        this.models.BrandedProduct,
        this.models.BrandedCategory,
        this.models.BlogPost,
        this.models.BlogCategory,
        this.models.User,
      ];

      for (const model of modelOrder) {
        try {
          await model.truncate({
            transaction,
            restartIdentity: options.restartIdentity ?? false,
            cascade: options.cascade ?? false,
          });
          logger.info(`Quick truncated: ${model.name}`);
        } catch (error) {
          logger.warn(`Quick truncate failed for ${model.name}:`, {
            error: error instanceof Error ? error.message : error,
          });
        }
      }

      await transaction.commit();

      const duration = Date.now() - startTime;
      logger.info("Quick truncate completed successfully", {
        duration: `${duration}ms`,
        options,
      });
    } catch (error) {
      await transaction.rollback();
      const duration = Date.now() - startTime;
      logger.error("Quick truncate failed", {
        error: error instanceof Error ? error.message : error,
        duration: `${duration}ms`,
        options,
      });
      throw error;
    }
  }

  /**
   * Run the seeding process
   */
  public async seed(clearFirst: boolean = true): Promise<void> {
    const dbConnection = DatabaseConnection.getInstance();
    await dbConnection.connect();
    await this.initializeModels();
    const sequelize = dbConnection.getSequelize();
    const transaction = await sequelize.transaction();
    const startTime = Date.now();

    try {
      logger.info("Starting database seeding process...");

      // Clear database if requested
      if (clearFirst) {
        logger.info("Clearing database...");
        await this.clearDatabase(transaction);
      }

      // Load all seed data
      const seedData = this.loadSeedData();

      // Seed users first (required for foreign keys)
      await this.seedUsers(transaction);

      // Seed all modules (categories/types first, then related items)
      await this.seedBlogData(seedData, transaction);
      await this.seedBrandedData(seedData, transaction);
      await this.seedMoviesData(seedData, transaction);
      await this.seedRentalData(seedData, transaction);
      await this.seedRoomData(seedData, transaction);
      await this.seedNewsData(seedData, transaction);
      await this.seedCareerData(seedData, transaction);
      await this.seedRestaurantData(seedData, transaction);

      // Commit transaction
      await transaction.commit();

      const duration = Date.now() - startTime;
      logger.info("Database seeding completed successfully", {
        duration: `${duration}ms`,
      });
    } catch (error) {
      await transaction.rollback();
      const duration = Date.now() - startTime;
      logger.error("Database seeding failed", {
        error: error instanceof Error ? error.message : error,
        duration: `${duration}ms`,
      });
      throw error;
    }
  }

  /**
   * Test database connection
   */
  public async testConnection(): Promise<boolean> {
    try {
      const dbConnection = DatabaseConnection.getInstance();
      await dbConnection.connect();
      const result = await dbConnection.testConnection();
      if (result) {
        logger.info("Database connection test successful");
      }
      return result;
    } catch (error) {
      logger.error("Database connection test failed", { error });
      return false;
    }
  }
}

/**
 * Main function to handle command line arguments
 */
async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const command = args[0];
  const clearFirst = args.includes("--clear") || args.includes("-c");

  // Parse undo options
  const restartIdentity =
    args.includes("--restart-identity") || args.includes("-r");
  const truncate = args.includes("--truncate") || args.includes("-t");
  const cascade = args.includes("--cascade") || args.includes("--force");

  if (!command) {
    console.log(`
Usage: npx ts-node scripts/seeder.ts <command> [options]

Commands:
  seed       - Run database seeding
  clear      - Clear all data and seed fresh
  undo       - Undo seeds with advanced options
  truncate   - Quick truncate using Sequelize
  test       - Test database connection

Options:
  --clear, -c           - Clear existing data before seeding
  --restart-identity, -r - Restart identity sequences when truncating
  --truncate, -t        - Use TRUNCATE instead of DELETE for undo
  --cascade, --force    - Use CASCADE to handle foreign key constraints
  
Examples:
  npx ts-node scripts/seeder.ts seed
  npx ts-node scripts/seeder.ts seed --clear
  npx ts-node scripts/seeder.ts clear
  npx ts-node scripts/seeder.ts undo
  npx ts-node scripts/seeder.ts undo --truncate
  npx ts-node scripts/seeder.ts undo --truncate --restart-identity
  npx ts-node scripts/seeder.ts undo --truncate --restart-identity --cascade
  npx ts-node scripts/seeder.ts truncate --restart-identity
  npx ts-node scripts/seeder.ts test
    `);
    process.exit(1);
  }

  try {
    const seeder = new SeedRunner();

    switch (command) {
      case "seed":
        await seeder.seed(clearFirst);
        break;

      case "clear":
        await seeder.seed(true);
        break;

      case "undo":
        await seeder.undoSeeds({
          restartIdentity,
          truncate,
          cascade,
        });
        break;

      case "truncate":
        await seeder.quickTruncate({
          restartIdentity,
          cascade,
        });
        break;

      case "test":
        const isConnected = await seeder.testConnection();
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

// Export the SeedRunner class for programmatic use
export { SeedRunner };

// Run main function if this file is executed directly
if (require.main === module) {
  main();
}
