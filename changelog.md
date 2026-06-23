# Change Log

## [2.3.0] - 2026-06-23

### Added

* Redesigned customer account area with a sidebar and slide-in drawers.
* Added inline profile editing.
* Added dedicated account, cart, and category routes.
* Added breadcrumb navigation across account and catalog pages.
* Added wishlist and compare actions on product cards.
* Added mobile compare and navigation headers.
* Added client-side caching for wishlist and compare actions.
* Added reusable hooks for cart, checkout, profile, variants, media queries, and more.
* Added empty state for product reviews.
* Added EditorConfig, Husky, lint-staged, `typecheck` script, and `lucide-react`.

### Changed

* Reorganized GraphQL operations into queries, mutations, and fragments.
* Consolidated providers into `GlobalProviders`, `ReduxProvider`, `NextAuthProvider`, and `SessionManager`.
* Moved hooks to `utils/hooks`.
* Standardized typography and improved type safety.
* Refactored project structure for better maintainability.

### Fixed

* Fixed mobile filter, sort, and breadcrumb UI issues.
* Fixed cart, account, and category UI inconsistencies.
* Fixed sign-in page, toast styling, image carousel, and loading skeleton issues.
* Resolved responsive layout and alignment issues.

### Removed

* Removed custom SVG icon components in favor of `lucide-react`.
* Removed legacy `context/` and `lib/graphql-client` modules.
* Removed ESLint from the build process.


## [2.2.0] - 2025-09-09

### Added

- Added `BAGISTO_SESSION` key.
- Added `NEXTAUTH_URL` key.
- Added `NEXTAUTH_SECRET` key.
- Added `REVALIDATION_DURATION` key.
- Added `IMAGE_DOMAIN` key.
- Added the new the query field.
- Added the Authentication pages (Sign Up, Sign In and Forget Password).
- Added Customer Checkout.
- Added more banner on the home page.
- Added the pagination and Product Attributes.


### Removed

- Removed `BAGISTO_PROTOCOL` key.
- Removed `BAGISTO_STOREFRONT_ACCESS_TOKEN` key.
- Removed `BAGISTO_REVALIDATION_SECRET` key.

### Changed

- Updated the latest changes of the UI.
- Manged the state with Redux.

### Fixed

- Resolved the UI issues.
- Improved performance.
- Made compatible with the latest Bagisto APIs (version 2.3.0).

## [2.1.0] - 2025-02-24

### Added

- Added `BAGISTO_PROTOCOL` key.
- Added the new the query field.

### Changed

- Replaced NextUI with HeroUI.
- Updated the latest changes of the Next Commerce theme.

### Fixed

- Resolved login issue with OAuth.
- Improved performance for large images.
- Made compatible with the latest Bagisto APIs (version 2.2.3).

## [2.0.0] - 2024-06-06

### Added

- Added the NextUI.

### Changed

- Updated the query field.
- Modified the `.env.example` file to reflect correct environment variable usage.

### Fixed

- Made compatible with Bagisto APIs when using the Next Commerce theme.

## [1.0.0] - 2024-04-03

### Changed

- Made compatible with Next Commerce v2.
