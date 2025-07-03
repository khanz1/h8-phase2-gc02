import "dotenv/config";
import { Logger } from "@/config/logger";
import { DatabaseConnection } from "@/config/database";
import { BcryptHelper } from "@/shared/utils/bcrypt.helper";
import * as fs from "fs";
import * as path from "path";

// Import all models
import { User } from "@/features/users/user.model";
import { BlogCategory, BlogPost } from "@/features/blog/blog.model";
import {
  BrandedCategory,
  BrandedProduct,
} from "@/features/products/product.model";
import { MovieGenre, Movie } from "@/features/movies/movie.model";
import {
  RentalType,
  RentalTransportation,
} from "@/features/rentals/rental.model";
import { RoomType, RoomLodging } from "@/features/rooms/room.model";
import { NewsCategory, NewsArticle } from "@/features/news/news.model";
import { CareerCompany, CareerJob } from "@/features/careers/career.model";
import {
  RestaurantCategory,
  RestaurantCuisine,
} from "@/features/restaurants/restaurant.model";
import { Anime } from "@/features/lecture/lecture.model";

// Interface for seed data structure
interface SeedData {
  [key: string]: any[];
}

export interface SeedOptions {
  restartIdentity?: boolean;
  truncate?: boolean;
  cascade?: boolean;
}

export class SeedService {
  private readonly logger = new Logger(SeedService.name);
  private readonly dataDirectory: string;
  private models: any = {};

  constructor() {
    this.dataDirectory = path.join(__dirname, "..", "..", "data");
  }

  private async initializeModels(): Promise<void> {
    // Initialize models object with imported models
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
      Anime,
    };
  }

  /**
   * Read JSON file and return parsed data
   */
  private readJsonFile(filePath: string): any[] {
    try {
      if (!fs.existsSync(filePath)) {
        this.logger.warn(`JSON file not found: ${filePath}`);
        return [];
      }

      const content = fs.readFileSync(filePath, "utf8");

      if (!content.trim()) {
        this.logger.warn(`JSON file is empty: ${filePath}`);
        return [];
      }

      return JSON.parse(content);
    } catch (error) {
      this.logger.error(`Failed to read JSON file: ${filePath}`, { error });
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

      // Anime data
      seedData.animes = this.readJsonFile(
        path.join(this.dataDirectory, "lecture", "animes.json")
      );

      return seedData;
    } catch (error) {
      this.logger.error("Failed to load seed data", { error });
      throw error;
    }
  }

  /**
   * Create default users for seeding
   */
  private async createDefaultUsers(): Promise<any[]> {
    const users = [
      {
        username: "andi_prasetyo",
        email: "andi.prasetyo@gmail.com",
        password: "123456",
        role: "Admin",
        phoneNumber: "+6281234567890",
        address:
          "Jl. Sudirman No. 45, Menteng, Jakarta Pusat, DKI Jakarta 10310",
      },
      {
        username: "sari_wijaya",
        email: "sari.wijaya@yahoo.co.id",
        password: "123456",
        role: "Staff",
        phoneNumber: "+6282345678901",
        address: "Jl. Malioboro No. 123, Gedongtengen, Yogyakarta, DIY 55271",
      },
      {
        username: "budi_santoso",
        email: "budi.santoso@outlook.co.id",
        password: "123456",
        role: "Staff",
        phoneNumber: "+6283456789012",
        address: "Jl. Braga No. 78, Sumur Bandung, Bandung, Jawa Barat 40111",
      },
      {
        username: "dewi_lestari",
        email: "dewi.lestari@gmail.com",
        password: "123456",
        role: "User",
        phoneNumber: "+6284567890123",
        address: "Jl. Diponegoro No. 156, Citarum, Semarang, Jawa Tengah 50241",
      },
      {
        username: "rudi_hermawan",
        email: "rudi.hermawan@yahoo.co.id",
        password: "123456",
        role: "User",
        phoneNumber: "+6285678901234",
        address: "Jl. Veteran No. 89, Ketabang, Surabaya, Jawa Timur 60272",
      },
      {
        username: "maya_sari",
        email: "maya.sari@gmail.com",
        password: "123456",
        role: "Staff",
        phoneNumber: "+6286789012345",
        address:
          "Jl. Asia Afrika No. 234, Sumur Bandung, Bandung, Jawa Barat 40112",
      },
      {
        username: "agus_wibowo",
        email: "agus.wibowo@outlook.co.id",
        password: "123456",
        role: "Staff",
        phoneNumber: "+6287890123456",
        address:
          "Jl. Gajah Mada No. 67, Krukut, Jakarta Barat, DKI Jakarta 11140",
      },
      {
        username: "indira_putri",
        email: "indira.putri@gmail.com",
        password: "123456",
        role: "Admin",
        phoneNumber: "+6288901234567",
        address:
          "Jl. Imam Bonjol No. 198, Menteng, Jakarta Pusat, DKI Jakarta 10310",
      },
      {
        username: "farhan_alatas",
        email: "farhan.alatas@yahoo.co.id",
        password: "123456",
        role: "Staff",
        phoneNumber: "+6289012345678",
        address:
          "Jl. Pemuda No. 45, Semarang Tengah, Semarang, Jawa Tengah 50132",
      },
      {
        username: "ratna_kusuma",
        email: "ratna.kusuma@gmail.com",
        password: "123456",
        role: "Staff",
        phoneNumber: "+6281123456789",
        address:
          "Jl. Raya Darmo No. 112, Wonokromo, Surabaya, Jawa Timur 60241",
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
      this.logger.info("Seeding users...");

      const users = await this.createDefaultUsers();
      await this.models.User.bulkCreate(users, {
        transaction,
        individualHooks: false, // Skip model hooks since we already hashed passwords
      });

      this.logger.info(`Successfully seeded ${users.length} users`);
    } catch (error) {
      this.logger.error("Failed to seed users", { error });
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
      this.logger.info("Seeding blog data...");

      // Seed blog categories
      if (seedData.blogCategories.length > 0) {
        await this.models.BlogCategory.bulkCreate(seedData.blogCategories, {
          transaction,
        });
        this.logger.info(
          `Successfully seeded ${seedData.blogCategories.length} blog categories`
        );
      }

      // Seed blog posts
      if (seedData.blogPosts.length > 0) {
        await this.models.BlogPost.bulkCreate(seedData.blogPosts, {
          transaction,
        });
        this.logger.info(
          `Successfully seeded ${seedData.blogPosts.length} blog posts`
        );
      }
    } catch (error) {
      this.logger.error("Failed to seed blog data", { error });
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
      this.logger.info("Seeding branded products data...");

      // Seed branded categories
      if (seedData.brandedCategories.length > 0) {
        await this.models.BrandedCategory.bulkCreate(
          seedData.brandedCategories,
          {
            transaction,
          }
        );
        this.logger.info(
          `Successfully seeded ${seedData.brandedCategories.length} branded categories`
        );
      }

      // Seed branded products
      if (seedData.brandedProducts.length > 0) {
        await this.models.BrandedProduct.bulkCreate(seedData.brandedProducts, {
          transaction,
        });
        this.logger.info(
          `Successfully seeded ${seedData.brandedProducts.length} branded products`
        );
      }
    } catch (error) {
      this.logger.error("Failed to seed branded products data", { error });
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
      this.logger.info("Seeding movies data...");

      // Seed movie genres
      if (seedData.movieGenres.length > 0) {
        await this.models.MovieGenre.bulkCreate(seedData.movieGenres, {
          transaction,
        });
        this.logger.info(
          `Successfully seeded ${seedData.movieGenres.length} movie genres`
        );
      }

      // Seed movies
      if (seedData.movies.length > 0) {
        await this.models.Movie.bulkCreate(seedData.movies, { transaction });
        this.logger.info(
          `Successfully seeded ${seedData.movies.length} movies`
        );
      }
    } catch (error) {
      this.logger.error("Failed to seed movies data", { error });
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
      this.logger.info("Seeding rental data...");

      // Seed rental types
      if (seedData.rentalTypes.length > 0) {
        await this.models.RentalType.bulkCreate(seedData.rentalTypes, {
          transaction,
        });
        this.logger.info(
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
        this.logger.info(
          `Successfully seeded ${seedData.rentalTransportations.length} rental transportations`
        );
      }
    } catch (error) {
      this.logger.error("Failed to seed rental data", { error });
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
      this.logger.info("Seeding room data...");

      // Seed room types
      if (seedData.roomTypes.length > 0) {
        await this.models.RoomType.bulkCreate(seedData.roomTypes, {
          transaction,
        });
        this.logger.info(
          `Successfully seeded ${seedData.roomTypes.length} room types`
        );
      }

      // Seed room lodgings
      if (seedData.roomLodgings.length > 0) {
        await this.models.RoomLodging.bulkCreate(seedData.roomLodgings, {
          transaction,
        });
        this.logger.info(
          `Successfully seeded ${seedData.roomLodgings.length} room lodgings`
        );
      }
    } catch (error) {
      this.logger.error("Failed to seed room data", { error });
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
      this.logger.info("Seeding news data...");

      // Seed news categories
      if (seedData.newsCategories.length > 0) {
        await this.models.NewsCategory.bulkCreate(seedData.newsCategories, {
          transaction,
        });
        this.logger.info(
          `Successfully seeded ${seedData.newsCategories.length} news categories`
        );
      }

      // Seed news articles
      if (seedData.newsArticles.length > 0) {
        await this.models.NewsArticle.bulkCreate(seedData.newsArticles, {
          transaction,
        });
        this.logger.info(
          `Successfully seeded ${seedData.newsArticles.length} news articles`
        );
      }
    } catch (error) {
      this.logger.error("Failed to seed news data", { error });
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
      this.logger.info("Seeding career data...");

      // Seed career companies
      if (seedData.careerCompanies.length > 0) {
        await this.models.CareerCompany.bulkCreate(seedData.careerCompanies, {
          transaction,
        });
        this.logger.info(
          `Successfully seeded ${seedData.careerCompanies.length} career companies`
        );
      }

      // Seed career jobs
      if (seedData.careerJobs.length > 0) {
        await this.models.CareerJob.bulkCreate(seedData.careerJobs, {
          transaction,
        });
        this.logger.info(
          `Successfully seeded ${seedData.careerJobs.length} career jobs`
        );
      }
    } catch (error) {
      this.logger.error("Failed to seed career data", { error });
      throw error;
    }
  }

  /**
   * Seed anime data
   */
  private async seedAnimeData(
    seedData: SeedData,
    transaction: any
  ): Promise<void> {
    try {
      this.logger.info("Seeding anime data...");

      // Seed anime
      if (seedData.animes.length > 0) {
        await this.models.Anime.bulkCreate(seedData.animes, { transaction });
        this.logger.info(
          `Successfully seeded ${seedData.animes.length} animes`
        );
      }
    } catch (error) {
      this.logger.error("Failed to seed anime data", { error });
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
      this.logger.info("Seeding restaurant data...");

      // Seed restaurant categories
      if (seedData.restaurantCategories.length > 0) {
        await this.models.RestaurantCategory.bulkCreate(
          seedData.restaurantCategories,
          {
            transaction,
          }
        );
        this.logger.info(
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
        this.logger.info(
          `Successfully seeded ${seedData.restaurantCuisines.length} restaurant cuisines`
        );
      }
    } catch (error) {
      this.logger.error("Failed to seed restaurant data", { error });
      throw error;
    }
  }

  /**
   * Clear all data from database using destroy method
   */
  private async clearDatabase(transaction: any): Promise<void> {
    try {
      this.logger.info("Clearing existing database data...");

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

      this.logger.info("Database cleared successfully");
    } catch (error) {
      this.logger.error("Failed to clear database", { error });
      throw error;
    }
  }

  /**
   * Advanced undo functionality with options for truncate, restart identity, and cascade
   */
  public async undoSeeds(options: SeedOptions = {}): Promise<void> {
    const dbConnection = DatabaseConnection.getInstance();
    await dbConnection.connect();
    await this.initializeModels();
    const sequelize = dbConnection.getSequelize();
    const transaction = await sequelize.transaction();
    const startTime = Date.now();

    try {
      this.logger.info("Starting database undo process...", { options });

      if (options.truncate) {
        await this.truncateAllTables(transaction, options);
      } else {
        // Use regular destroy method
        await this.clearDatabase(transaction);
      }

      await transaction.commit();

      const duration = Date.now() - startTime;
      this.logger.info("Database undo completed successfully", {
        duration: `${duration}ms`,
        options,
      });
    } catch (error) {
      await transaction.rollback();
      const duration = Date.now() - startTime;
      this.logger.error("Database undo failed", {
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
      this.logger.info("Truncating all tables...", { options });

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
            this.logger.info(`Truncating table: ${tableName}`);
            await sequelize.query(sql, { transaction });
            this.logger.info(`Successfully truncated: ${tableName}`);
          } catch (error) {
            this.logger.warn(`Failed to truncate ${tableName}:`, {
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
          this.logger.info("Truncating all tables with CASCADE");
          await sequelize.query(sql, { transaction });
          this.logger.info("Successfully truncated all tables");
        } catch (error) {
          this.logger.warn(
            "CASCADE truncation failed, falling back to individual truncation"
          );
          // Fallback to individual truncation
          for (const tableName of tableOrder) {
            try {
              const sql = `TRUNCATE TABLE ${tableName}${optionsString};`;
              await sequelize.query(sql, { transaction });
              this.logger.info(`Fallback truncated: ${tableName}`);
            } catch (innerError) {
              this.logger.warn(`Fallback truncation failed for ${tableName}:`, {
                error:
                  innerError instanceof Error ? innerError.message : innerError,
              });
            }
          }
        }
      }

      this.logger.info("Table truncation completed");
    } catch (error) {
      this.logger.error("Failed to truncate tables", { error });
      throw error;
    }
  }

  /**
   * Quick truncate method using Sequelize's built-in truncate
   */
  public async quickTruncate(options: SeedOptions = {}): Promise<void> {
    const dbConnection = DatabaseConnection.getInstance();
    await dbConnection.connect();
    await this.initializeModels();
    const sequelize = dbConnection.getSequelize();
    const transaction = await sequelize.transaction();
    const startTime = Date.now();

    try {
      this.logger.info("Starting quick truncate process...", { options });

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
          this.logger.info(`Quick truncated: ${model.name}`);
        } catch (error) {
          this.logger.warn(`Quick truncate failed for ${model.name}:`, {
            error: error instanceof Error ? error.message : error,
          });
        }
      }

      await transaction.commit();

      const duration = Date.now() - startTime;
      this.logger.info("Quick truncate completed successfully", {
        duration: `${duration}ms`,
        options,
      });
    } catch (error) {
      await transaction.rollback();
      const duration = Date.now() - startTime;
      this.logger.error("Quick truncate failed", {
        error: error instanceof Error ? error.message : error,
        duration: `${duration}ms`,
        options,
      });
      throw error;
    }
  }

  /**
   * Seed the database with data
   * @param clearFirst - Whether to clear existing data first
   */
  public async seed(clearFirst: boolean = false): Promise<void> {
    const dbConnection = DatabaseConnection.getInstance();
    await dbConnection.connect();
    await this.initializeModels();
    const sequelize = dbConnection.getSequelize();
    const transaction = await sequelize.transaction();
    const startTime = Date.now();

    try {
      this.logger.info("Starting database seeding process...");

      // Clear database if requested
      if (clearFirst) {
        this.logger.info("Clearing database...");
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
      await this.seedAnimeData(seedData, transaction);

      // Commit transaction
      await transaction.commit();

      const duration = Date.now() - startTime;
      this.logger.info("Database seeding completed successfully", {
        duration: `${duration}ms`,
      });
    } catch (error) {
      await transaction.rollback();
      const duration = Date.now() - startTime;
      this.logger.error("Database seeding failed", {
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
        this.logger.info("Database connection test successful");
      }
      return result;
    } catch (error) {
      this.logger.error("Database connection test failed", { error });
      return false;
    }
  }
}
