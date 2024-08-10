import { faker } from "@faker-js/faker";
import {
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
  PrismaClient,
  Rental_Transportation,
  Rental_Type,
  Restaurant_Category,
  Restaurant_Cuisine,
  Room_Lodging,
  Room_Type,
  User,
  UserRole,
} from "@prisma/client";
import { hashText } from "../src/utils/bcrypt";

// Core
const createObjUsers = () => ({
  username: faker.internet.userName().toLowerCase(),
  email: faker.internet.email().toLowerCase(),
  password: hashText("123456"),
  phoneNumber: faker.phone.number(),
  address: faker.location.streetAddress(),
  role: Math.random() > 0.5 ? UserRole.Staff : UserRole.Admin,
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
    role: UserRole.Admin,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    username: "staff",
    email: "staff@mail.com",
    password: hashText("123456"),
    phoneNumber: faker.phone.number(),
    address: faker.location.streetAddress(),
    role: UserRole.Staff,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

// Blog
const createObjBlogCategory = () => ({
  name: faker.lorem.word(),
  createdAt: new Date(),
  updatedAt: new Date(),
});

const createObjBlogPost = () => ({
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
const createObjBrandedCategory = () => ({
  name: faker.lorem.word(),
  createdAt: new Date(),
  updatedAt: new Date(),
});

const createObjBrandedProduct = () => ({
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
const createObjMovieGenre = () => ({
  name: faker.lorem.word(),
  createdAt: new Date(),
  updatedAt: new Date(),
});

const createObjMovieMovie = () => ({
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
const createObjRentalType = () => ({
  name: faker.lorem.word(),
  createdAt: new Date(),
  updatedAt: new Date(),
});

const createObjRentalTransportation = () => ({
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
const createObjRoomType = () => ({
  name: faker.lorem.word(),
  createdAt: new Date(),
  updatedAt: new Date(),
});

const createObjRoomLodging = () => ({
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
const createObjNewsCategory = () => ({
  name: faker.lorem.word(),
  createdAt: new Date(),
  updatedAt: new Date(),
});

const createObjNewsArticle = () => ({
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
const createObjCareerCompany = () => ({
  name: faker.lorem.word(),
  companyLogo: faker.image.url({ width: 100, height: 100 }),
  location: faker.location.city(),
  email: faker.internet.email().toLowerCase(),
  description: faker.lorem.paragraph(),
  createdAt: new Date(),
  updatedAt: new Date(),
});

const createObjCareerJob = () => ({
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
const createObjRestaurantCategory = () => ({
  name: faker.lorem.word(),
  createdAt: new Date(),
  updatedAt: new Date(),
});

const createObjRestaurantCuisine = () => ({
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
  dataUsers.push(createObjUsers());
  dataBlogCategory.push(createObjBlogCategory());
  dataBrandedCategory.push(createObjBrandedCategory());
  dataMovieGenre.push(createObjMovieGenre());
  dataRentalType.push(createObjRentalType());
  dataRoomType.push(createObjRoomType());
  dataNewsCategory.push(createObjNewsCategory());
  dataCareerCompany.push(createObjCareerCompany());
  dataRestaurantCategory.push(createObjRestaurantCategory());
}

// Loop 100 times
for (let i = 0; i < 100; i++) {
  dataBlogPost.push(createObjBlogPost());
  dataBrandedProduct.push(createObjBrandedProduct());
  dataMovieMovie.push(createObjMovieMovie());
  dataRentalTransportation.push(createObjRentalTransportation());
  dataRoomLodging.push(createObjRoomLodging());
  dataNewsArticle.push(createObjNewsArticle());
  dataCareerJob.push(createObjCareerJob());
  dataRestaurantCuisine.push(createObjRestaurantCuisine());
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
