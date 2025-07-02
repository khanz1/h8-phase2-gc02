# Copy data Directory to dist on Build & Update tsconfig

## What was changed

- Updated `tsconfig.json` to add the `@/data/*` path alias for clean imports.
- Modified the `build` script in `package.json` to copy the `src/data` directory to `dist/data` after TypeScript compilation.

## Pros

- Ensures all JSON/static data files are available in the build output (`dist`), preventing runtime errors when accessing data assets.
- Keeps path aliases consistent and clean for both source and build environments.
- No need for manual copying or extra scripts; handled automatically on build.

## Cons

- The `cp -r` command is Unix-specific and may not work natively on Windows (use `xcopy` or a cross-platform tool if Windows support is needed).
- Slightly increases build time due to the copy operation (negligible for small data sets).

## Remaining Issues / Bugs

- None identified. If you use Windows, consider replacing `cp -r` with a cross-platform solution like `cpx` or `copyfiles` npm package.

## Technical Details

- `tsconfig.json` now includes:
  ```json
  "paths": {
    ...
    "@/data/*": ["data/*"]
  }
  ```
- `package.json` build script:
  ```json
  "build": "tsc && tsc-alias && cp -r src/data dist/"
  ```
- After running `npm run build`, all files from `src/data` are available in `dist/data`.

## Files Changed

- `tsconfig.json`
- `package.json`

## Commit Message

```
chore(build): copy data directory to dist and update tsconfig alias

- Add @/data/* path alias to tsconfig for clean imports
- Update build script to copy src/data to dist/data after compilation
- Ensures JSON/static data is available in production build
```
