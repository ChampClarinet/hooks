import { useEffect, useState } from "react";

import axios from "axios";

/**
 * Configuration options for the {@link useImage} hook.
 * @interface UseImageOptions
 */
export interface UseImageOptions {
  /**
   * The source URL of the image to fetch.
   */
  src: string;
}
/**
 * A React hook that fetches an image from a remote URL and returns
 * a local object URL that can be used directly in `<img src={...} />`.
 *
 * It automatically cleans up object URLs to prevent memory leaks.
 *
 * @param {UseImageOptions} options - The image configuration options.
 * @returns {string | null} - A local object URL of the fetched image, or `null` if not yet available.
 *
 * @example
 * ```tsx
 * const imageUrl = useImage({ src: "https://example.com/photo.jpg" });
 *
 * return imageUrl ? <img src={imageUrl} alt="preview" /> : <p>Loading...</p>;
 * ```
 *
 * @remarks
 * - The image is fetched as a Blob using Axios.
 * - Automatically revokes object URLs when `src` changes or the component unmounts.
 * - Returns `null` until the image is successfully fetched.
 */
export function useImage({ src }: UseImageOptions): string | null {
  const [imgUrl, setImgUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!src) return;

    let activeUrl: string | null = null;

    const fetchImage = async () => {
      try {
        const response = await axios.get(src, { responseType: "blob" });
        const url = URL.createObjectURL(response.data);
        activeUrl = url;
        setImgUrl(url);
      } catch (error) {
        console.error("[useImage] Failed to load image:", error);
        setImgUrl(null);
      }
    };

    fetchImage();

    return () => {
      if (activeUrl) {
        URL.revokeObjectURL(activeUrl);
      }
    };
  }, [src]);

  return imgUrl;
}
