import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { BagistoUser } from "@/types/types";
import { CustomerProfile } from "@/types/customer/type";

interface UserState {
    user: BagistoUser | CustomerProfile | null;
    isAuthenticated: boolean;
}

const initialState: UserState = {
    user: null,
    isAuthenticated: false,
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<BagistoUser | CustomerProfile>) => {
            state.user = action.payload;
            state.isAuthenticated = true;
        },
        clearUser: (state) => {
            state.user = null;
            state.isAuthenticated = false;
        },
    },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
