/** Keeps a tab choice in the URL's query string (e.g. `?mode=advanced`), falling back to a default that is left out of the URL. */
import { useSearchParams } from "react-router-dom";

export default function useSearchParamState(paramName, allowedValues, defaultValue) {
  const [searchParams, setSearchParams] = useSearchParams();
  const requested = searchParams.get(paramName);
  const value = allowedValues.includes(requested) ? requested : defaultValue;

  const setValue = (nextValue) =>
    setSearchParams(nextValue === defaultValue ? {} : { [paramName]: nextValue }, { replace: true });

  return [value, setValue];
}
