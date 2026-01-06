import { AddressDataTypes } from "@/types/types";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export interface Cart {
  id: number;
  itemsQty: number;
  taxAmount: number;
  shippingAmount: number;
  grandTotal: number;
  items: any;
  paymentMethod : string ;
  paymentMethodTitle : string ; 
  shippingMethod : string ;
  selectedShippingRate : string;
  selectedShippingRateTitle : string;
}
export interface SelectedPayment {
  method: string;
  methodTitle?: string;
}


interface SelectedShippingRate {
  method: string;
  methodDescription?: string;
  methodPrice?: string;
}

// Define the shape of our cart state
interface CartState {
  cart?: Cart;
  selectedShippingRate: SelectedShippingRate | null;
  selectedPayment: SelectedPayment | null;
  billingAddress: AddressDataTypes | null;
  shippingAddress: AddressDataTypes | null;
}
// Initial state for the cart
const initialState: CartState = {
  cart: undefined,
  selectedShippingRate: null,
  selectedPayment: null,
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
    clearCart(state) {
      state.cart = undefined;
      state.billingAddress = null;
      state.shippingAddress = null;
      state.selectedShippingRate = null;
      state.selectedPayment = null;
    },

    /** ADDRESSES */
    setBillingAddress(
      state,
      action: PayloadAction<AddressDataTypes>
    ) {
      state.billingAddress = action.payload;
    },
    clearBillingAddress(state) {
      state.billingAddress = null;
    },

    setShippingAddress(
      state,
      action: PayloadAction<AddressDataTypes>
    ) {
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

    /** SHIPPING */
    setSelectedShippingRate(
      state,
      action: PayloadAction<SelectedShippingRate>
    ) {
      state.selectedShippingRate = action.payload;
    },
    clearSelectedShipping(state) {
      state.selectedShippingRate = null;
    },

    /** PAYMENT */
    setSelectedPayment(state, action: PayloadAction<SelectedPayment>) {
      state.selectedPayment = action.payload;
    },
    clearSelectedPayment(state) {
      state.selectedPayment = null;
    },


  },
});

// Export the actions (functions you call in components)
export const {
  addItem,
  clearCart,
  setSelectedShippingRate,
  setSelectedPayment,
  clearSelectedShipping,
  clearSelectedPayment,
  setBillingAddress,
  clearBillingAddress,
  setShippingAddress,
  clearShippingAddress,
  setCheckoutAddresses,
} = cartSlice.actions;

// Export the reducer so the store can use it
export default cartSlice.reducer;
