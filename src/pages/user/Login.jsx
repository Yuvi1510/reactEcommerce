import { useEffect, useState } from "react";
import baseApi from "../../js/BaseApi";

export default function Login(){
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

    const handleSubmit = async () =>{
        const res = await baseApi.post("/auth/login", data);
        localStorage.setItem("token", res.data.token);
        
    }

    return(
        <div className="h-[80vh] min-w-full flex items-center justify-center">
            <div className="border py-3 px-5 rounded-2xl">
                <h1 className="text-center text-2xl">Login</h1>
            <form className="flex flex-col items-center" action="">
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