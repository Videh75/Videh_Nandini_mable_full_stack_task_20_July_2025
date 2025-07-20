import { useCartStore } from "~/store/cart";
import { useNavigate } from "@remix-run/react";
import { trackEvent } from "~/utils/trackEvent";
import { useUserStore } from "~/store/user";
import { AiOutlineDelete } from "react-icons/ai";
import { BsCreditCard } from "react-icons/bs";

export default function Cart() {
  const { cartItems, removeFromCart, updateQuantity, getTotalPrice } =
    useCartStore();
  const navigate = useNavigate();
  const totalPrice = getTotalPrice();
  const email = useUserStore((state) => state.email);
  const sessionId = useUserStore((state) => state.sessionId);

  const handlePayment = async () => {
    await trackEvent({
      event_type: "checkout",
      user_email: email,
      session_data: sessionId,
      cart_data: JSON.stringify(cartItems),
      source_page: "Cart Page",
    });
    navigate("/payment");
  };

  const handleDelete = async (id: number) => {
    await trackEvent({
      event_type: "delete_from_cart",
      user_email: email,
      session_data: sessionId,
      cart_data: JSON.stringify(cartItems),
      source_page: "Cart Page",
    });
    removeFromCart(id);
  };

  return (
    <div className="max-w-4xl mx-auto mt-12 px-4">
      <h2 className="text-3xl font-bold mb-8 text-center">Your Cart</h2>

      {cartItems.length === 0 ? (
        <p className="text-center text-gray-600">No items in cart</p>
      ) : (
        <>
          <div className="space-y-6">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="bg-white shadow-md rounded-lg p-4 flex justify-between items-center"
              >
                <div>
                  <p className="text-lg font-semibold">{item.title}</p>
                  <p className="text-sm text-gray-500">₹{item.price}</p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-full"
                  >
                    -
                  </button>
                  <span className="text-lg font-medium">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-full"
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="flex items-center gap-1 text-sm bg-gray-200 hover:bg-gray-300 px-4 py-1 rounded"
                >
                  <AiOutlineDelete size={18} />
                  Delete
                </button>
              </div>
            ))}
          </div>

          <div className="mt-8 border-t pt-6 flex justify-between items-center">
            <p className="text-xl font-semibold">Total: ₹{totalPrice}</p>
            <button
              onClick={handlePayment}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded shadow-md"
            >
              <BsCreditCard size={20} />
              Proceed to Payment
            </button>
          </div>
        </>
      )}
    </div>
  );
}
