import { useEffect, useState } from "react";
import api from "../api/axios";
import { useUserStore } from "~/store/user";
import ProductCard from "~/components/ProductCard";
import { trackEvent } from "~/utils/trackEvent";
import { useNavigate } from "@remix-run/react";
import { useCartStore } from "~/store/cart";

export type Product = {
  id: number;
  title: string;
  description: string;
  price: number;
  images: string[];
  category: string;
};

export default function ProductLibrary() {
  const [products, setProducts] = useState<Product[]>([]);
  const email = useUserStore((state) => state.email);
  const sessionId = useUserStore((state) => state.sessionId);
  const navigate = useNavigate();
  const { cartItems, getTotalCount } = useCartStore();
  const totalCount = getTotalCount();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get("/products");
        setProducts(res.data || []);
      } catch (error) {
        console.error("Failed to fetch products.");
      }
    };
    fetchProducts();
  }, []);

  const handleView = async (product: Product) => {
    await trackEvent({
      event_type: "product_viewed",
      user_email: email,
      session_data: sessionId,
      cart_data: JSON.stringify(cartItems),
      source_page: "Product Library",
    });
    navigate(`/product/${product.id}`);
  };

  const addToCart = (product: Product) => {
    trackEvent({
      event_type: "add_to_cart",
      user_email: email,
      session_data: sessionId,
      cart_data: JSON.stringify(product),
      source_page: "Product Library",
    });
  };

  const handleViewCart = async () => {
    await trackEvent({
      event_type: "view_cart",
      user_email: email,
      session_data: sessionId,
      cart_data: JSON.stringify(cartItems),
      source_page: "Product Library",
    });
    navigate("/cart");
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="max-w-5xl mx-auto px-4 pt-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Product Library
        </h2>
        {products.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onView={handleView}
                onAddToCart={addToCart}
              />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-600">Loading products...</p>
        )}
      </div>

      {totalCount > 0 && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-white border border-gray-300 shadow-lg px-6 py-3 rounded-full flex items-center gap-4 z-50">
          <span className="text-gray-700 font-medium">
            {totalCount} item{totalCount > 1 ? "s" : ""} in cart
          </span>
          <button
            onClick={handleViewCart}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded transition"
          >
            View Cart
          </button>
        </div>
      )}
    </div>
  );
}
