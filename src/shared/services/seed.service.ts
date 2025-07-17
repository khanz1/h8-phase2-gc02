import "dotenv/config";
import { Logger } from "@/config/logger";
import { DatabaseConnection } from "@/config/database";
import { BcryptHelper } from "@/shared/utils/bcrypt.helper";
import * as fs from "fs";
import * as path from "path";

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

  /**
   * Add delay between operations to ensure different createdAt timestamps
   */
  private async delay(ms: number = 10): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private async initializeModels(): Promise<void> {
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
      seedData.blogCategories = this.readJsonFile(
        path.join(this.dataDirectory, "blog", "categories.json")
      );
      seedData.blogPosts = this.readJsonFile(
        path.join(this.dataDirectory, "blog", "posts.json")
      );

      seedData.brandedCategories = this.readJsonFile(
        path.join(this.dataDirectory, "branded", "categories.json")
      );
      seedData.brandedProducts = this.readJsonFile(
        path.join(this.dataDirectory, "branded", "products.json")
      );

      seedData.careerCompanies = this.readJsonFile(
        path.join(this.dataDirectory, "career", "companies.json")
      );
      seedData.careerJobs = this.readJsonFile(
        path.join(this.dataDirectory, "career", "jobs.json")
      );

      seedData.movieGenres = this.readJsonFile(
        path.join(this.dataDirectory, "movies", "genres.json")
      );
      seedData.movies = this.readJsonFile(
        path.join(this.dataDirectory, "movies", "movies.json")
      );

      seedData.newsCategories = this.readJsonFile(
        path.join(this.dataDirectory, "news", "categories.json")
      );
      seedData.newsArticles = this.readJsonFile(
        path.join(this.dataDirectory, "news", "articles.json")
      );

      seedData.rentalTypes = this.readJsonFile(
        path.join(this.dataDirectory, "rental", "types.json")
      );
      seedData.rentalTransportations = this.readJsonFile(
        path.join(this.dataDirectory, "rental", "transportations.json")
      );

      seedData.restaurantCategories = this.readJsonFile(
        path.join(this.dataDirectory, "restaurant", "categories.json")
      );
      seedData.restaurantCuisines = this.readJsonFile(
        path.join(this.dataDirectory, "restaurant", "cuisines.json")
      );

      seedData.roomTypes = this.readJsonFile(
        path.join(this.dataDirectory, "room", "types.json")
      );
      seedData.roomLodgings = this.readJsonFile(
        path.join(this.dataDirectory, "room", "lodgings.json")
      );

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
      for (const user of users) {
        await this.models.User.create(user, { transaction });
        await this.delay();
      }

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

      if (seedData.blogCategories.length > 0) {
        for (const category of seedData.blogCategories) {
          await this.models.BlogCategory.create(category, { transaction });
          await this.delay();
        }
        this.logger.info(
          `Successfully seeded ${seedData.blogCategories.length} blog categories`
        );
      }

      if (seedData.blogPosts.length > 0) {
        for (const post of seedData.blogPosts) {
          await this.models.BlogPost.create(post, { transaction });
          await this.delay();
        }
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

      if (seedData.brandedCategories.length > 0) {
        for (const category of seedData.brandedCategories) {
          await this.models.BrandedCategory.create(category, { transaction });
          await this.delay();
        }
        this.logger.info(
          `Successfully seeded ${seedData.brandedCategories.length} branded categories`
        );
      }

      if (seedData.brandedProducts.length > 0) {
        for (const product of seedData.brandedProducts) {
          await this.models.BrandedProduct.create(product, { transaction });
          await this.delay();
        }
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

      if (seedData.movieGenres.length > 0) {
        for (const genre of seedData.movieGenres) {
          await this.models.MovieGenre.create(genre, { transaction });
          await this.delay();
        }
        this.logger.info(
          `Successfully seeded ${seedData.movieGenres.length} movie genres`
        );
      }

      if (seedData.movies.length > 0) {
        for (const movie of seedData.movies) {
          await this.models.Movie.create(movie, { transaction });
          await this.delay();
        }
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

      if (seedData.rentalTypes.length > 0) {
        for (const type of seedData.rentalTypes) {
          await this.models.RentalType.create(type, { transaction });
          await this.delay();
        }
        this.logger.info(
          `Successfully seeded ${seedData.rentalTypes.length} rental types`
        );
      }

      if (seedData.rentalTransportations.length > 0) {
        for (const transport of seedData.rentalTransportations) {
          await this.models.RentalTransportation.create(transport, {
            transaction,
          });
          await this.delay();
        }
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

      if (seedData.roomTypes.length > 0) {
        for (const type of seedData.roomTypes) {
          await this.models.RoomType.create(type, { transaction });
          await this.delay();
        }
        this.logger.info(
          `Successfully seeded ${seedData.roomTypes.length} room types`
        );
      }

      if (seedData.roomLodgings.length > 0) {
        for (const lodging of seedData.roomLodgings) {
          await this.models.RoomLodging.create(lodging, { transaction });
          await this.delay();
        }
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

      if (seedData.newsCategories.length > 0) {
        for (const category of seedData.newsCategories) {
          await this.models.NewsCategory.create(category, { transaction });
          await this.delay();
        }
        this.logger.info(
          `Successfully seeded ${seedData.newsCategories.length} news categories`
        );
      }

      if (seedData.newsArticles.length > 0) {
        for (const article of seedData.newsArticles) {
          await this.models.NewsArticle.create(article, { transaction });
          await this.delay();
        }
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

      if (seedData.careerCompanies.length > 0) {
        for (const company of seedData.careerCompanies) {
          await this.models.CareerCompany.create(company, { transaction });
          await this.delay();
        }
        this.logger.info(
          `Successfully seeded ${seedData.careerCompanies.length} career companies`
        );
      }

      if (seedData.careerJobs.length > 0) {
        for (const job of seedData.careerJobs) {
          await this.models.CareerJob.create(job, { transaction });
          await this.delay();
        }
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

      if (seedData.animes.length > 0) {
        for (const anime of seedData.animes) {
          await this.models.Anime.create(anime, { transaction });
          await this.delay();
        }
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

      if (seedData.restaurantCategories.length > 0) {
        for (const category of seedData.restaurantCategories) {
          await this.models.RestaurantCategory.create(category, {
            transaction,
          });
          await this.delay();
        }
        this.logger.info(
          `Successfully seeded ${seedData.restaurantCategories.length} restaurant categories`
        );
      }

      if (seedData.restaurantCuisines.length > 0) {
        for (const cuisine of seedData.restaurantCuisines) {
          await this.models.RestaurantCuisine.create(cuisine, {
            transaction,
          });
          await this.delay();
        }
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

      const dbConnection = DatabaseConnection.getInstance();
      const sequelize = dbConnection.getSequelize();

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

      const truncateOptions: string[] = [];
      if (options.restartIdentity) {
        truncateOptions.push("RESTART IDENTITY");
      }
      if (options.cascade) {
        truncateOptions.push("CASCADE");
      }

      const optionsString =
        truncateOptions.length > 0 ? ` ${truncateOptions.join(" ")}` : "";

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
          }
        }
      } else {
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

      if (clearFirst) {
        this.logger.info("Clearing database...");
        await this.clearDatabase(transaction);
      }

      const seedData = this.loadSeedData();

      await this.seedUsers(transaction);

      await this.seedBlogData(seedData, transaction);
      await this.seedBrandedData(seedData, transaction);
      await this.seedMoviesData(seedData, transaction);
      await this.seedRentalData(seedData, transaction);
      await this.seedRoomData(seedData, transaction);
      await this.seedNewsData(seedData, transaction);
      await this.seedCareerData(seedData, transaction);
      await this.seedRestaurantData(seedData, transaction);
      await this.seedAnimeData(seedData, transaction);

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
