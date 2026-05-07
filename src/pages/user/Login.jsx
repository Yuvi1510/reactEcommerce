import { useEffect, useState } from "react";
import baseApi from "../../js/BaseApi";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setCartItems } from "../../js/cartSlice";
import { setOrderItems } from "../../js/OrderSlice";
import { loginSuccess } from "../../js/authSlice";

export default function Login(){
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [data, setData] = useState({
        "email": "",
        "password": ""
    });

    const handleChange = (e) =>{
        setData({
            ...data,
            [e.target.name] : e.target.value
        });
    }

    const handleSubmit = async (e) =>{
        e.preventDefault();
       
        try{
             const res = await baseApi.post("/auth/login", data);
        console.log(res);
        localStorage.setItem("token", res.data.token);
            dispatch(loginSuccess({
                user: res.data.user,
                token: res.data.token
            }));
        // Fetch cart items immediately to update navbar
        try {
            const cartRes = await baseApi.get("/cart");
            dispatch(setCartItems(cartRes.data));
            dispatch(setOrderItems(cartRes.data));
        } catch (err) {
            console.log("Failed to fetch cart on login:", err);
        }
        // console.log(useSelector(state => state.auth.isLoggedIn));
        navigate("/");
        toast.success("Login successful", {
    autoClose: 1000 // 1 second
});
        }catch{
            toast.error("Invalid email or password", {
    autoClose: 1000 // 1 second
});
        }
        
    }

    return(
        <div className="h-[80vh] min-w-full flex items-center justify-center">
            <div className="border py-3 px-5 rounded-2xl">
                <h1 className="text-center text-2xl">Login</h1>
            <form onSubmit={handleSubmit} className="flex flex-col items-center" action="">
                <div className="my-3">
                    <input onChange={handleChange} name="email" className="w-[250px] p-2 border rounded-2xl" type="text" placeholder="Email..." value={data.email} />
                </div>
                <div className="my-3">
                    <input onChange={handleChange} name="password" className="w-[250px] p-2 border rounded-2xl" type="password" placeholder="Password..." value={data.password} />
                </div>
                <div>
                    <button className='bg-emerald-300 border-2 border-white rounded-xl py-2 px-4 ' type="submit">Login</button>
                </div>
            </form>
            <a href="/register">Don't have an account? Register here.</a>
       
                
                </div>    
        </div>
    );
}