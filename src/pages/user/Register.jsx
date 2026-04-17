import { useState } from "react";
import baseApi from "../../js/BaseApi";
import { toast } from "react-toastify";

export default function Register(){

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
            const res = await baseApi.post("/users", dataToSent);
            navigate("/login");
        }catch(error){
            console.log(error);
            toast.error(error.response.data.message);
            
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