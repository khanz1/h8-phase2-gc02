# Postman Collection - Query Parameters Fix

## Changes Summary

### What Changed

- Fixed careers public API query parameters to match actual implementation
- Ensured only implemented query parameters are included in Postman collection
- Verified correct parameter usage: `i` for job types, `l` for locations in careers

### Files Modified

- **docs/postman.json**: Fixed careers public API query parameters

### Query Parameters Pattern

#### Blog Public API (Correct Implementation)

- **q**: Search in post titles
- **i**: Filter by category names (comma-separated)
- **limit**: Posts per page (4-12, default: 10)
- **page**: Page number (min: 1, default: 1)
- **sort**: Sort order (ASC/DESC, default: DESC)

#### Career Public API (Correct Implementation)

- **q**: Search in job titles
- **i**: Filter by job types (Full-time, Part-time, Contract, Internship, Remote)
- **l**: Filter by company locations (comma-separated)
- **limit**: Jobs per page (4-12, default: 10)
- **page**: Page number (min: 1, default: 1)
- **sort**: Sort order (ASC/DESC, default: DESC)

## Technical Details

### Implementation Verification

- **Blog**: `i` parameter filters by category names in `blog.repository.ts`
- **Careers**: `i` parameter filters by job types, `l` parameter filters by company locations in `career.repository.ts`
- **Types**: All parameters defined in respective `*.types.ts` files

### Query Parameter Usage

- **q**: Text search in primary entity (post title, job title)
- **i**: Filter by secondary entity (category names, job types)
- **l**: Filter by location (careers only)
- **limit/page/sort**: Standard pagination and sorting

## Learning Points

### For Future API Development

1. **Always check implementation first** before adding query parameters to Postman
2. **Follow the pattern**: q (search), i (second entity), limit, page, sort
3. **Verify in types and repository** that parameters are actually implemented
4. **Don't add parameters** that don't exist in the code
5. **Use consistent naming**: `i` for secondary entity filtering across features

### Postman Collection Guidelines

- **Match implementation exactly**: Only include parameters that exist in code
- **Clear descriptions**: Explain what each parameter filters
- **Realistic examples**: Use actual values that would work
- **Consistent patterns**: Follow established query parameter conventions

## Git Commit Messages

```
fix: correct careers public API query parameters in postman

• fix i parameter to filter by job types (not categories)
• add l parameter for company location filtering
• ensure query parameters match actual implementation
• follow established pattern: q (search), i (second entity), limit, page, sort
• verify all parameters exist in career.types.ts and career.repository.ts
```
