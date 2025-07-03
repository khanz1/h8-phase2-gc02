import { Sequelize } from "sequelize";

// Base model
export { BaseModel } from "./BaseModel";

// Core models
export { User } from "@/features/users/user.model";

// Blog models
export { BlogCategory, BlogPost } from "@/features/blog/blog.model";

// Branded Products models
export {
  BrandedCategory,
  BrandedProduct,
} from "@/features/products/product.model";

// Movie models
export { MovieGenre, Movie } from "@/features/movies/movie.model";

// Rental models
export {
  RentalType,
  RentalTransportation,
} from "@/features/rentals/rental.model";

// Room models
export { RoomType, RoomLodging } from "@/features/rooms/room.model";

// News models
export { NewsCategory, NewsArticle } from "@/features/news/news.model";

// Career models
export { CareerCompany, CareerJob } from "@/features/careers/career.model";

// Restaurant models
export {
  RestaurantCategory,
  RestaurantCuisine,
} from "@/features/restaurants/restaurant.model";

// Lecture models
export { Anime } from "@/features/lecture/lecture.model";

// Model initialization function
export function initializeModels(sequelize: Sequelize): void {
  // Import all models
  const { User } = require("@/features/users/user.model");
  const { BlogCategory, BlogPost } = require("@/features/blog/blog.model");
  const {
    BrandedCategory,
    BrandedProduct,
  } = require("@/features/products/product.model");
  const { MovieGenre, Movie } = require("@/features/movies/movie.model");
  const {
    RentalType,
    RentalTransportation,
  } = require("@/features/rentals/rental.model");
  const { RoomType, RoomLodging } = require("@/features/rooms/room.model");
  const { NewsCategory, NewsArticle } = require("@/features/news/news.model");
  const {
    CareerCompany,
    CareerJob,
  } = require("@/features/careers/career.model");
  const {
    RestaurantCategory,
    RestaurantCuisine,
  } = require("@/features/restaurants/restaurant.model");
  const { Anime } = require("@/features/lecture/lecture.model");

  // Initialize all models
  User.initialize(sequelize);

  // Blog models
  BlogCategory.initialize(sequelize);
  BlogPost.initialize(sequelize);

  // Branded Products models
  BrandedCategory.initialize(sequelize);
  BrandedProduct.initialize(sequelize);

  // Movie models
  MovieGenre.initialize(sequelize);
  Movie.initialize(sequelize);

  // Rental models
  RentalType.initialize(sequelize);
  RentalTransportation.initialize(sequelize);

  // Room models
  RoomType.initialize(sequelize);
  RoomLodging.initialize(sequelize);

  // News models
  NewsCategory.initialize(sequelize);
  NewsArticle.initialize(sequelize);

  // Career models
  CareerCompany.initialize(sequelize);
  CareerJob.initialize(sequelize);

  // Restaurant models
  RestaurantCategory.initialize(sequelize);
  RestaurantCuisine.initialize(sequelize);

  // Lecture models
  Anime.initialize(sequelize);
}

// Model associations function
export function associateModels(): void {
  // Import all models
  const { User } = require("@/features/users/user.model");
  const { BlogCategory, BlogPost } = require("@/features/blog/blog.model");
  const {
    BrandedCategory,
    BrandedProduct,
  } = require("@/features/products/product.model");
  const { MovieGenre, Movie } = require("@/features/movies/movie.model");
  const {
    RentalType,
    RentalTransportation,
  } = require("@/features/rentals/rental.model");
  const { RoomType, RoomLodging } = require("@/features/rooms/room.model");
  const { NewsCategory, NewsArticle } = require("@/features/news/news.model");
  const {
    CareerCompany,
    CareerJob,
  } = require("@/features/careers/career.model");
  const {
    RestaurantCategory,
    RestaurantCuisine,
  } = require("@/features/restaurants/restaurant.model");
  const { Anime } = require("@/features/lecture/lecture.model");

  // Set up all associations
  User.associate();

  // Blog associations
  BlogCategory.associate();
  BlogPost.associate();

  // Branded Products associations
  BrandedCategory.associate();
  BrandedProduct.associate();

  // Movie associations
  MovieGenre.associate();
  Movie.associate();

  // Rental associations
  RentalType.associate();
  RentalTransportation.associate();

  // Room associations
  RoomType.associate();
  RoomLodging.associate();

  // News associations
  NewsCategory.associate();
  NewsArticle.associate();

  // Career associations
  CareerCompany.associate();
  CareerJob.associate();

  // Restaurant associations
  RestaurantCategory.associate();
  RestaurantCuisine.associate();

  // Lecture associations
  Anime.associate();
}
