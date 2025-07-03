import { Sequelize } from "sequelize";

// Direct imports for function usage
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

// Base model
export { BaseModel } from "./BaseModel";

// Re-exports for external usage
export { User } from "@/features/users/user.model";
export { BlogCategory, BlogPost } from "@/features/blog/blog.model";
export {
  BrandedCategory,
  BrandedProduct,
} from "@/features/products/product.model";
export { MovieGenre, Movie } from "@/features/movies/movie.model";
export {
  RentalType,
  RentalTransportation,
} from "@/features/rentals/rental.model";
export { RoomType, RoomLodging } from "@/features/rooms/room.model";
export { NewsCategory, NewsArticle } from "@/features/news/news.model";
export { CareerCompany, CareerJob } from "@/features/careers/career.model";
export {
  RestaurantCategory,
  RestaurantCuisine,
} from "@/features/restaurants/restaurant.model";
export { Anime } from "@/features/lecture/lecture.model";

// Model initialization function
export function initializeModels(sequelize: Sequelize): void {
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
