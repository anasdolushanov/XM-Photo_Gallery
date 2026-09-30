# Photo Library

An Angular photo library with an infinite random photo stream and a persistent "Favorites" collection.

- **Photos** (`/`): infinite, scrollable stream of random photos. Clicking a photo adds it to Favorites.
- **Favorites** (`/favorites`): all saved photos. Clicking one opens its single photo page. Favorites survive a page refresh.
- **Single photo** (`/photos/:id`): one full-screen photo with a "Remove from favorites" button.

Built with Angular 16, Angular Material and SCSS. There is no backend: images come from [picsum.photos](https://picsum.photos), and favorites are stored in `localStorage`.

## Getting started

Requirements: Node.js 18+ and npm.

```bash
npm install
npm start            # dev server at http://localhost:4200
```

| Command | What it does |
| --- | --- |
| `npm start` | Runs the dev server with live reload |
| `npm test` | Runs the unit tests (Karma + Jasmine) in watch mode |
| `npx ng test --watch=false --browsers=ChromeHeadless` | Runs the unit tests once, headless (CI) |
| `npm run build` | Builds for production into `dist/gallery-template` |

## Project structure

```
src/app
├── core/                          # App-wide singletons, no UI
│   ├── models/photo.model.ts
│   ├── services/photo.service.ts      # Emulated photo API (random 200-300ms latency)
│   ├── services/favorites.service.ts  # Favorites state, persisted to Web Storage
│   └── tokens/storage.token.ts        # Injectable Storage (localStorage by default)
├── shared/                        # Reusable, presentational building blocks
│   ├── components/header/             # Navigation, highlights the active view
│   ├── components/photo-grid/         # Responsive thumbnail grid, emits clicks
│   ├── components/loader/             # Spinner + "Loading..."
│   ├── directives/infinite-scroll.directive.ts
│   └── shared.module.ts
├── features/                      # One lazy-loaded module per route
│   ├── photos/                        # "/"
│   ├── favorites/                     # "/favorites"
│   └── photo-detail/                  # "/photos/:id"
├── app-routing.module.ts
└── app.component.*                # Shell: header + router outlet
src/testing/                       # Test helpers (fake IntersectionObserver, in-memory Storage)
```

## Design notes

- **Infinite scroll without a library.** `InfiniteScrollDirective` watches an invisible "sentinel" element under the grid with an `IntersectionObserver`. When the sentinel comes within 200px of the viewport, the directive emits `scrolled`. It stays silent while a page is loading. When loading finishes it re-observes the sentinel, so if the new photos still don't fill the screen, the next page loads automatically.
- **Emulated API.** `PhotoService.getRandomPhotos()` returns an `Observable` that emits a batch of random photos after a random 200-300ms delay, like an HTTP call. Photo ids are random picsum *seeds*, so a given id always resolves to the same image. That makes `/photos/:id` a stable, shareable URL.
- **Fast single photo page.** Full-size photos keep the thumbnail's 2:3 crop, so the thumbnail (already in the browser cache from the grid) appears instantly, blurred, as a placeholder. The sharp image fades in over it once it arrives. The browser picks a right-sized variant from `srcset` (600×900 or 1000×1500) instead of a fixed 1200×1200. On the favorites page, hovering or focusing a photo starts the full-size download before the click.
- **Favorites persistence.** `FavoritesService` keeps the list in a `BehaviorSubject` and writes it to `localStorage` on every change. On startup it validates the stored data and drops anything malformed, so corrupted storage or an exceeded quota never breaks the app.
- **Separation of concerns.** Pages are thin "smart" components that talk to services. The grid, loader and header are presentational and reusable. Storage is injected through a token, so tests use an in-memory implementation.

## Testing

Unit tests cover the services (latency bounds, persistence, corrupted storage), the infinite-scroll directive (with a controllable fake `IntersectionObserver`), every component, and routing through the real lazy-loaded route config.
