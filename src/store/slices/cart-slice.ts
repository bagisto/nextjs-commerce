import { AddressDataTypes } from "@/types/types";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export interface Cart {
  id: number;
  itemsQty: number;
  taxAmount: number;
  shippingAmount: number;
  grandTotal: number;
  items: any;
  paymentMethod: string;
  paymentMethodTitle: string;
  shippingMethod: string;
  selectedShippingRate: string;
  selectedShippingRateTitle: string;
}

interface CartState {
  cart?: Cart;
  billingAddress: AddressDataTypes | null;
  shippingAddress: AddressDataTypes | null;
}

const initialState: CartState = {
  cart: undefined,
  billingAddress: null,
  shippingAddress: null,
};

const cartSlice = createSlice({
  name: "cartDetail",
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<Cart>) => {
      state.cart = { ...action.payload };
    },
    updateCart: (state, action: PayloadAction<Partial<Cart>>) => {
      if (state.cart) {
        state.cart = { ...state.cart, ...action.payload };
      } else {
        state.cart = action.payload as Cart;
      }
    },
    clearCart(state) {
      state.cart = undefined;
      state.billingAddress = null;
      state.shippingAddress = null;
    },

    setBillingAddress(state, action: PayloadAction<AddressDataTypes>) {
      state.billingAddress = action.payload;
    },
    clearBillingAddress(state) {
      state.billingAddress = null;
    },

    setShippingAddress(state, action: PayloadAction<AddressDataTypes>) {
      state.shippingAddress = action.payload;
    },
    clearShippingAddress(state) {
      state.shippingAddress = null;
    },

    setCheckoutAddresses(
      state,
      action: PayloadAction<{
        billing: AddressDataTypes;
        shipping: AddressDataTypes;
      }>
    ) {
      state.billingAddress = action.payload.billing;
      state.shippingAddress = action.payload.shipping;
    },

    resetAddressStep(_state) {
    },

    resetShippingStep(_state) {
    },

  },
});

export const {
  addItem,
  updateCart,
  clearCart,
  setBillingAddress,
  clearBillingAddress,
  setShippingAddress,
  clearShippingAddress,
  setCheckoutAddresses,
  resetAddressStep,
  resetShippingStep,
} = cartSlice.actions;

export default cartSlice.reducer;
