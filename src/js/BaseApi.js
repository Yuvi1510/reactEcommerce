import axios from "axios";


const baseApi = axios.create({
    baseURL: "http://localhost:8082",
    timeout: 5000,
    headers: {
        "Content-Type": "application/json"
    }
});

baseApi.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");

    if(token){
        config.headers["Authorization"] = `Bearer ${token}`;
    }

    return config;
});


export default baseApi;