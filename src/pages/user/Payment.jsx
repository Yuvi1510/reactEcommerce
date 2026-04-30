import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle2, ShieldCheck, CreditCard } from "lucide-react";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

export default function Payment() {
  const navigate = useNavigate();
  const [selectedMethod, setSelectedMethod] = useState("");
  const orderItems = useSelector((state) => state.order.orderItems);

  const handlePayment = () => {
    if (!selectedMethod) {
      toast.error("Please select a payment method");
      return;
    }
    // Simulate API call for payment/order placement
    toast.success("Order placed successfully!");
    console.log(orderItems);
    navigate("/"); // Redirect to home or order success page
  };

  const paymentMethods = [
    {
      id: "esewa",
      name: "eSewa",
      description: "Pay via eSewa digital wallet",
      color: "border-green-500",
      bgColor: "bg-green-50",
      logo: "https://upload.wikimedia.org/wikipedia/commons/f/f2/Esewa_logo.webp" // Example public logo
    },
    {
      id: "khalti",
      name: "Khalti",
      description: "Pay via Khalti digital wallet",
      color: "border-purple-500",
      bgColor: "bg-purple-50",
      logo: "https://upload.wikimedia.org/wikipedia/commons/e/ee/Khalti_Digital_Wallet_Logo.png.jpg"
    },
    {
      id: "mobile_banking",
      name: "Mobile Banking",
      description: "Pay via your Mobile Banking app",
      color: "border-blue-500",
      bgColor: "bg-blue-50",
      icon: <CreditCard className="w-10 h-10 text-blue-600" />
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-emerald-50/30 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-3xl mx-auto">
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center text-zinc-500 hover:text-emerald-600 mb-8 transition-colors font-medium"
        >
          <ArrowLeft className="w-5 h-5 mr-2" /> Back to Shipping
        </button>

        <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 md:p-12 border border-zinc-100 relative overflow-hidden">
          {/* Progress Bar */}
          <div className="absolute top-0 left-0 w-full h-1 bg-zinc-100">
            <div className="h-full bg-emerald-500 w-full rounded-r-full"></div>
          </div>

          <div className="mb-10 text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-emerald-100 p-3 rounded-full">
                <ShieldCheck className="w-8 h-8 text-emerald-600" />
              </div>
            </div>
            <h1 className="text-3xl font-extrabold text-zinc-900 mb-3 tracking-tight">Select Payment Method</h1>
            <p className="text-zinc-500">Choose how you want to pay for your order.</p>
          </div>

          <div className="space-y-4">
            {paymentMethods.map((method) => (
              <div
                key={method.id}
                onClick={() => setSelectedMethod(method.id)}
                className={`relative flex items-center p-6 rounded-2xl cursor-pointer transition-all duration-300 border-2 ${
                  selectedMethod === method.id 
                    ? `${method.color} ${method.bgColor} shadow-md transform scale-[1.02]` 
                    : "border-zinc-200 hover:border-zinc-300 bg-white hover:bg-zinc-50"
                }`}
              >
                <div className="w-16 h-16 flex items-center justify-center bg-white rounded-xl shadow-sm border border-zinc-100 mr-6 overflow-hidden p-2 shrink-0">
                  {method.logo ? (
                    <img src={method.logo} alt={method.name} className="object-contain w-full h-full" />
                  ) : (
                    method.icon
                  )}
                </div>
                
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-zinc-900 mb-1">{method.name}</h3>
                  <p className="text-zinc-500 text-sm">{method.description}</p>
                </div>

                {selectedMethod === method.id && (
                  <div className="absolute right-6">
                    <CheckCircle2 className="w-8 h-8 text-emerald-500 drop-shadow-sm" />
                  </div>
                )}
              </div>
            ))}
          </div>

          <button
            onClick={handlePayment}
            className={`w-full mt-10 flex items-center justify-center gap-2 font-bold py-4 px-6 rounded-xl transition-all duration-300 shadow-md ${
              selectedMethod 
                ? "bg-zinc-900 hover:bg-emerald-600 text-white active:scale-95" 
                : "bg-zinc-200 text-zinc-400 cursor-not-allowed"
            }`}
            disabled={!selectedMethod}
          >
            Confirm & Pay {selectedMethod ? `with ${paymentMethods.find(m => m.id === selectedMethod)?.name}` : ""}
          </button>
        </div>
      </div>
    </div>
  );
}
