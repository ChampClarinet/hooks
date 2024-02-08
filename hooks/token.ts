import { useAuthStore } from "@/stores/auth";

export const useToken = () => {
  const token = useAuthStore((state) => state.token);

  return {
    token,
  };
};
