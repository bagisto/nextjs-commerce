import { PayloadAction, createSlice } from "@reduxjs/toolkit";

import { BagistoCart } from "@/lib/bagisto/types";

// Define the shape of our cart state
export interface CartState {
  cart?: BagistoCart;
}
// Initial state for the cart
const initialState: CartState = {
  cart: undefined,
};
const cartSlice = createSlice({
  name: "cartDetail", // name of this slice
  initialState,
  reducers: {
    // Add a new item to the cart
    addItem: (state, action: PayloadAction<BagistoCart>) => {
      state.cart = { ...action.payload };
    },

    clearCart: (state) => {
      state.cart = undefined;
    },
  },
});

// Export the actions (functions you call in components)
export const { addItem, clearCart } = cartSlice.actions;

// Export the reducer so the store can use it
export default cartSlice.reducer;
