import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, MapPin, Phone, User, ArrowLeft } from "lucide-react";

export default function AddressContact() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    city: "",
    address: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/payment");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-emerald-50/30 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-3xl mx-auto">
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center text-zinc-500 hover:text-emerald-600 mb-8 transition-colors font-medium"
        >
          <ArrowLeft className="w-5 h-5 mr-2" /> Back to Cart
        </button>

        <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 md:p-12 border border-zinc-100 relative overflow-hidden">
          {/* Progress Bar */}
          <div className="absolute top-0 left-0 w-full h-1 bg-zinc-100">
            <div className="h-full bg-emerald-500 w-1/2 rounded-r-full"></div>
          </div>

          <div className="mb-10 text-center">
            <h1 className="text-3xl font-extrabold text-zinc-900 mb-3 tracking-tight">Shipping Details</h1>
            <p className="text-zinc-500">Please enter your contact and delivery information.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-zinc-700 flex items-center gap-2">
                  <User className="w-4 h-4 text-emerald-600" /> Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all bg-zinc-50 focus:bg-white"
                  placeholder="John Doe"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-zinc-700 flex items-center gap-2">
                  <Phone className="w-4 h-4 text-emerald-600" /> Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all bg-zinc-50 focus:bg-white"
                  placeholder="98xxxxxxxx"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-zinc-700 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-600" /> City
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all bg-zinc-50 focus:bg-white"
                placeholder="Kathmandu"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-zinc-700 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-600" /> Specific Address
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                rows="3"
                className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all bg-zinc-50 focus:bg-white resize-none"
                placeholder="Street name, landmark, building..."
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full mt-8 flex items-center justify-center gap-2 bg-zinc-900 hover:bg-emerald-600 text-white font-bold py-4 px-6 rounded-xl transition-colors duration-300 shadow-md active:scale-95"
            >
              Continue to Payment <ArrowRight className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
