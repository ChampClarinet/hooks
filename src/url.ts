import { useLocation, useNavigate } from "react-router-dom";

/**
 * Extracts query parameters from the current URL.
 * @param params Array of parameter names to extract
 * @returns Object containing the extracted query parameters
 */
export const useQueryParams = (params: string[]) => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  return params.reduce((result, param) => {
    result[param] = queryParams.get(param) ?? null;
    return result;
  }, {} as Record<string, string | null>);
};

/**
 * Returns a function to update query parameters in the current URL and navigate to the updated URL.
 * @returns Function to set query parameters
 */
export const useSetQueryParams = () => {
  const navigate = useNavigate();

  /**
   * Updates a query parameter in the current URL and navigates to the updated URL.
   * @param param The name of the query parameter to update
   * @param value The new value for the query parameter, or null to remove the parameter
   */
  const setQueryParam = (param: string, value: string | null) => {
    const queryParams = new URLSearchParams(window.location.search);
    queryParams.set(param, value ?? "null");
    const search = queryParams.toString();
    navigate({ search });
  };

  return setQueryParam;
};
