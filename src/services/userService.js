import baseApi from "../js/BaseApi";

export const getUser = () => {
    return baseApi.get("/users/me");
};

export const registerUser = (userData) => {
    return baseApi.post("/users/register", userData);
}