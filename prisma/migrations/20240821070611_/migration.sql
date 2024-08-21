-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('Admin', 'Staff');

-- CreateTable
CREATE TABLE "Users" (
    "id" SERIAL NOT NULL,
    "username" TEXT,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'Staff',
    "phoneNumber" TEXT,
    "address" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Blog_Categories" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Blog_Categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Blog_Posts" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "imgUrl" TEXT,
    "categoryId" INTEGER NOT NULL,
    "authorId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Blog_Posts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Branded_Categories" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Branded_Categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Branded_Products" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "stock" INTEGER,
    "imgUrl" TEXT,
    "categoryId" INTEGER NOT NULL,
    "authorId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Branded_Products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Movie_Genres" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Movie_Genres_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Movie_Movies" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "synopsis" TEXT NOT NULL,
    "trailerUrl" TEXT,
    "imgUrl" TEXT,
    "rating" INTEGER NOT NULL,
    "genreId" INTEGER NOT NULL,
    "authorId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Movie_Movies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Rental_Types" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Rental_Types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Rental_Transportations" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "imgUrl" TEXT,
    "location" TEXT,
    "price" INTEGER NOT NULL,
    "typeId" INTEGER NOT NULL,
    "authorId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Rental_Transportations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Room_Types" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Room_Types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Room_Lodgings" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "facility" TEXT NOT NULL,
    "roomCapacity" INTEGER NOT NULL,
    "imgUrl" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "typeId" INTEGER NOT NULL,
    "authorId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Room_Lodgings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "News_Categories" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "News_Categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "News_Articles" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "imgUrl" TEXT,
    "categoryId" INTEGER NOT NULL,
    "authorId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "News_Articles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Career_Companies" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "companyLogo" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Career_Companies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Career_Jobs" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "imgUrl" TEXT NOT NULL,
    "jobType" TEXT NOT NULL,
    "companyId" INTEGER NOT NULL,
    "authorId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Career_Jobs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Restaurant_Categories" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Restaurant_Categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Restaurant_Cuisines" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "imgUrl" TEXT NOT NULL,
    "categoryId" INTEGER NOT NULL,
    "authorId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Restaurant_Cuisines_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_email_key" ON "Users"("email");

-- AddForeignKey
ALTER TABLE "Blog_Posts" ADD CONSTRAINT "Blog_Posts_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Blog_Categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Blog_Posts" ADD CONSTRAINT "Blog_Posts_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Branded_Products" ADD CONSTRAINT "Branded_Products_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Branded_Categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Branded_Products" ADD CONSTRAINT "Branded_Products_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Movie_Movies" ADD CONSTRAINT "Movie_Movies_genreId_fkey" FOREIGN KEY ("genreId") REFERENCES "Movie_Genres"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Movie_Movies" ADD CONSTRAINT "Movie_Movies_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rental_Transportations" ADD CONSTRAINT "Rental_Transportations_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "Rental_Types"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rental_Transportations" ADD CONSTRAINT "Rental_Transportations_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Room_Lodgings" ADD CONSTRAINT "Room_Lodgings_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "Room_Types"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Room_Lodgings" ADD CONSTRAINT "Room_Lodgings_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "News_Articles" ADD CONSTRAINT "News_Articles_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "News_Categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "News_Articles" ADD CONSTRAINT "News_Articles_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Career_Jobs" ADD CONSTRAINT "Career_Jobs_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Career_Companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Career_Jobs" ADD CONSTRAINT "Career_Jobs_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Restaurant_Cuisines" ADD CONSTRAINT "Restaurant_Cuisines_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Restaurant_Categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Restaurant_Cuisines" ADD CONSTRAINT "Restaurant_Cuisines_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
