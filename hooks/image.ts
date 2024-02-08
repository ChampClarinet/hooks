import { useCallback, useEffect, useState } from "react";
import axios from 'axios';

export interface UseImage {
  src: string;
}
/**
 * This hook fetches image from url as blob
 */
export const useImage = (options: UseImage) => {
  const {
    src,
  } = options;

  const [imageUrl, setImageUrl] = useState<null | string>(null);

  const handleFetchImage = useCallback(async (src: string) => {
    if (src.length) {
      try {
        const response = await axios.get(src, { responseType: "blob" });
        const url = URL.createObjectURL(response.data);
        setImageUrl(url);
      } catch (error) {
        console.error(error);
      }
    }
  }, []);

  useEffect(() => {
    handleFetchImage(src);
  }, [handleFetchImage, src]);

  return imageUrl;
}