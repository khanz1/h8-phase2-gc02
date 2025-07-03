# Indonesian User Identities Implementation

## Changes Made

### Updated User Seed Data

- **File Modified**: `src/shared/services/seed.service.ts`
- **Method Updated**: `createDefaultUsers()`
- **Lines Changed**: ~175-225

### What was Changed

- Replaced generic English names with authentic Indonesian names from various ethnic backgrounds
- Updated email addresses to use Indonesian domains (.co.id, .com)
- Changed phone numbers to Indonesian format (+62 country code)
- Updated addresses with real Indonesian street names and cities across Java
- Maintained role distribution: 2 Admins, 6 Staff, 2 Users

### User Details Updated

1. **Andi Prasetyo** (Admin) - Jakarta Pusat
2. **Sari Wijaya** (Staff) - Yogyakarta
3. **Budi Santoso** (Staff) - Bandung
4. **Dewi Lestari** (User) - Semarang
5. **Rudi Hermawan** (User) - Surabaya
6. **Maya Sari** (Staff) - Bandung
7. **Agus Wibowo** (Staff) - Jakarta Barat
8. **Indira Putri** (Admin) - Jakarta Pusat
9. **Farhan Alatas** (Staff) - Semarang
10. **Ratna Kusuma** (Staff) - Surabaya

## Pros and Cons

### Pros

- **Cultural Authenticity**: Realistic Indonesian identities for testing
- **Diverse Representation**: Names from various Indonesian ethnic backgrounds
- **Realistic Data**: Proper Indonesian phone numbers and addresses
- **Better Testing**: More realistic data for development and testing
- **Localization**: Supports Indonesian market context

### Cons

- **Privacy Sensitivity**: Using realistic names might raise privacy concerns
- **Maintenance**: Need to ensure fictional nature of identities
- **Regional Bias**: Focused mainly on Java island cities

## Technical Implementation

### Phone Number Format

- Used Indonesian country code (+62)
- Mobile numbers start with 8 (representing major operators)
- Total length: 13-14 digits including country code

### Address Format

- Indonesian street naming convention (Jl. = Jalan)
- Real city names and postal codes
- Proper administrative divisions (kelurahan, kecamatan, provinsi)

### Email Domains

- Indonesian domains: yahoo.co.id, outlook.co.id
- International domains: gmail.com
- Professional appearance with firstname.lastname format

## No Known Bugs

All user data follows proper validation:

- Username length and format requirements met
- Email format validation passed
- Phone number length appropriate
- Address fields properly formatted
- Role assignments maintained

## Git Commit Message

```
feat(seed): implement indonesian user identities

• replace generic english names with authentic indonesian names
• update phone numbers to indonesian format (+62)
• change email domains to indonesian providers
• update addresses with real indonesian cities and streets
• maintain proper role distribution across admin/staff/user
• ensure cultural authenticity for indonesian market context
```
