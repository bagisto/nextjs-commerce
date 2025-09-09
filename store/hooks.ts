import type { AppDispatch, RootState } from "./store";

import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

// Create a typed version of useDispatch
export const useAppDispatch = () => useDispatch<AppDispatch>();

// Create a typed version of useSelector
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
