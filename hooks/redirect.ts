import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSession } from "./session";

export const useLoggedInRedirect = () => {
  const { isLoggedIn } = useSession();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn) navigate("/");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn]);
};

export const useNoLoggedInRedirect = () => {
  const { isLoggedIn, isForcedLogIn } = useSession();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn && !isForcedLogIn) navigate("/login");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn, isForcedLogIn]);
};
