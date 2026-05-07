import { useState } from "react";
import baseApi from "../../js/BaseApi";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function Register(){

    const navigate = useNavigate();
    
    const [data, setData] = useState({
        firstName: "",
        lastName: "",
        dob: "",
        email: "",
        password: "",
        confirmPassword: ""
    });

    const [error, setError] = useState({
        firstName: "",
        lastName: "",
        dob: "",
        email: "",
        password: "",
        confirmPassword: ""
    });

    
    const handleChange = (e) => {
    const { name, value } = e.target;

    const updatedData = {
        ...data,
        [name]: value
    };

    setData(updatedData);

    if (updatedData.password !== updatedData.confirmPassword) {
        setError({
            ...error,
            confirmPassword: "Passwords do not match"
        });
    } else {
        setError({
            ...error,
            confirmPassword: ""
        });
    }
};

const handleSubmit = async (e) =>{
    e.preventDefault();
    if(data.password === data.confirmPassword){
        const dataToSent = {
            firstName: data.firstName,
            lastName: data.lastName,
            dob: data.dob,
            email: data.email,
            password: data.password
        };
        
        try{
            const res = await baseApi.post("/auth/register", dataToSent);
            console.log(res.data);
            navigate("/login");
            toast.success("Registration successful", {
    autoClose: 1000 // 1 second
});
        }catch(error){
            console.log(error);

    const message =
        error.response?.data?.message ||
        error.response?.data ||
        error.message ||
        "Registration failed";

    toast.error(message, {
    autoClose: 1000 // 1 second
});
        }
    }
}



    return(
       <div className="h-[80vh] min-w-full flex items-center justify-center">
            <div className="border py-3 px-5 rounded-2xl">
                <h1 className="text-center text-2xl">Register</h1>
            <form onSubmit={handleSubmit} className="flex flex-col items-center" action="">
                <div className="my-3">
                    <input name="firstName" onChange={handleChange} className="w-[250px] p-2 border rounded-2xl" type="text" placeholder="First Name..." />
                </div>
                <div className="my-3">
                    <input name="lastName" onChange={handleChange} className="w-[250px] p-2 border rounded-2xl" type="text" placeholder="Last Name..." />
                </div>
                <div className="my-3">
                    <input name="dob" onChange={handleChange} className="w-[250px] p-2 border rounded-2xl" type="date" placeholder="Date of birth" />
                </div>
                <div className="my-3">
                    <input name="email" onChange={handleChange} className="w-[250px] p-2 border rounded-2xl" type="email" placeholder="Email..." />
                </div>
                <div className="my-3">  
                    <input name="password" onChange={handleChange} className="w-[250px] p-2 border rounded-2xl" type="password" placeholder="Password..." />
                </div>
                <div className="my-3">
                    <input name="confirmPassword" onChange={handleChange} className="w-[250px] p-2 border rounded-2xl" type="password" placeholder="Confirm Password..." />
                    <div>
                        { error.confirmPassword && (
                            <span className="text-red-500">{error.confirmPassword}</span>
                        )}
                    </div>
                </div>  
                <div>
                    <button className='bg-emerald-300 border-2 border-white rounded-xl py-2 px-4 ' type="submit">Register</button>
                </div>
            </form>
            <a href="/login">Already have an account? Login here.</a>
       
                
                </div>    
        </div>
    );
}