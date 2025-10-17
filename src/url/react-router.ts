import { useLocation, useNavigate } from "react-router-dom";

/** Extract selected params via React Router */
export function useQueryParams(params: string[]): Record<string, string | null> {
  const location = useLocation();
  const sp = new URLSearchParams(location.search);
  return params.reduce<Record<string, string | null>>((acc, k) => {
    acc[k] = sp.get(k);
    return acc;
  }, {});
}

/** Update/remove a single query param via React Router */
export function useSetQueryParam(): (key: string, value: string | null) => void {
  const navigate = useNavigate();
  const location = useLocation();

  return (key, value) => {
    const sp = new URLSearchParams(location.search);
    if (value == null || value === "") sp.delete(key);
    else sp.set(key, value);

    const search = sp.toString();
    navigate({ search: search ? `?${search}` : "" }, { replace: true });
  };
}
