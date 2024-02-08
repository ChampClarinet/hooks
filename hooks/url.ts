import { useLocation, useNavigate } from "react-router-dom";

/**
 * @returns Object that fields are keys from parameter array and values are value from each key's query
 */
export const useQueryParams = (params: string[]) => {
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);

  const result: any = params.reduce(
    (obj, param) => ({
      ...obj,
      [param]: queryParams.get(param) ?? null,
    }),
    {}
  );

  return result;
};

export const useSetQueryParams = () => {
  const navigate = useNavigate();

  const setQueryParam = (param: string, value: string | null) => {
    const queryParams = new URLSearchParams(window.location.search);
    queryParams.set(param, value ?? "null");
    const search = queryParams.toString();
    navigate({ search });
  };

  return setQueryParam;
};
