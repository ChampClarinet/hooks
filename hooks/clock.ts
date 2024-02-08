import { useEffect, useState } from "react";
import MyCalendar from "@/utils/calendar";

export const useClock = () => {
  const [currentTime, setCurrentTime] = useState(new MyCalendar());

  useEffect(() => {
    const intId = setInterval(() => setCurrentTime(new MyCalendar()), 1000);
    return () => {
      clearInterval(intId);
    };
  }, []);

  return currentTime;
};
