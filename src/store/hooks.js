/** Typed-style aliases for react-redux's hooks, so components import dispatch and selectors from the store rather than from the library. */
import { useDispatch, useSelector } from "react-redux";

export const useAppDispatch = () => useDispatch();
export const useAppSelector = useSelector;
