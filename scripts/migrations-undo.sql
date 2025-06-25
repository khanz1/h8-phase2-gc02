-- =============================================================================
-- Database Migration Undo Script - Remastered
-- Reverses all operations from migrations.sql
-- =============================================================================

-- =============================================================================
-- Drop Triggers (in reverse order)
-- =============================================================================

DROP TRIGGER IF EXISTS update_restaurant_cuisines_updated_at ON "Restaurant_Cuisines";
DROP TRIGGER IF EXISTS update_restaurant_categories_updated_at ON "Restaurant_Categories";
DROP TRIGGER IF EXISTS update_career_jobs_updated_at ON "Career_Jobs";
DROP TRIGGER IF EXISTS update_career_companies_updated_at ON "Career_Companies";
DROP TRIGGER IF EXISTS update_news_articles_updated_at ON "News_Articles";
DROP TRIGGER IF EXISTS update_news_categories_updated_at ON "News_Categories";
DROP TRIGGER IF EXISTS update_room_lodgings_updated_at ON "Room_Lodgings";
DROP TRIGGER IF EXISTS update_room_types_updated_at ON "Room_Types";
DROP TRIGGER IF EXISTS update_rental_transportations_updated_at ON "Rental_Transportations";
DROP TRIGGER IF EXISTS update_rental_types_updated_at ON "Rental_Types";
DROP TRIGGER IF EXISTS update_movie_movies_updated_at ON "Movie_Movies";
DROP TRIGGER IF EXISTS update_movie_genres_updated_at ON "Movie_Genres";
DROP TRIGGER IF EXISTS update_branded_products_updated_at ON "Branded_Products";
DROP TRIGGER IF EXISTS update_branded_categories_updated_at ON "Branded_Categories";
DROP TRIGGER IF EXISTS update_blog_posts_updated_at ON "Blog_Posts";
DROP TRIGGER IF EXISTS update_blog_categories_updated_at ON "Blog_Categories";
DROP TRIGGER IF EXISTS update_users_updated_at ON "Users";

-- =============================================================================
-- Drop Trigger Function
-- =============================================================================

DROP FUNCTION IF EXISTS update_updated_at_column();

-- =============================================================================
-- Drop Foreign Key Constraints
-- =============================================================================

-- Restaurant module foreign keys
ALTER TABLE "Restaurant_Cuisines" DROP CONSTRAINT IF EXISTS "fk_restaurant_cuisines_author";
ALTER TABLE "Restaurant_Cuisines" DROP CONSTRAINT IF EXISTS "fk_restaurant_cuisines_category";

-- Career module foreign keys
ALTER TABLE "Career_Jobs" DROP CONSTRAINT IF EXISTS "fk_career_jobs_author";
ALTER TABLE "Career_Jobs" DROP CONSTRAINT IF EXISTS "fk_career_jobs_company";

-- News module foreign keys
ALTER TABLE "News_Articles" DROP CONSTRAINT IF EXISTS "fk_news_articles_author";
ALTER TABLE "News_Articles" DROP CONSTRAINT IF EXISTS "fk_news_articles_category";

-- Room module foreign keys
ALTER TABLE "Room_Lodgings" DROP CONSTRAINT IF EXISTS "fk_room_lodgings_author";
ALTER TABLE "Room_Lodgings" DROP CONSTRAINT IF EXISTS "fk_room_lodgings_type";

-- Rental module foreign keys
ALTER TABLE "Rental_Transportations" DROP CONSTRAINT IF EXISTS "fk_rental_transportations_author";
ALTER TABLE "Rental_Transportations" DROP CONSTRAINT IF EXISTS "fk_rental_transportations_type";

-- Movie module foreign keys
ALTER TABLE "Movie_Movies" DROP CONSTRAINT IF EXISTS "fk_movie_movies_author";
ALTER TABLE "Movie_Movies" DROP CONSTRAINT IF EXISTS "fk_movie_movies_genre";

-- Branded products module foreign keys
ALTER TABLE "Branded_Products" DROP CONSTRAINT IF EXISTS "fk_branded_products_author";
ALTER TABLE "Branded_Products" DROP CONSTRAINT IF EXISTS "fk_branded_products_category";

-- Blog module foreign keys
ALTER TABLE "Blog_Posts" DROP CONSTRAINT IF EXISTS "fk_blog_posts_author";
ALTER TABLE "Blog_Posts" DROP CONSTRAINT IF EXISTS "fk_blog_posts_category";

-- =============================================================================
-- Drop Indexes
-- =============================================================================

-- Restaurant module indexes
DROP INDEX IF EXISTS "idx_restaurant_cuisines_name";
DROP INDEX IF EXISTS "idx_restaurant_cuisines_price";
DROP INDEX IF EXISTS "idx_restaurant_cuisines_author_id";
DROP INDEX IF EXISTS "idx_restaurant_cuisines_category_id";

-- Career module indexes
DROP INDEX IF EXISTS "idx_career_jobs_title";
DROP INDEX IF EXISTS "idx_career_jobs_job_type";
DROP INDEX IF EXISTS "idx_career_jobs_author_id";
DROP INDEX IF EXISTS "idx_career_jobs_company_id";
DROP INDEX IF EXISTS "idx_career_companies_location";
DROP INDEX IF EXISTS "idx_career_companies_email";

-- News module indexes
DROP INDEX IF EXISTS "idx_news_articles_title";
DROP INDEX IF EXISTS "idx_news_articles_created_at";
DROP INDEX IF EXISTS "idx_news_articles_author_id";
DROP INDEX IF EXISTS "idx_news_articles_category_id";

-- Room module indexes
DROP INDEX IF EXISTS "idx_room_lodgings_location";
DROP INDEX IF EXISTS "idx_room_lodgings_room_capacity";
DROP INDEX IF EXISTS "idx_room_lodgings_author_id";
DROP INDEX IF EXISTS "idx_room_lodgings_type_id";

-- Rental module indexes
DROP INDEX IF EXISTS "idx_rental_transportations_location";
DROP INDEX IF EXISTS "idx_rental_transportations_price";
DROP INDEX IF EXISTS "idx_rental_transportations_author_id";
DROP INDEX IF EXISTS "idx_rental_transportations_type_id";

-- Movie module indexes
DROP INDEX IF EXISTS "idx_movie_movies_title";
DROP INDEX IF EXISTS "idx_movie_movies_rating";
DROP INDEX IF EXISTS "idx_movie_movies_author_id";
DROP INDEX IF EXISTS "idx_movie_movies_genre_id";

-- Branded products module indexes
DROP INDEX IF EXISTS "idx_branded_products_name";
DROP INDEX IF EXISTS "idx_branded_products_stock";
DROP INDEX IF EXISTS "idx_branded_products_price";
DROP INDEX IF EXISTS "idx_branded_products_author_id";
DROP INDEX IF EXISTS "idx_branded_products_category_id";

-- Blog module indexes
DROP INDEX IF EXISTS "idx_blog_posts_title";
DROP INDEX IF EXISTS "idx_blog_posts_created_at";
DROP INDEX IF EXISTS "idx_blog_posts_author_id";
DROP INDEX IF EXISTS "idx_blog_posts_category_id";

-- Users table indexes
DROP INDEX IF EXISTS "idx_users_created_at";
DROP INDEX IF EXISTS "idx_users_role";
DROP INDEX IF EXISTS "idx_users_username";
DROP INDEX IF EXISTS "idx_users_email";

-- =============================================================================
-- Drop Tables (in reverse dependency order)
-- =============================================================================

-- Restaurant module tables
DROP TABLE IF EXISTS "Restaurant_Cuisines";
DROP TABLE IF EXISTS "Restaurant_Categories";

-- Career module tables
DROP TABLE IF EXISTS "Career_Jobs";
DROP TABLE IF EXISTS "Career_Companies";

-- News module tables
DROP TABLE IF EXISTS "News_Articles";
DROP TABLE IF EXISTS "News_Categories";

-- Room module tables
DROP TABLE IF EXISTS "Room_Lodgings";
DROP TABLE IF EXISTS "Room_Types";

-- Rental module tables
DROP TABLE IF EXISTS "Rental_Transportations";
DROP TABLE IF EXISTS "Rental_Types";

-- Movie module tables
DROP TABLE IF EXISTS "Movie_Movies";
DROP TABLE IF EXISTS "Movie_Genres";

-- Branded products module tables
DROP TABLE IF EXISTS "Branded_Products";
DROP TABLE IF EXISTS "Branded_Categories";

-- Blog module tables
DROP TABLE IF EXISTS "Blog_Posts";
DROP TABLE IF EXISTS "Blog_Categories";

-- Core tables
DROP TABLE IF EXISTS "Users";

-- =============================================================================
-- Final Cleanup
-- =============================================================================

-- Reset sequences (if they exist)
DROP SEQUENCE IF EXISTS "Users_id_seq";
DROP SEQUENCE IF EXISTS "Blog_Categories_id_seq";
DROP SEQUENCE IF EXISTS "Blog_Posts_id_seq";
DROP SEQUENCE IF EXISTS "Branded_Categories_id_seq";
DROP SEQUENCE IF EXISTS "Branded_Products_id_seq";
DROP SEQUENCE IF EXISTS "Movie_Genres_id_seq";
DROP SEQUENCE IF EXISTS "Movie_Movies_id_seq";
DROP SEQUENCE IF EXISTS "Rental_Types_id_seq";
DROP SEQUENCE IF EXISTS "Rental_Transportations_id_seq";
DROP SEQUENCE IF EXISTS "Room_Types_id_seq";
DROP SEQUENCE IF EXISTS "Room_Lodgings_id_seq";
DROP SEQUENCE IF EXISTS "News_Categories_id_seq";
DROP SEQUENCE IF EXISTS "News_Articles_id_seq";
DROP SEQUENCE IF EXISTS "Career_Companies_id_seq";
DROP SEQUENCE IF EXISTS "Career_Jobs_id_seq";
DROP SEQUENCE IF EXISTS "Restaurant_Categories_id_seq";
DROP SEQUENCE IF EXISTS "Restaurant_Cuisines_id_seq";

-- =============================================================================
-- Undo Migration Complete
-- ============================================================================= 