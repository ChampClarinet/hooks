import { useEffect, useState } from "react";

/**
 * Custom hook to get the current time.
 * @returns {Date} The current time.
 */
export const useClock = (): Date => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const intId = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => {
      clearInterval(intId);
    };
  }, []);

  return currentTime;
};
