# Blog Feature Implementation

## Overview

Implemented a complete blog management system with both authenticated admin endpoints and public endpoints for content consumption. The feature supports blog posts and categories with full CRUD operations, pagination, and search functionality.

## Files Created/Updated

### New Files Created:

1. `src/features/blog/blog.types.ts` - TypeScript interfaces and validation schemas
2. `src/features/blog/blog.repository.ts` - Data access layer with Sequelize operations
3. `src/features/blog/blog.service.ts` - Business logic layer with error handling
4. `src/features/blog/blog.controller.ts` - HTTP request/response handlers with ownership checks
5. `src/features/blog/blog.routes.ts` - Class-based route definitions with middleware

### Updated Files:

1. `src/app.ts` - Added blog route registration using class-based approach

## API Endpoints Implemented

### Authenticated Blog Routes (`/apis/blog`)

**Categories:**

- `GET /apis/blog/categories` - Fetch all categories (Auth required)
- `GET /apis/blog/categories/:id` - Fetch detailed category (Auth required)
- `POST /apis/blog/categories` - Create new category (Admin/Staff only)
- `PUT /apis/blog/categories/:id` - Update category (Admin/Staff only)
- `DELETE /apis/blog/categories/:id` - Delete category (Admin only)

**Posts:**

- `GET /apis/blog/posts` - Fetch all posts (Auth required)
- `GET /apis/blog/posts/:id` - Fetch detailed post (Auth required)
- `POST /apis/blog/posts` - Create new post (Admin/Staff only)
- `PUT /apis/blog/posts/:id` - Update post (Admin/Staff only, with ownership check)
- `PATCH /apis/blog/posts/:id` - Update post image (Admin/Staff only, with ownership check) \*
- `DELETE /apis/blog/posts/:id` - Delete post (Admin/Staff only, with ownership check)

### Public Blog Routes (`/apis/pub/blog`)

- `GET /apis/pub/blog/posts` - Public fetch all posts with filtering/pagination
- `GET /apis/pub/blog/posts/:id` - Public fetch detailed post
- `GET /apis/pub/blog/categories` - Public fetch all categories

\*Note: Image upload functionality is commented for future implementation

## Key Features Implemented

### Ownership-Based Access Control

- **Ownership Checks**: Before update/delete operations, the system:
  1. Fetches the existing blog post from database
  2. Compares the `authorId` from the post with `userId` from the JWT token
  3. Only allows the operation if user is the author OR has Admin role
  4. Throws `ForbiddenError` if unauthorized

### Data Validation

- Zod schemas for all input validation
- Category name: 2-100 characters, unique
- Post title: 2-500 characters
- Post content: minimum 10 characters
- URL validation for images

### Query Parameters (Public endpoints)

- `q` - Search by post title
- `i` - Search by category name(s) (comma-separated)
- `limit` - Results per page (4-12, default: 10)
- `page` - Page number (default: 1)
- `sort` - Sort order (ASC/DESC, default: DESC)

### Authorization Levels

- **Public**: Can view posts and categories
- **Authenticated**: Can view all content
- **Staff/Admin**: Can create and update content
- **Admin Only**: Can delete categories
- **Author/Admin**: Can update/delete own posts (ownership-based)

### Error Handling

- Comprehensive error handling with custom error types
- Foreign key constraint handling
- Unique constraint violation handling
- Not found error handling
- Ownership validation with `ForbiddenError`

### Database Relations

- BlogPost belongs to BlogCategory
- BlogPost belongs to User (as author)
- BlogCategory has many BlogPosts
- Proper indexing on foreign keys and searchable fields

## Technical Implementation Details

### Architecture Alignment

- **Class-based Routes**: Follows same pattern as auth routes with dependency injection
- **Logger Pattern**: Uses `Logger.getInstance()` consistent with auth implementation
- **OOP Principles**: Proper class structure with dependency injection
- **Consistent Patterns**: Matches existing codebase architecture

### Repository Pattern

- Separate repository classes for categories and posts
- Sequelize ORM with proper associations and type casting
- Search functionality with PostgreSQL ILIKE operations
- Pagination support with count queries

### Service Layer

- Business logic separation
- Category existence validation before post operations
- Comprehensive error handling and transformation
- Pagination calculation for public endpoints

### Controller Layer

- Request/response handling with proper HTTP status codes
- Input validation with Zod schemas
- **Ownership validation** before update/delete operations
- Logger instance pattern matching auth controller
- Structured JSON responses with success/error handling

### Route Configuration

- **Class-based approach** matching auth routes pattern
- Dependency injection through constructor
- Middleware composition with proper authentication/authorization
- Separate methods for authenticated and public route setup
- Logger integration for route configuration confirmation

## Response Formats

### Success Response:

```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": { ... }
}
```

### Paginated Response:

```json
{
  "success": true,
  "message": "Blog posts retrieved successfully",
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "totalPages": 5
  }
}
```

### Ownership Error Response:

```json
{
  "success": false,
  "message": "You can only update your own blog posts",
  "statusCode": 403
}
```

## Security Implementation

### Ownership-Based Access Control

```typescript
// Before update/delete operations:
const existingPost = await this.postService.getPostById(id);
if (existingPost.authorId !== currentUserId && currentUserRole !== "Admin") {
  throw new ForbiddenError("You can only update your own blog posts");
}
```

### Role-Based Authorization

- Create posts: Admin/Staff only
- Update posts: Admin/Staff only (with ownership check)
- Delete posts: Admin/Staff only (with ownership check)
- Delete categories: Admin only

## Future Enhancements

- Image upload functionality (currently commented)
- Rich text editor support
- Post status (draft/published)
- Tags system
- Comment system
- SEO optimization fields

## Git Commit Message

```
feat(blog): implement complete blog system with ownership controls

• add blog categories and posts CRUD operations
• implement class-based router pattern matching auth structure
• add ownership-based access control for post operations
• include comprehensive validation and error handling
• support category-based filtering and text search
• align with project architecture and coding standards
• prepare structure for future image upload functionality
```
