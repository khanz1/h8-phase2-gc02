import { Sequelize } from "sequelize";

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

export { BaseModel } from "./BaseModel";

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

export function initializeModels(sequelize: Sequelize): void {
  User.initialize(sequelize);

  BlogCategory.initialize(sequelize);
  BlogPost.initialize(sequelize);

  BrandedCategory.initialize(sequelize);
  BrandedProduct.initialize(sequelize);

  MovieGenre.initialize(sequelize);
  Movie.initialize(sequelize);

  RentalType.initialize(sequelize);
  RentalTransportation.initialize(sequelize);

  RoomType.initialize(sequelize);
  RoomLodging.initialize(sequelize);

  NewsCategory.initialize(sequelize);
  NewsArticle.initialize(sequelize);

  CareerCompany.initialize(sequelize);
  CareerJob.initialize(sequelize);

  RestaurantCategory.initialize(sequelize);
  RestaurantCuisine.initialize(sequelize);

  Anime.initialize(sequelize);
}

export function associateModels(): void {
  User.associate();

  BlogCategory.associate();
  BlogPost.associate();

  BrandedCategory.associate();
  BrandedProduct.associate();

  MovieGenre.associate();
  Movie.associate();

  RentalType.associate();
  RentalTransportation.associate();

  RoomType.associate();
  RoomLodging.associate();

  NewsCategory.associate();
  NewsArticle.associate();

  CareerCompany.associate();
  CareerJob.associate();

  RestaurantCategory.associate();
  RestaurantCuisine.associate();

  Anime.associate();
}
