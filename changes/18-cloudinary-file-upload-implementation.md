# Cloudinary File Upload Implementation

## Overview

Implemented a comprehensive file upload system using Cloudinary for image hosting and management. The system includes proper validation, error handling, and seamless integration with the blog feature's PATCH endpoint for image uploads.

## Files Created/Updated

### New Files Created:

1. `src/shared/utils/cloudinary.helper.ts` - Cloudinary integration utility
2. `src/shared/middleware/upload.middleware.ts` - Multer middleware for file uploads
3. `src/shared/types/express.d.ts` - TypeScript declarations for Express + Multer

### Updated Files:

1. `src/features/blog/blog.controller.ts` - Integrated Cloudinary upload in PATCH endpoint
2. `src/features/blog/blog.routes.ts` - Added upload middleware to PATCH route
3. `tsconfig.json` - Added types directory to typeRoots

## Key Features

### CloudinaryHelper Utility

- **Image Upload**: Supports both file objects and buffer uploads
- **Validation**: File size, format, and MIME type validation
- **Optimization**: Automatic image transformation and optimization
- **Error Handling**: Comprehensive error handling with custom error types
- **Configuration Check**: Validates Cloudinary environment variables
- **Image Management**: Delete images and extract public IDs from URLs

### UploadMiddleware

- **Single Image Upload**: Multer configuration for single file uploads
- **Memory Storage**: Files stored in memory for direct Cloudinary upload
- **File Filtering**: Restricts uploads to image files only
- **Size Limits**: 5MB maximum file size
- **Error Handling**: Detailed error messages for various upload failures
- **Optional Uploads**: Support for optional file uploads

### Type Safety

- **Express Extensions**: Extended Express Request interface with file and user properties
- **TypeScript Support**: Full type safety for file upload operations
- **JWT Integration**: Proper typing for authenticated requests

## API Endpoint Integration

### Blog Image Upload Endpoint

```
PATCH /apis/blog/posts/:id
Content-Type: multipart/form-data
Authorization: Bearer <token>

Body: {
  file: <image-file>
}
```

**Features:**

- **Ownership Validation**: Only post author or admin can update images
- **File Validation**: Automatic validation of image files
- **Cloudinary Upload**: Direct upload to Cloudinary with optimization
- **Response Enhancement**: Returns upload metadata along with post data

## Technical Implementation

### File Upload Flow

1. **Request Reception**: Multer middleware processes multipart/form-data
2. **File Validation**: Check file type, size, and format
3. **Authentication**: Verify user authentication and authorization
4. **Ownership Check**: Validate user owns the blog post or is admin
5. **Cloudinary Upload**: Upload image with transformations
6. **Database Update**: Update blog post with new image URL
7. **Response**: Return updated post with upload metadata

### Image Optimization

```typescript
const uploadResult = await CloudinaryHelper.uploadImage(req.file, {
  folder: "blog-posts",
  transformation: {
    width: 1200,
    height: 800,
    crop: "limit",
    quality: "auto",
  },
});
```

### Validation Rules

- **File Types**: JPEG, PNG, GIF, WebP, BMP, SVG
- **File Size**: Maximum 5MB
- **Upload Count**: Single file only
- **Security**: MIME type and file extension validation

## Environment Variables Required

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## Response Format

### Success Response

```json
{
  "success": true,
  "message": "Blog post image updated successfully",
  "data": {
    "id": 1,
    "title": "Blog Post Title",
    "content": "Blog content...",
    "imgUrl": "https://res.cloudinary.com/...",
    "categoryId": 1,
    "authorId": 1,
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z",
    "uploadInfo": {
      "publicId": "blog-posts/abc123",
      "url": "https://res.cloudinary.com/...",
      "format": "jpg",
      "width": 1200,
      "height": 800,
      "bytes": 145234
    }
  }
}
```

### Error Response Examples

```json
{
  "success": false,
  "message": "File too large. Maximum size allowed is 5MB",
  "statusCode": 400
}
```

```json
{
  "success": false,
  "message": "Only image files are allowed",
  "statusCode": 400
}
```

## Security Features

### File Validation

- **MIME Type Check**: Validates file is actually an image
- **Extension Validation**: Checks file extension matches allowed formats
- **Size Limits**: Prevents large file uploads
- **Format Restrictions**: Only allows safe image formats

### Access Control

- **Authentication Required**: Must be logged in to upload
- **Authorization Check**: Admin/Staff roles required
- **Ownership Validation**: Can only update own posts (unless admin)
- **Middleware Chain**: Proper middleware ordering for security

### Error Handling

- **Sanitized Errors**: No sensitive information in error messages
- **Logging**: Comprehensive logging for debugging and monitoring
- **Graceful Failures**: Proper error responses for all failure scenarios

## Usage Examples

### Upload Image to Blog Post

```bash
curl -X PATCH \
  http://localhost:3000/apis/blog/posts/1 \
  -H 'Authorization: Bearer <token>' \
  -H 'Content-Type: multipart/form-data' \
  -F 'file=@image.jpg'
```

### Test Upload with Invalid File

```bash
curl -X PATCH \
  http://localhost:3000/apis/blog/posts/1 \
  -H 'Authorization: Bearer <token>' \
  -H 'Content-Type: multipart/form-data' \
  -F 'file=@document.pdf'
```

## Configuration Options

### CloudinaryHelper Options

```typescript
interface UploadOptions {
  folder?: string; // Cloudinary folder
  transformation?: {
    width?: number; // Max width
    height?: number; // Max height
    crop?: string; // Crop mode
    quality?: string; // Image quality
  };
  allowedFormats?: string[]; // Allowed file formats
  maxFileSize?: number; // Max file size in bytes
}
```

### UploadMiddleware Configuration

- **Max File Size**: 5MB (configurable)
- **Storage**: Memory storage for direct upload
- **File Count**: Single file uploads only
- **Field Name**: Configurable form field name

## Future Enhancements

### Planned Features

- **Multiple Image Upload**: Support for gallery uploads
- **Image Variants**: Different sizes for thumbnails/previews
- **Progressive Upload**: Chunked upload for large files
- **Image Editing**: Built-in image editing capabilities
- **CDN Integration**: Advanced CDN configuration

### Performance Optimizations

- **Lazy Loading**: Image lazy loading implementation
- **WebP Conversion**: Automatic format optimization
- **Responsive Images**: Multiple size variants
- **Caching Strategy**: Browser and CDN caching

## Testing Recommendations

### Unit Tests

- Test file validation logic
- Test Cloudinary integration
- Test error handling scenarios
- Test middleware configuration

### Integration Tests

- End-to-end upload flow
- Authentication and authorization
- File size and format limits
- Error response formats

### Load Testing

- Multiple concurrent uploads
- Large file upload performance
- Cloudinary rate limiting
- Memory usage monitoring

## Git Commit Message

```
feat(upload): implement Cloudinary image upload for blog posts

• add CloudinaryHelper utility with comprehensive image upload functionality
• create UploadMiddleware using Multer for file handling and validation
• integrate image upload with blog PATCH endpoint for post images
• add TypeScript declarations for Express file upload support
• implement proper file validation (size, type, format)
• add image optimization and transformation capabilities
• include comprehensive error handling and logging
• maintain ownership-based access control for image uploads
• prepare foundation for future multi-upload and gallery features
```
