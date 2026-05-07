import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: JSON.parse(localStorage.getItem("user")) || null,
    token: localStorage.getItem("token") || null,
    isLoggedIn: !!localStorage.getItem("token"),
};

const authSlice = createSlice({
    name: "auth",
    initialState,

    reducers: {
        loginSuccess: (state, action) => {
            console.log("loginSuccess", action.payload);

            state.user = action.payload.user;
            state.token = action.payload.token;
            state.isLoggedIn = true;

            // Store separately
            localStorage.setItem(
                "user",
                JSON.stringify(action.payload.user)
            );

            localStorage.setItem(
                "token",
                action.payload.token
            );
        },

        logout: (state) => {
            state.user = null;
            state.token = null;
            state.isLoggedIn = false;

            // Remove separately
            localStorage.removeItem("user");
            localStorage.removeItem("token");
        },

        setUser: (state, action) => {
            state.user = action.payload;

            localStorage.setItem(
                "user",
                JSON.stringify(action.payload)
            );
        }
    }
});

export const { loginSuccess, logout, setUser } = authSlice.actions;

export default authSlice.reducer;