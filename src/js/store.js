import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./cartSlice";
import orderReducer from "./OrderSlice";

export const store = configureStore({
    reducer: {
        cart: cartReducer,    order: orderReducer,
    
    }
})