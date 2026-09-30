/**
 * A single photo in the library.
 *
 * `id` is a picsum.photos seed, so the same id always resolves to the same image
 * and can be used both in the URL (`/photos/:id`) and to build image URLs of any size.
 */
export interface Photo {
  id: string;
  /** Thumbnail URL used in grids. */
  url: string;
}
