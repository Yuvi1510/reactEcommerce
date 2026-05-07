import { useState } from "react";
import baseApi from "../../js/BaseApi";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginSuccess } from "../../js/authSlice";

export default function StoreRegister() {

    const {user} = useSelector(state => state.auth);

    const navigate = useNavigate();

    const [data, setData] = useState({
        name: "",
        email: "",
        phone: ""
    });

    const [error, setError] = useState({
        name: "",
        email: "",
        phone: ""
    });

    // Handle input change
    const handleChange = (e) => {
        const { name, value } = e.target;

        setData({
            ...data,
            [name]: value
        });

        // simple validation
        if (value.trim() === "") {
            setError({
                ...error,
                [name]: `${name} is required`
            });
        } else {
            setError({
                ...error,
                [name]: ""
            });
        }
    };

    // Handle submit
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!data.name || !data.email || !data.phone) {
            toast.error("All fields are required", {
    autoClose: 1000 // 1 second
});
            return;
        }

        try {
            const res = await baseApi.post("/stores", data);

            const userRes = await baseApi.get(`/users/${user.userId}`);
            
            useDispatch(loginSuccess({
                user: userRes.data,
                token: localStorage.getItem("token")
            }));

            toast.success("store registration successful", {
    autoClose: 1000 // 1 second
});
            navigate("/vendor");
        } catch (error) {
            const message =
                error?.response?.data?.message || "Something went wrong";
            toast.error(message, {
    autoClose: 1000 // 1 second
});
        }
    };

    return (
        <div className="h-[80vh] flex items-center justify-center">
            <div className="border p-6 rounded-2xl w-[320px]">
                <h1 className="text-2xl text-center mb-4">Register Store</h1>

                <form onSubmit={handleSubmit} className="flex flex-col">

                    {/* Name */}
                    <input
                        type="text"
                        name="name"
                        placeholder="Store Name"
                        className="p-2 border rounded-xl mb-2"
                        onChange={handleChange}
                    />
                    {error.name && <span className="text-red-500 text-sm">{error.name}</span>}

                    {/* Email */}
                    <input
                        type="email"
                        name="email"
                        placeholder="Store Email"
                        className="p-2 border rounded-xl mt-3 mb-2"
                        onChange={handleChange}
                    />
                    {error.email && <span className="text-red-500 text-sm">{error.email}</span>}

                    {/* Phone */}
                    <input
                        type="text"
                        name="phone"
                        placeholder="Phone Number"
                        className="p-2 border rounded-xl mt-3 mb-2"
                        onChange={handleChange}
                    />
                    {error.phone && <span className="text-red-500 text-sm">{error.phone}</span>}

                    <button
                        type="submit"
                        className="bg-emerald-500 text-white rounded-xl py-2 mt-4"
                    >
                        Register Store
                    </button>
                </form>
            </div>
        </div>
    );
}