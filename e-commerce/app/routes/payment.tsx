import { useEffect, useState } from "react";
import {  useNavigate } from "@remix-run/react";
import { toast } from "react-hot-toast";
import { useCartStore } from "~/store/cart";
import { trackEvent } from "~/utils/trackEvent";
import { useUserStore } from "~/store/user";
import { BsCreditCard2FrontFill, BsCashCoin } from "react-icons/bs";
import { FaCcVisa, FaCcMastercard } from "react-icons/fa";

export default function Payment() {
  const navigate = useNavigate();
  const { cartItems, clearCart, getTotalPrice } = useCartStore();
  const totalPrice = getTotalPrice();
  const email = useUserStore((state: any) => state.email);
  const sessionId = useUserStore((state: any) => state.sessionId);

  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);

  useEffect(() => {
    if (selectedMethod) {
      trackEvent({
        event_type: "payment_info_added",
        user_email: email,
        session_data: sessionId,
        cart_data: JSON.stringify(cartItems),
        source_page: "Payment Page",
        payment_method: selectedMethod,
      });
    }
  }, [selectedMethod]);

  const handlePurchase = async () => {
    if (!selectedMethod) {
      toast.error("Please select a payment method");
      return;
    }
    await trackEvent({
      event_type: "purchased",
      user_email: email,
      session_data: sessionId,
      cart_data: JSON.stringify(cartItems),
      source_page: "Payment Page",
      payment_method: selectedMethod,
    });
    toast.success("Order placed successfully!");
    clearCart();
    navigate("/product-library");
  };

  const paymentOptions = [
    {
      label: "Credit Card",
      icon: <FaCcVisa size={20} />,
    },
    {
      label: "Debit Card",
      icon: <FaCcMastercard size={20} />,
    },
    {
      label: "Cash on Delivery",
      icon: <BsCashCoin size={20} />,
    },
  ];

  return (
    <div className="max-w-xl mx-auto mt-14 px-6 py-8 bg-white border rounded-2xl shadow space-y-8">
      <h2 className="text-3xl font-bold text-center text-gray-800">
        Choose Payment Method
      </h2>

      <div className="flex flex-col sm:flex-row sm:flex-wrap justify-center gap-4">
        {paymentOptions.map((method) => (
          <button
            key={method.label}
            onClick={() => setSelectedMethod(method.label)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full border font-medium transition-all 
              ${
                selectedMethod === method.label
                  ? "bg-blue-600 text-white shadow-lg"
                  : "bg-gray-100 text-gray-800 hover:bg-gray-200"
              }`}
          >
            {method.icon}
            {method.label}
          </button>
        ))}
      </div>

      {selectedMethod === "Credit Card" || selectedMethod === "Debit Card" ? (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-700">
            Enter Card Details
          </h3>
          <input
            type="text"
            placeholder="Card Number"
            className="w-full border px-4 py-2 rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
          />
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Expiry (MM/YY)"
              className="w-1/2 border px-4 py-2 rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
            />
            <input
              type="text"
              placeholder="CVV"
              className="w-1/2 border px-4 py-2 rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
            />
          </div>
          <input
            type="text"
            placeholder="Name on Card"
            className="w-full border px-4 py-2 rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
          />
        </div>
      ) : selectedMethod === "Cash on Delivery" ? (
        <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg text-gray-700">
          <p>
            You selected <strong>Cash on Delivery</strong>.
          </p>
          <p className="mt-2">
            Please pay <strong>₹{totalPrice}</strong> when your order arrives.
          </p>
        </div>
      ) : null}

      <button
        onClick={handlePurchase}
        className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white text-lg font-medium py-3 rounded-lg transition-all shadow"
      >
        <BsCreditCard2FrontFill size={22} />
        Buy Now
      </button>
    </div>
  );
}
