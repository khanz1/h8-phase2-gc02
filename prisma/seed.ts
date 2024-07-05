import { faker } from "@faker-js/faker";
import type {
  Blog_Category,
  Blog_Post,
  Branded_Category,
  Branded_Product,
  Career_Company,
  Career_Job,
  Movie_Genre,
  Movie_Movie,
  News_Article,
  News_Category,
  Rental_Transportation,
  Rental_Type,
  Restaurant_Category,
  Restaurant_Cuisine,
  Room_Lodging,
  Room_Type,
  User,
} from "@prisma/client";
import { PrismaClient } from "@prisma/client";
import { hashText } from "../src/utils/bcrypt";

// Core
const createObjUsers = (idx: number) => ({
  username: faker.internet.userName().toLowerCase(),
  email: faker.internet.email().toLowerCase(),
  password: hashText("123456"),
  phoneNumber: faker.phone.number(),
  address: faker.location.streetAddress(),
  role: Math.random() > 0.5 ? "Staff" : "Admin",
  createdAt: new Date(),
  updatedAt: new Date(),
});

let dataUsers: Omit<User, "id">[] = [
  {
    username: "admin",
    email: "admin@mail.com",
    password: hashText("123456"),
    phoneNumber: faker.phone.number(),
    address: faker.location.streetAddress(),
    role: "Admin",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    username: "staff",
    email: "staff@mail.com",
    password: hashText("123456"),
    phoneNumber: faker.phone.number(),
    address: faker.location.streetAddress(),
    role: "Staff",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

// Blog
const createObjBlogCategory = (idx: number) => ({
  name: faker.lorem.word(),
  createdAt: new Date(),
  updatedAt: new Date(),
});

const createObjBlogPost = (idx: number) => ({
  title: faker.lorem.sentence(),
  content: faker.lorem.paragraph(),
  imgUrl: faker.image.url({ width: 100, height: 100 }),
  categoryId: Math.floor(Math.random() * 10) + 1,
  authorId: Math.floor(Math.random() * 10) + 1,
  createdAt: new Date(),
  updatedAt: new Date(),
});

let dataBlogCategory: Omit<Blog_Category, "id">[] = [];
let dataBlogPost: Omit<Blog_Post, "id">[] = [];

// Branded
const createObjBrandedCategory = (idx: number) => ({
  name: faker.lorem.word(),
  createdAt: new Date(),
  updatedAt: new Date(),
});

const createObjBrandedProduct = (idx: number) => ({
  name: faker.lorem.word(),
  description: faker.lorem.paragraph(),
  price: faker.number.int({ min: 1000, max: 1000000 }),
  stock: faker.number.int({ min: 1, max: 100 }),
  imgUrl: faker.image.url({ width: 100, height: 100 }),
  categoryId: Math.floor(Math.random() * 10) + 1,
  authorId: Math.floor(Math.random() * 10) + 1,
  createdAt: new Date(),
  updatedAt: new Date(),
});

let dataBrandedCategory: Omit<Branded_Category, "id">[] = [];
let dataBrandedProduct: Omit<Branded_Product, "id">[] = [];

// Movie
const createObjMovieGenre = (idx: number) => ({
  name: faker.lorem.word(),
  createdAt: new Date(),
  updatedAt: new Date(),
});

const createObjMovieMovie = (idx: number) => ({
  title: faker.lorem.sentence(),
  synopsis: faker.lorem.paragraph(),
  trailerUrl: faker.image.url({ width: 100, height: 100 }),
  imgUrl: faker.image.url({ width: 100, height: 100 }),
  rating: faker.number.int({ min: 1, max: 10 }),
  genreId: Math.floor(Math.random() * 10) + 1,
  authorId: Math.floor(Math.random() * 10) + 1,
  createdAt: new Date(),
  updatedAt: new Date(),
});

let dataMovieGenre: Omit<Movie_Genre, "id">[] = [];
let dataMovieMovie: Omit<Movie_Movie, "id">[] = [];

// Rental Transportation
const createObjRentalType = (idx: number) => ({
  name: faker.lorem.word(),
  createdAt: new Date(),
  updatedAt: new Date(),
});

const createObjRentalTransportation = (idx: number) => ({
  name: faker.lorem.word(),
  description: faker.lorem.paragraph(),
  imgUrl: faker.image.url({ width: 100, height: 100 }),
  location: faker.location.city(),
  price: faker.number.int({ min: 1000, max: 1000000 }),
  typeId: Math.floor(Math.random() * 10) + 1,
  authorId: Math.floor(Math.random() * 10) + 1,
  createdAt: new Date(),
  updatedAt: new Date(),
});

let dataRentalType: Omit<Rental_Type, "id">[] = [];
let dataRentalTransportation: Omit<Rental_Transportation, "id">[] = [];

// Rent Room
const createObjRoomType = (idx: number) => ({
  name: faker.lorem.word(),
  createdAt: new Date(),
  updatedAt: new Date(),
});

const createObjRoomLodging = (idx: number) => ({
  name: faker.lorem.word(),
  facility: faker.lorem.paragraph(),
  roomCapacity: faker.number.int({ min: 1, max: 10 }),
  imgUrl: faker.image.url({ width: 100, height: 100 }),
  location: faker.location.city(),
  typeId: Math.floor(Math.random() * 10) + 1,
  authorId: Math.floor(Math.random() * 10) + 1,
  createdAt: new Date(),
  updatedAt: new Date(),
});

let dataRoomType: Omit<Room_Type, "id">[] = [];
let dataRoomLodging: Omit<Room_Lodging, "id">[] = [];

// News Portal
const createObjNewsCategory = (idx: number) => ({
  name: faker.lorem.word(),
  createdAt: new Date(),
  updatedAt: new Date(),
});

const createObjNewsArticle = (idx: number) => ({
  title: faker.lorem.sentence(),
  content: faker.lorem.paragraph(),
  imgUrl: faker.image.url({ width: 100, height: 100 }),
  categoryId: Math.floor(Math.random() * 10) + 1,
  authorId: Math.floor(Math.random() * 10) + 1,
  createdAt: new Date(),
  updatedAt: new Date(),
});

let dataNewsCategory: Omit<News_Category, "id">[] = [];
let dataNewsArticle: Omit<News_Article, "id">[] = [];

// Career Portal
const createObjCareerCompany = (idx: number) => ({
  name: faker.lorem.word(),
  companyLogo: faker.image.url({ width: 100, height: 100 }),
  location: faker.location.city(),
  email: faker.internet.email().toLowerCase(),
  description: faker.lorem.paragraph(),
  createdAt: new Date(),
  updatedAt: new Date(),
});

const createObjCareerJob = (idx: number) => ({
  title: faker.lorem.sentence(),
  description: faker.lorem.paragraph(),
  imgUrl: faker.image.url({ width: 100, height: 100 }),
  jobType: faker.lorem.word(),
  companyId: Math.floor(Math.random() * 10) + 1,
  authorId: Math.floor(Math.random() * 10) + 1,
  createdAt: new Date(),
  updatedAt: new Date(),
});

let dataCareerCompany: Omit<Career_Company, "id">[] = [];
let dataCareerJob: Omit<Career_Job, "id">[] = [];

// Restaurant
const createObjRestaurantCategory = (idx: number) => ({
  name: faker.lorem.word(),
  createdAt: new Date(),
  updatedAt: new Date(),
});

const createObjRestaurantCuisine = (idx: number) => ({
  name: faker.lorem.word(),
  description: faker.lorem.paragraph(),
  price: faker.number.int({ min: 1000, max: 1000000 }),
  imgUrl: faker.image.url({ width: 100, height: 100 }),
  categoryId: Math.floor(Math.random() * 10) + 1,
  authorId: Math.floor(Math.random() * 10) + 1,
  createdAt: new Date(),
  updatedAt: new Date(),
});

let dataRestaurantCategory: Omit<Restaurant_Category, "id">[] = [];
let dataRestaurantCuisine: Omit<Restaurant_Cuisine, "id">[] = [];

// loop 10 times
for (let i = 0; i < 10; i++) {
  dataUsers.push(createObjUsers(i + 1));
  dataBlogCategory.push(createObjBlogCategory(i + 1));
  dataBrandedCategory.push(createObjBrandedCategory(i + 1));
  dataMovieGenre.push(createObjMovieGenre(i + 1));
  dataRentalType.push(createObjRentalType(i + 1));
  dataRoomType.push(createObjRoomType(i + 1));
  dataNewsCategory.push(createObjNewsCategory(i + 1));
  dataCareerCompany.push(createObjCareerCompany(i + 1));
  dataRestaurantCategory.push(createObjRestaurantCategory(i + 1));
}

// Loop 100 times
for (let i = 0; i < 100; i++) {
  dataBlogPost.push(createObjBlogPost(i + 1));
  dataBrandedProduct.push(createObjBrandedProduct(i + 1));
  dataMovieMovie.push(createObjMovieMovie(i + 1));
  dataRentalTransportation.push(createObjRentalTransportation(i + 1));
  dataRoomLodging.push(createObjRoomLodging(i + 1));
  dataNewsArticle.push(createObjNewsArticle(i + 1));
  dataCareerJob.push(createObjCareerJob(i + 1));
  dataRestaurantCuisine.push(createObjRestaurantCuisine(i + 1));
}

const prisma = new PrismaClient();

async function main() {
  await prisma.user.createMany({
    data: dataUsers,
  });

  await prisma.blog_Category.createMany({
    data: dataBlogCategory,
  });

  await prisma.blog_Post.createMany({
    data: dataBlogPost,
  });

  await prisma.branded_Category.createMany({
    data: dataBrandedCategory,
  });

  await prisma.branded_Product.createMany({
    data: dataBrandedProduct,
  });

  await prisma.movie_Genre.createMany({
    data: dataMovieGenre,
  });

  await prisma.movie_Movie.createMany({
    data: dataMovieMovie,
  });

  await prisma.rental_Type.createMany({
    data: dataRentalType,
  });

  await prisma.rental_Transportation.createMany({
    data: dataRentalTransportation,
  });

  await prisma.room_Type.createMany({
    data: dataRoomType,
  });

  await prisma.room_Lodging.createMany({
    data: dataRoomLodging,
  });

  await prisma.news_Category.createMany({
    data: dataNewsCategory,
  });

  await prisma.news_Article.createMany({
    data: dataNewsArticle,
  });

  await prisma.career_Company.createMany({
    data: dataCareerCompany,
  });

  await prisma.career_Job.createMany({
    data: dataCareerJob,
  });

  await prisma.restaurant_Category.createMany({
    data: dataRestaurantCategory,
  });

  await prisma.restaurant_Cuisine.createMany({
    data: dataRestaurantCuisine,
  });
}

main();
