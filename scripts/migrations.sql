-- =============================================================================
-- Database Migration Script - Remastered
-- Features: Blog, Branded Products, Movies, Rental, Room, News, Career, Restaurant
-- =============================================================================

-- =============================================================================
-- Core Tables
-- =============================================================================

-- Users table with improved constraints and indexes
CREATE TABLE "Users" (
    "id" SERIAL NOT NULL,
    "username" VARCHAR(50) UNIQUE NOT NULL,
    "email" VARCHAR(255) UNIQUE NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "role" VARCHAR(20) NOT NULL DEFAULT 'Staff',
    "phone_number" VARCHAR(20),
    "address" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "Users_role_check" CHECK ("role" IN ('Admin', 'Staff', 'User')),
    CONSTRAINT "Users_email_format_check" CHECK ("email" ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    CONSTRAINT "Users_username_length_check" CHECK (LENGTH("username") >= 3)
);

-- =============================================================================
-- Blog Module
-- =============================================================================

-- Blog categories with validation
CREATE TABLE "Blog_Categories" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) UNIQUE NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Blog_Categories_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "Blog_Categories_name_length_check" CHECK (LENGTH("name") >= 2)
);

-- Blog posts with enhanced validation
CREATE TABLE "Blog_Posts" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(500) NOT NULL,
    "content" TEXT NOT NULL,
    "img_url" TEXT,
    "category_id" INTEGER NOT NULL,
    "author_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Blog_Posts_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "Blog_Posts_title_length_check" CHECK (LENGTH("title") >= 2),
    CONSTRAINT "Blog_Posts_content_length_check" CHECK (LENGTH("content") >= 10)
);

-- =============================================================================
-- Branded Products Module
-- =============================================================================

-- Branded product categories
CREATE TABLE "Branded_Categories" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) UNIQUE NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Branded_Categories_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "Branded_Categories_name_length_check" CHECK (LENGTH("name") >= 2)
);

-- Branded products with business logic constraints
CREATE TABLE "Branded_Products" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "stock" INTEGER NOT NULL DEFAULT 0,
    "img_url" TEXT,
    "category_id" INTEGER NOT NULL,
    "author_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Branded_Products_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "Branded_Products_price_positive_check" CHECK ("price" > 0),
    CONSTRAINT "Branded_Products_stock_non_negative_check" CHECK ("stock" >= 0),
    CONSTRAINT "Branded_Products_name_length_check" CHECK (LENGTH("name") >= 2),
    CONSTRAINT "Branded_Products_description_length_check" CHECK (LENGTH("description") >= 10)
);

-- =============================================================================
-- Movie Module
-- =============================================================================

-- Movie genres
CREATE TABLE "Movie_Genres" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(50) UNIQUE NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Movie_Genres_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "Movie_Genres_name_length_check" CHECK (LENGTH("name") >= 2)
);

-- Movies with rating validation
CREATE TABLE "Movie_Movies" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(500) NOT NULL,
    "synopsis" TEXT NOT NULL,
    "trailer_url" TEXT,
    "img_url" TEXT,
    "rating" INTEGER NOT NULL,
    "genre_id" INTEGER NOT NULL,
    "author_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Movie_Movies_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "Movie_Movies_rating_range_check" CHECK ("rating" >= 1 AND "rating" <= 10),
    CONSTRAINT "Movie_Movies_title_length_check" CHECK (LENGTH("title") >= 1),
    CONSTRAINT "Movie_Movies_synopsis_length_check" CHECK (LENGTH("synopsis") >= 20)
);

-- =============================================================================
-- Rental Module
-- =============================================================================

-- Rental types
CREATE TABLE "Rental_Types" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(50) UNIQUE NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Rental_Types_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "Rental_Types_name_length_check" CHECK (LENGTH("name") >= 2)
);

-- Rental transportations with location and pricing validation
CREATE TABLE "Rental_Transportations" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT NOT NULL,
    "img_url" TEXT,
    "location" VARCHAR(255) NOT NULL,
    "price" INTEGER NOT NULL,
    "type_id" INTEGER NOT NULL,
    "author_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Rental_Transportations_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "Rental_Transportations_price_positive_check" CHECK ("price" > 0),
    CONSTRAINT "Rental_Transportations_name_length_check" CHECK (LENGTH("name") >= 2),
    CONSTRAINT "Rental_Transportations_location_length_check" CHECK (LENGTH("location") >= 2)
);

-- =============================================================================
-- Room Module
-- =============================================================================

-- Room types
CREATE TABLE "Room_Types" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(50) UNIQUE NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Room_Types_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "Room_Types_name_length_check" CHECK (LENGTH("name") >= 2)
);

-- Room lodgings with capacity validation
CREATE TABLE "Room_Lodgings" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "facility" TEXT NOT NULL,
    "room_capacity" INTEGER NOT NULL,
    "img_url" TEXT NOT NULL,
    "location" VARCHAR(255) NOT NULL,
    "type_id" INTEGER NOT NULL,
    "author_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Room_Lodgings_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "Room_Lodgings_capacity_positive_check" CHECK ("room_capacity" > 0),
    CONSTRAINT "Room_Lodgings_name_length_check" CHECK (LENGTH("name") >= 2),
    CONSTRAINT "Room_Lodgings_location_length_check" CHECK (LENGTH("location") >= 2)
);

-- =============================================================================
-- News Module
-- =============================================================================

-- News categories
CREATE TABLE "News_Categories" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) UNIQUE NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "News_Categories_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "News_Categories_name_length_check" CHECK (LENGTH("name") >= 2)
);

-- News articles with content validation
CREATE TABLE "News_Articles" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(500) NOT NULL,
    "content" TEXT NOT NULL,
    "img_url" TEXT,
    "category_id" INTEGER NOT NULL,
    "author_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "News_Articles_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "News_Articles_title_length_check" CHECK (LENGTH("title") >= 2),
    CONSTRAINT "News_Articles_content_length_check" CHECK (LENGTH("content") >= 50)
);

-- =============================================================================
-- Career Module
-- =============================================================================

-- Career companies with validation
CREATE TABLE "Career_Companies" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(1000) UNIQUE NOT NULL,
    "company_logo" TEXT NOT NULL,
    "location" VARCHAR(1000) NOT NULL,
    "email" VARCHAR(255) UNIQUE NOT NULL,
    "description" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Career_Companies_pkey" PRIMARY KEY ("id"),
    -- CONSTRAINT "Career_Companies_email_format_check" CHECK ("email" ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    CONSTRAINT "Career_Companies_name_length_check" CHECK (LENGTH("name") >= 2),
    CONSTRAINT "Career_Companies_location_length_check" CHECK (LENGTH("location") >= 2)
);

-- Career jobs with job type validation
CREATE TABLE "Career_Jobs" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(1000) NOT NULL,
    "description" TEXT NOT NULL,
    "img_url" TEXT NOT NULL,
    "job_type" VARCHAR(250) NOT NULL,
    "company_id" INTEGER NOT NULL,
    "author_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Career_Jobs_pkey" PRIMARY KEY ("id"),
    -- CONSTRAINT "Career_Jobs_job_type_check" CHECK ("job_type" IN ('Full-time', 'Part-time', 'Contract', 'Internship', 'Remote')),
    CONSTRAINT "Career_Jobs_title_length_check" CHECK (LENGTH("title") >= 3),
    CONSTRAINT "Career_Jobs_description_length_check" CHECK (LENGTH("description") >= 50)
);

-- =============================================================================
-- Restaurant Module
-- =============================================================================

-- Restaurant categories
CREATE TABLE "Restaurant_Categories" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) UNIQUE NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Restaurant_Categories_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "Restaurant_Categories_name_length_check" CHECK (LENGTH("name") >= 2)
);

-- Restaurant cuisines with pricing validation
CREATE TABLE "Restaurant_Cuisines" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(500) NOT NULL,
    "description" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "img_url" TEXT NOT NULL,
    "category_id" INTEGER NOT NULL,
    "author_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Restaurant_Cuisines_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "Restaurant_Cuisines_price_positive_check" CHECK ("price" > 0),
    CONSTRAINT "Restaurant_Cuisines_name_length_check" CHECK (LENGTH("name") >= 2)
);

-- =============================================================================
-- Performance Indexes
-- =============================================================================

-- Users table indexes
CREATE INDEX "idx_users_email" ON "Users"("email");
CREATE INDEX "idx_users_username" ON "Users"("username");
CREATE INDEX "idx_users_role" ON "Users"("role");
CREATE INDEX "idx_users_created_at" ON "Users"("created_at");

-- Blog module indexes
CREATE INDEX "idx_blog_posts_category_id" ON "Blog_Posts"("category_id");
CREATE INDEX "idx_blog_posts_author_id" ON "Blog_Posts"("author_id");
CREATE INDEX "idx_blog_posts_created_at" ON "Blog_Posts"("created_at");
CREATE INDEX "idx_blog_posts_title" ON "Blog_Posts"("title");

-- Branded products module indexes
CREATE INDEX "idx_branded_products_category_id" ON "Branded_Products"("category_id");
CREATE INDEX "idx_branded_products_author_id" ON "Branded_Products"("author_id");
CREATE INDEX "idx_branded_products_price" ON "Branded_Products"("price");
CREATE INDEX "idx_branded_products_stock" ON "Branded_Products"("stock");
CREATE INDEX "idx_branded_products_name" ON "Branded_Products"("name");

-- Movie module indexes
CREATE INDEX "idx_movie_movies_genre_id" ON "Movie_Movies"("genre_id");
CREATE INDEX "idx_movie_movies_author_id" ON "Movie_Movies"("author_id");
CREATE INDEX "idx_movie_movies_rating" ON "Movie_Movies"("rating");
CREATE INDEX "idx_movie_movies_title" ON "Movie_Movies"("title");

-- Rental module indexes
CREATE INDEX "idx_rental_transportations_type_id" ON "Rental_Transportations"("type_id");
CREATE INDEX "idx_rental_transportations_author_id" ON "Rental_Transportations"("author_id");
CREATE INDEX "idx_rental_transportations_price" ON "Rental_Transportations"("price");
CREATE INDEX "idx_rental_transportations_location" ON "Rental_Transportations"("location");

-- Room module indexes
CREATE INDEX "idx_room_lodgings_type_id" ON "Room_Lodgings"("type_id");
CREATE INDEX "idx_room_lodgings_author_id" ON "Room_Lodgings"("author_id");
CREATE INDEX "idx_room_lodgings_room_capacity" ON "Room_Lodgings"("room_capacity");
CREATE INDEX "idx_room_lodgings_location" ON "Room_Lodgings"("location");

-- News module indexes
CREATE INDEX "idx_news_articles_category_id" ON "News_Articles"("category_id");
CREATE INDEX "idx_news_articles_author_id" ON "News_Articles"("author_id");
CREATE INDEX "idx_news_articles_created_at" ON "News_Articles"("created_at");
CREATE INDEX "idx_news_articles_title" ON "News_Articles"("title");

-- Career module indexes
CREATE INDEX "idx_career_companies_email" ON "Career_Companies"("email");
CREATE INDEX "idx_career_companies_location" ON "Career_Companies"("location");
CREATE INDEX "idx_career_jobs_company_id" ON "Career_Jobs"("company_id");
CREATE INDEX "idx_career_jobs_author_id" ON "Career_Jobs"("author_id");
CREATE INDEX "idx_career_jobs_job_type" ON "Career_Jobs"("job_type");
CREATE INDEX "idx_career_jobs_title" ON "Career_Jobs"("title");

-- Restaurant module indexes
CREATE INDEX "idx_restaurant_cuisines_category_id" ON "Restaurant_Cuisines"("category_id");
CREATE INDEX "idx_restaurant_cuisines_author_id" ON "Restaurant_Cuisines"("author_id");
CREATE INDEX "idx_restaurant_cuisines_price" ON "Restaurant_Cuisines"("price");
CREATE INDEX "idx_restaurant_cuisines_name" ON "Restaurant_Cuisines"("name");

-- =============================================================================
-- Foreign Key Constraints
-- =============================================================================

-- Blog module foreign keys
ALTER TABLE "Blog_Posts" ADD CONSTRAINT "fk_blog_posts_category" 
    FOREIGN KEY ("category_id") REFERENCES "Blog_Categories"("id") 
    ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Blog_Posts" ADD CONSTRAINT "fk_blog_posts_author" 
    FOREIGN KEY ("author_id") REFERENCES "Users"("id") 
    ON DELETE CASCADE ON UPDATE CASCADE;

-- Branded products module foreign keys
ALTER TABLE "Branded_Products" ADD CONSTRAINT "fk_branded_products_category" 
    FOREIGN KEY ("category_id") REFERENCES "Branded_Categories"("id") 
    ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Branded_Products" ADD CONSTRAINT "fk_branded_products_author" 
    FOREIGN KEY ("author_id") REFERENCES "Users"("id") 
    ON DELETE CASCADE ON UPDATE CASCADE;

-- Movie module foreign keys
ALTER TABLE "Movie_Movies" ADD CONSTRAINT "fk_movie_movies_genre" 
    FOREIGN KEY ("genre_id") REFERENCES "Movie_Genres"("id") 
    ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Movie_Movies" ADD CONSTRAINT "fk_movie_movies_author" 
    FOREIGN KEY ("author_id") REFERENCES "Users"("id") 
    ON DELETE CASCADE ON UPDATE CASCADE;

-- Rental module foreign keys
ALTER TABLE "Rental_Transportations" ADD CONSTRAINT "fk_rental_transportations_type" 
    FOREIGN KEY ("type_id") REFERENCES "Rental_Types"("id") 
    ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Rental_Transportations" ADD CONSTRAINT "fk_rental_transportations_author" 
    FOREIGN KEY ("author_id") REFERENCES "Users"("id") 
    ON DELETE CASCADE ON UPDATE CASCADE;

-- Room module foreign keys
ALTER TABLE "Room_Lodgings" ADD CONSTRAINT "fk_room_lodgings_type" 
    FOREIGN KEY ("type_id") REFERENCES "Room_Types"("id") 
    ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Room_Lodgings" ADD CONSTRAINT "fk_room_lodgings_author" 
    FOREIGN KEY ("author_id") REFERENCES "Users"("id") 
    ON DELETE CASCADE ON UPDATE CASCADE;

-- News module foreign keys
ALTER TABLE "News_Articles" ADD CONSTRAINT "fk_news_articles_category" 
    FOREIGN KEY ("category_id") REFERENCES "News_Categories"("id") 
    ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "News_Articles" ADD CONSTRAINT "fk_news_articles_author" 
    FOREIGN KEY ("author_id") REFERENCES "Users"("id") 
    ON DELETE CASCADE ON UPDATE CASCADE;

-- Career module foreign keys
ALTER TABLE "Career_Jobs" ADD CONSTRAINT "fk_career_jobs_company" 
    FOREIGN KEY ("company_id") REFERENCES "Career_Companies"("id") 
    ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Career_Jobs" ADD CONSTRAINT "fk_career_jobs_author" 
    FOREIGN KEY ("author_id") REFERENCES "Users"("id") 
    ON DELETE CASCADE ON UPDATE CASCADE;

-- Restaurant module foreign keys
ALTER TABLE "Restaurant_Cuisines" ADD CONSTRAINT "fk_restaurant_cuisines_category" 
    FOREIGN KEY ("category_id") REFERENCES "Restaurant_Categories"("id") 
    ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Restaurant_Cuisines" ADD CONSTRAINT "fk_restaurant_cuisines_author" 
    FOREIGN KEY ("author_id") REFERENCES "Users"("id") 
    ON DELETE CASCADE ON UPDATE CASCADE;

-- =============================================================================
-- Triggers for automatic updated_at timestamp updates
-- =============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers to all tables with updated_at column
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON "Users" 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_blog_categories_updated_at BEFORE UPDATE ON "Blog_Categories" 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_blog_posts_updated_at BEFORE UPDATE ON "Blog_Posts" 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_branded_categories_updated_at BEFORE UPDATE ON "Branded_Categories" 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_branded_products_updated_at BEFORE UPDATE ON "Branded_Products" 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_movie_genres_updated_at BEFORE UPDATE ON "Movie_Genres" 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_movie_movies_updated_at BEFORE UPDATE ON "Movie_Movies" 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_rental_types_updated_at BEFORE UPDATE ON "Rental_Types" 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_rental_transportations_updated_at BEFORE UPDATE ON "Rental_Transportations" 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_room_types_updated_at BEFORE UPDATE ON "Room_Types" 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_room_lodgings_updated_at BEFORE UPDATE ON "Room_Lodgings" 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_news_categories_updated_at BEFORE UPDATE ON "News_Categories" 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_news_articles_updated_at BEFORE UPDATE ON "News_Articles" 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_career_companies_updated_at BEFORE UPDATE ON "Career_Companies" 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_career_jobs_updated_at BEFORE UPDATE ON "Career_Jobs" 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_restaurant_categories_updated_at BEFORE UPDATE ON "Restaurant_Categories" 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_restaurant_cuisines_updated_at BEFORE UPDATE ON "Restaurant_Cuisines" 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();