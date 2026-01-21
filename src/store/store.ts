import { configureStore } from "@reduxjs/toolkit";

import cartSlice from "./slices/cart-slice";
import userSlice from "./slices/user-slice";

export const store = configureStore({
  reducer: {
    cartDetail: cartSlice,
    user: userSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
