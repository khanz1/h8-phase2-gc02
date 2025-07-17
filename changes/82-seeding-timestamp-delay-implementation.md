# Seeding Timestamp Delay Implementation

## Changes Made

Updated the database seeding service to implement a 0.01 second (10ms) delay between each data insert operation, ensuring that each record receives a unique `createdAt` timestamp.

### Files Modified

- `src/shared/services/seed.service.ts` - Added delay functionality and converted bulk operations to individual inserts

### Key Changes

1. **Added Delay Utility Method**

   - Implemented `delay(ms: number = 10)` method that creates a 10ms pause between operations
   - Uses Promise-based setTimeout to provide non-blocking delays

2. **Converted Bulk Operations to Individual Inserts**

   - Replaced all `bulkCreate()` operations with individual `create()` operations in loops
   - Added delay call after each record insertion
   - Maintained transaction context for data consistency

3. **Updated All Seeding Methods**
   - `seedUsers()` - Users now inserted one by one with delays
   - `seedBlogData()` - Blog categories and posts with individual timing
   - `seedBrandedData()` - Product categories and items with delays
   - `seedMoviesData()` - Movie genres and movies with timing
   - `seedRentalData()` - Rental types and transportations with delays
   - `seedRoomData()` - Room types and lodgings with timing
   - `seedNewsData()` - News categories and articles with delays
   - `seedCareerData()` - Career companies and jobs with timing
   - `seedRestaurantData()` - Restaurant categories and cuisines with delays
   - `seedAnimeData()` - Anime records with individual timing

## Pros and Cons

### Pros

- **Unique Timestamps**: Each record now has a distinct `createdAt` timestamp
- **Data Ordering**: Records are inserted in predictable chronological order
- **Better Data Analysis**: Enables time-based sorting and filtering in applications
- **Audit Trail**: Clear creation sequence for debugging and data verification
- **Transaction Safety**: Maintains transactional integrity while adding delays

### Cons

- **Slower Seeding**: Seeding process now takes significantly longer (10ms per record)
- **Performance Impact**: Large datasets will require substantially more time to seed
- **Resource Usage**: Individual queries consume more database connections and resources
- **Memory Overhead**: Longer-running transactions may impact database performance

## Known Issues

Currently no known issues with this implementation.

## Performance Impact

- **Previous**: Bulk inserts completed in milliseconds
- **Current**: Each record adds 10ms delay (e.g., 100 records = minimum 1 second)
- **Recommendation**: Consider using this approach only when timestamp uniqueness is critical

## Usage Notes

The delay is automatically applied during normal seeding operations:

- `npm run seed` - Uses individual inserts with delays
- `npm run seed:undo` - Clearing operations remain unchanged (no delays needed)

---

## Git Commit Message

```
feat(seed): implement 0.01s delay between data inserts

• add delay utility method for 10ms pauses between operations
• convert all bulkCreate operations to individual create loops
• ensure unique createdAt timestamps for each seeded record
• maintain transaction context throughout delayed operations
• update all seeding methods across all features

BREAKING CHANGE: seeding process now takes significantly longer due to individual record insertion with delays
```
