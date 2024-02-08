import { useCallback, useEffect, useState } from "react";
import axios from "axios";

/**
 * Options for configuring the useImage hook.
 */
export interface UseImage {
  /**
   * The source URL of the image.
   */
  src: string;
}
/**
 * Custom hook to fetch an image and return its URL.
 * @param {UseImageOptions} options - The options to configure the hook.
 * @returns {string | null} The URL of the fetched image, or null if the image hasn't been fetched yet.
 */
export const useImage = (options: UseImage) => {
  const { src } = options;

  const [imgUrl, setImgUrl] = useState<string | null>(null);

  /**
   * Fetches the image from the specified source URL.
   * @param {string} src - The source URL of the image.
   */
  const handleFetchImage = useCallback(async (src: string) => {
    if (src.length) {
      try {
        const response = await axios.get(src, { responseType: "blob" });
        const url = URL.createObjectURL(response.data);
        setImgUrl(url);
      } catch (error) {
        console.error(error);
      }
    }
  }, []);

  useEffect(() => {
    handleFetchImage(src);
  }, [handleFetchImage, src]);

  return imgUrl;
};
