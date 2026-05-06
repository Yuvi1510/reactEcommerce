import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./cartSlice";
import orderReducer from "./OrderSlice";
import authReducer from "./authSlice";

export const store = configureStore({
    reducer: {
        cart: cartReducer,    
        order: orderReducer,    
        auth: authReducer,
    }
})