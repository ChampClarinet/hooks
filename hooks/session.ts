import { useMyUser } from "@/queries/my-user";
import { useToken } from "./token";
import { useEffect, useMemo } from "react";
import { useAuthStore } from "@/stores/auth";

const overrideLogin = import.meta.env.VITE_OVERRIDE_LOGIN === "true";

export type SessionStatus =
  | "NO_SESSION"
  | "AUTHENTICATING"
  | "AUTHENTICATED"
  | "FORCED_AUTHENTICATED";

export const useSession = () => {
  const { token } = useToken();

  const kickUserOut = useAuthStore((state) => state.kickUserOut);

  const { loading: myUserLoading, user, refetch: fetchMyUser } = useMyUser();

  const status = useMemo((): SessionStatus => {
    if (overrideLogin) return "FORCED_AUTHENTICATED";
    if (token == null) return "NO_SESSION";
    if (myUserLoading) return "AUTHENTICATING";
    return "AUTHENTICATED";
  }, [token, myUserLoading]);

  const isLoggedIn = useMemo(() => user != null, [user]);

  const isForcedLogIn = useMemo(
    () => !isLoggedIn && status === "FORCED_AUTHENTICATED",
    [isLoggedIn, status]
  );

  const isAdmin = useMemo(
    () => !!user?.is_staff || overrideLogin,
    [user?.is_staff]
  );

  useEffect(() => {
    if (token == null) kickUserOut();
  }, [token]);

  useEffect(() => {
    if (token != null && user == null && !overrideLogin) {
      fetchMyUser();
    }
  }, [token, fetchMyUser, user]);

  const returnData = {
    user,
    token,
    isLoggedIn,
    status,
    isAdmin,
    isForcedLogIn,
  };
  return returnData;
};
