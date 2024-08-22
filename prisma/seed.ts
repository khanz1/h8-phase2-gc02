import { faker } from "@faker-js/faker";
import {
  Blog_Category,
  Blog_Post,
  Branded_Category,
  Branded_Product,
  Career_Company,
  Career_Job,
  Lecture_Movie,
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
  UserRole
} from "@prisma/client";
import fs from "fs/promises";
import * as path from "path";
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

// loop 10 times
for (let i = 0; i < 8; i++) {
  dataUsers.push(createObjUsers());
}

const prisma = new PrismaClient();

const readFileAndParse = async <T>(filePath: string): Promise<T> => {
  const absoluteFilePath = path.join(__dirname, filePath);
  const file = await fs.readFile(absoluteFilePath, "utf-8");
  return JSON.parse(file);
};

const seedUsers = async () => {
  await prisma.user.createMany({
    data: dataUsers,
  });
}

async function seedBlog() {
  const blogCategories = await readFileAndParse<Pick<Blog_Category, "name">[]>(
    "./data/blog/categories.json",
  );
  const blogPosts = await readFileAndParse<Omit<Blog_Post, "id">[]>(
    "./data/blog/posts.json",
  );

  await prisma.blog_Category.createMany({
    data: blogCategories,
  });

  await prisma.blog_Post.createMany({
    data: blogPosts,
  });
}

async function seedBranded() {
  const brandedCategories = await readFileAndParse<
    Pick<Branded_Category, "name">[]
  >("./data/branded/categories.json");
  const brandedProducts = await readFileAndParse<Omit<Branded_Product, "id">[]>(
    "./data/branded/products.json",
  );

  await prisma.branded_Category.createMany({
    data: brandedCategories,
  });

  await prisma.branded_Product.createMany({
    data: brandedProducts,
  });
}

async function seedMovies() {
  const movieGenres = await readFileAndParse<Pick<Movie_Genre, "name">[]>(
    "./data/movies/genres.json",
  );
  const movieMovies = await readFileAndParse<Omit<Movie_Movie, "id">[]>(
    "./data/movies/movies.json",
  );

  await prisma.movie_Genre.createMany({
    data: movieGenres,
  });

  await prisma.movie_Movie.createMany({
    data: movieMovies,
  });
}

async function seedRental() {
  const rentalTypes = await readFileAndParse<Pick<Rental_Type, "name">[]>(
    "./data/rental/types.json",
  );
  const rentalTransportations = await readFileAndParse<
    Omit<Rental_Transportation, "id">[]
  >("./data/rental/transportations.json");

  await prisma.rental_Type.createMany({
    data: rentalTypes,
  });

  await prisma.rental_Transportation.createMany({
    data: rentalTransportations,
  });
}

async function seedRoom() {
  const roomTypes = await readFileAndParse<Pick<Room_Type, "name">[]>(
    "./data/room/types.json",
  );
  const roomLodgings = await readFileAndParse<Omit<Room_Lodging, "id">[]>(
    "./data/room/lodgings.json",
  );

  await prisma.room_Type.createMany({
    data: roomTypes,
  });

  await prisma.room_Lodging.createMany({
    data: roomLodgings,
  });
}

async function seedNews() {
  const newsCategories = await readFileAndParse<Pick<News_Category, "name">[]>(
    "./data/news/categories.json",
  );
  const newsArticles = await readFileAndParse<Omit<News_Article, "id">[]>(
    "./data/news/articles.json",
  );

  await prisma.news_Category.createMany({
    data: newsCategories,
  });

  await prisma.news_Article.createMany({
    data: newsArticles,
  });
}

async function seedCareer() {
  const careerCompanies = await readFileAndParse<Omit<Career_Company, "id">[]>(
    "./data/career/companies.json",
  );
  const careerJobs = await readFileAndParse<Omit<Career_Job, "id">[]>(
    "./data/career/jobs.json",
  );

  await prisma.career_Company.createMany({
    data: careerCompanies,
  });

  await prisma.career_Job.createMany({
    data: careerJobs,
  });
}

async function seedRestaurant() {
  const restaurantCategories = await readFileAndParse<
    Pick<Restaurant_Category, "name">[]
  >("./data/restaurant/categories.json");
  const restaurantCuisines = await readFileAndParse<
    Omit<Restaurant_Cuisine, "id">[]
  >("./data/restaurant/cuisines.json");

  await prisma.restaurant_Category.createMany({
    data: restaurantCategories,
  });

  await prisma.restaurant_Cuisine.createMany({
    data: restaurantCuisines,
  });
}

async function seedLectureMovies() {
  const lectureMovies = await readFileAndParse<Omit<Lecture_Movie, 'id' | 'createdAt' | 'updatedAt'>>("./data/lectures/movies.json");
  await prisma.lecture_Movie.createMany({
    data: lectureMovies,
  });
}


async function main() {
  // await seedUsers();
  // await seedBlog();
  // await seedBranded();
  // await seedMovies();
  // await seedRental();
  // await seedRoom();
  // await seedNews();
  // await seedCareer();
  // await seedRestaurant();
  await seedLectureMovies();
}

void main();
