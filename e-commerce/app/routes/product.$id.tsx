import { useEffect, useState } from "react";
import { useNavigate, useParams } from "@remix-run/react";
import api from "../api/axios";
import { Product } from "~/routes/product-library";
import { useCartStore } from "~/store/cart";
import { IoArrowBack } from "react-icons/io5";
import { trackEvent } from "~/utils/trackEvent";
import { useUserStore } from "~/store/user";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const { cartItems, addToCart, updateQuantity } = useCartStore();
  const email = useUserStore((state: any) => state.email);
  const sessionId = useUserStore((state: any) => state.sessionId);
  const item = cartItems.find((p) => p.id === product?.id);
  const quantity = item?.quantity || 0;

  const handleAddToCart = () => {
    if (product) {
      addToCart(product);
    }
  };

  const handleBackClick = async () => {
    await trackEvent({
      event_type: "back_to_product_library",
      user_email: email,
      session_data: sessionId,
      cart_data: JSON.stringify(cartItems),
      source_page: "Product Description Page",
    });
    navigate("/product-library");
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/product/${id}`);
        setProduct(res.data);
      } catch (error) {
        console.error("Failed to load product", error);
      }
    };
    fetchProduct();
  }, [id]);

  if (!product) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-500 text-lg animate-pulse">
          Loading product...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={handleBackClick}
          className="flex items-center gap-2 mb-6 text-blue-600 hover:text-blue-800 font-medium transition"
        >
          <IoArrowBack size={20} />
          Back to Products
        </button>
        <div className="bg-white p-8 shadow-lg rounded-lg">
          <div className="grid md:grid-cols-2 gap-8">
            <img
              src={product.images[0]}
              alt={product.title}
              className="w-full h-96 object-cover rounded-lg hover:scale-105 transition duration-300"
            />
            <div className="flex flex-col justify-between">
              <div>
                <h1 className="text-4xl font-bold text-gray-800 mb-4">
                  {product.title}
                </h1>
                <p className="text-gray-700 text-lg mb-6">
                  {product.description}
                </p>
                <p className="text-xl text-gray-900 font-semibold mb-2">
                  ₹{product.price}
                </p>
                <p className="text-sm text-gray-500 italic">
                  Category: {product.category}
                </p>
              </div>

              {quantity === 0 ? (
                <button
                  onClick={handleAddToCart}
                  className="mt-6 bg-blue-600 text-white py-2 px-6 rounded hover:bg-blue-700 transition"
                >
                  Add to Cart
                </button>
              ) : (
                <div className="flex items-center gap-2 mt-6">
                  <button
                    onClick={() => updateQuantity(product.id, quantity - 1)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                  >
                    -
                  </button>
                  <span className="font-semibold text-lg">{quantity}</span>
                  <button
                    onClick={() => updateQuantity(product.id, quantity + 1)}
                    className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                  >
                    +
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
