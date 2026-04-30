import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    items: [],
}

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        setCartItems: (state, action) => {
            state.items = action.payload;
        },
        addToCart: (state, action) => {
            const existing = state.items.find(
                item => item.productId === action.payload.productId
            );

            if (existing) {
                existing.quantity += 1;
            } else {
                state.items.push({ ...action.payload, quantity: 1 });
            }
},
        removeFromCart: (state, action) => {
            state.items = state.items.filter((item) => item.productId !== action.payload);
        },
        clearCart: (state) => {
            state.items = [];
        },
    }
});

export const { addToCart, removeFromCart, clearCart, setCartItems } = cartSlice.actions;
export default cartSlice.reducer;