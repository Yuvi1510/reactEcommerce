import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    orderItems: [],
}

const orderSlice = createSlice({
    name: "order",
    initialState,
    reducers: {
        setOrderItems: (state, action) => {
            state.orderItems = action.payload;
        },
        addToOrderList: (state, action) => {
            const existing = state.orderItems.find(
                item => item.productId === action.payload.productId
            );

            if (existing) {
                existing.quantity += 1;
            } else {
                state.orderItems.push({ ...action.payload, quantity: 1 });
            }
        },
        removeFromOrderList: (state, action) => {
            state.orderItems = state.orderItems.filter((item) => item.productId !== action.payload);
        },
        clearOrderList: (state) => {
            state.orderItems = [];
        }
    }
});

export const { addToOrderList, setOrderItems, removeFromOrderList, clearOrderList } = orderSlice.actions;
export default orderSlice.reducer;