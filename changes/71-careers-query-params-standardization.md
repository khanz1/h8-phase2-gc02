# Careers Query Parameters Standardization

## Changes Summary

### What Changed

- Standardized careers query parameters to follow consistent pattern across all features
- Changed `i` parameter to filter by company names (second entity) instead of job types
- Removed `l` parameter for location filtering completely
- Updated implementation to match the standard pattern: q, i (second entity), limit, page, sort

### Files Modified

#### Types and Schema

- **src/features/careers/career.types.ts**:
  - Updated `careerQuerySchema` to remove `l` parameter
  - Changed `i` description from "job type" to "company name"
  - Updated `CareerQueryDto` interface to remove `l` parameter

#### Repository Implementation

- **src/features/careers/career.repository.ts**:
  - Modified `findAllPublic` method to make `i` filter by company names
  - Removed all logic for `l` parameter (location filtering)
  - Updated filtering logic to use company name search instead of job type

#### Documentation

- **docs/postman.json**:
  - Updated careers public API example to use company names for `i` parameter
  - Changed example from "Full-time,Remote" to "TechCorp,Microsoft"
  - Updated parameter descriptions and endpoint documentation

## Standardized Query Parameters Pattern

### Consistent Across All Features

- **q**: Search in primary entity (post title, job title)
- **i**: Filter by second entity by name (category names, company names)
- **limit**: Items per page (4-12, default: 10)
- **page**: Page number (min: 1, default: 1)
- **sort**: Sort order (ASC/DESC, default: DESC)

### Feature-Specific Implementation

- **Blog**: `i` filters by category names
- **Careers**: `i` filters by company names

## Technical Details

### Query Parameter Mapping

- **Blog Context**: Job Posts → Categories (second entity)
- **Careers Context**: Jobs → Companies (second entity)

### Implementation Changes

```typescript
// Before (incorrect)
if (i) {
  const jobTypes = i.split(",").map((type) => type.trim());
  whereConditions.jobType = { [Op.in]: jobTypes };
}

// After (correct)
if (i) {
  const companyNames = i.split(",").map((name) => name.trim());
  companyWhereConditions.name = {
    [Op.iLike]: { [Op.any]: companyNames.map((name) => `%${name}%`) },
  };
}
```

### Removed Features

- **Location filtering (`l` parameter)**: Completely removed to maintain consistency
- **Job type filtering**: No longer supported to follow standard pattern

## Pros and Cons

### Pros

✅ **Consistent Pattern**: All features now follow the same query parameter structure  
✅ **Predictable API**: Developers can expect the same parameters across features  
✅ **Simpler Implementation**: Reduced complexity by removing non-standard parameters  
✅ **Better Architecture**: Clear relationship between primary and secondary entities

### Cons

❌ **Lost Functionality**: Location and job type filtering no longer available  
❌ **Breaking Change**: Existing API consumers need to update their usage

## Migration Guide

### For API Consumers

- **Job Type Filtering**: No longer supported via query parameters
- **Location Filtering**: No longer supported via query parameters
- **Company Filtering**: Use `i` parameter with company names instead

### Example Usage

```
// Before
GET /apis/pub/careers/jobs?i=Full-time,Remote&l=San Francisco

// After
GET /apis/pub/careers/jobs?i=TechCorp,Microsoft
```

## Benefits

- **Standardization**: Consistent API design across all features
- **Simplicity**: Fewer parameters to remember and document
- **Maintainability**: Easier to add new features following the same pattern
- **Developer Experience**: Predictable API behavior

## Git Commit Messages

```
refactor: standardize careers query parameters to match feature pattern

• change i parameter to filter by company names instead of job types
• remove l parameter for location filtering completely
• update repository implementation to use company name filtering
• update postman collection with correct parameter examples
• follow standard pattern: q (search), i (second entity), limit, page, sort
• ensure consistency across all features (blog and careers)
```
