import { configureStore } from "@reduxjs/toolkit";

import cartSlice from "./slices/cart-slice";

export const store = configureStore({
  reducer: {
    cartDetail: cartSlice,
  },
});

// These are helper types for TypeScript (so hooks know what types to expect)
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
