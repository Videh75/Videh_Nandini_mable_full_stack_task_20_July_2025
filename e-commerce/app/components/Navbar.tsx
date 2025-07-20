import { Link, useNavigate } from "@remix-run/react";
import api from "~/api/axios";
import { useCartStore } from "~/store/cart";
import { useUserStore } from "~/store/user";
import { trackEvent } from "~/utils/trackEvent";
import { FiShoppingCart, FiLogOut } from "react-icons/fi";

export default function Navbar() {
  const navigate = useNavigate();
  const email = useUserStore((state) => state.email);
  const sessionId = useUserStore((state) => state.sessionId);
  const setEmail = useUserStore((state) => state.setEmail);
  const setSessionId = useUserStore((state) => state.setSessionId);
  const { cartItems, clearCart } = useCartStore();

  const handleClick = async (event: string) => {
    await trackEvent({
      event_type: `clicked_${event}_from_navbar`,
      user_email: email,
      session_data: sessionId,
      cart_data: JSON.stringify(cartItems),
      source_page: event,
    });
  };

  const handleLogout = async () => {
    setEmail("");
    setSessionId("");
    clearCart();
    await trackEvent({
      event_type: "logout",
      user_email: email,
      session_data: sessionId,
      cart_data: JSON.stringify(cartItems),
      source_page: "Logout",
    });
    await api.post("/logout");
    navigate("/login");
  };

  return (
    <nav className="bg-gray-900 text-white shadow-md px-8 py-4 flex items-center justify-between">
      <div className="flex items-center space-x-8">
        <Link
          to="/"
          onClick={() => handleClick("product_library")}
          className="text-lg font-medium hover:text-blue-400 transition-colors"
        >
          Product Library
        </Link>

        <Link
          to="/cart"
          onClick={() => handleClick("add_to_cart")}
          className="relative text-lg font-medium hover:text-blue-400 transition-colors flex items-center"
        >
          <FiShoppingCart className="mr-1" size={20} />
          My Cart
          {cartItems.length > 0 && (
            <span className="ml-1 bg-red-600 text-white text-xs px-2 py-0.5 rounded-full">
              {cartItems.length}
            </span>
          )}
        </Link>
      </div>

      <div className="flex items-center space-x-4">
        {email && (
          <>
            <span className="text-sm text-gray-300 truncate max-w-[200px]">
              Hello, <span className="font-semibold">{email}</span>
            </span>
            <button
              onClick={handleLogout}
              className="flex items-center bg-red-500 hover:bg-red-600 text-sm px-3 py-1.5 rounded transition-all"
            >
              <FiLogOut size={16} className="mr-1" />
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
