import { useCartStore } from "~/store/cart";
import { Product } from "~/routes/product-library";

export default function ProductCard({
  product,
  onView,
  onAddToCart,
}: {
  product: Product;
  onView: (p: Product) => void;
  onAddToCart: (p: Product) => void;
}) {
  const { cartItems, addToCart, updateQuantity } = useCartStore();
  const item = cartItems.find((p) => p.id === product.id);
  const quantity = item?.quantity || 0;

  const handleAddToCart = () => {
    addToCart(product);
    onAddToCart(product);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow hover:shadow-lg transition p-4 space-y-3">
      <img
        src={product.images[0]}
        alt={product.title}
        className="w-full h-48 object-cover rounded-xl"
      />

      <h3 className="text-xl font-semibold text-gray-900 truncate">
        {product.title}
      </h3>

      <p className="text-sm text-gray-600 line-clamp-2">
        {product.description}
      </p>

      <p className="text-lg font-bold text-green-600">₹{product.price}</p>

      <div className="flex items-center justify-between mt-4">
        <button
          onClick={() => onView(product)}
          className="text-sm text-blue-600 hover:underline"
        >
          View
        </button>

        {quantity === 0 ? (
          <button
            onClick={handleAddToCart}
            className="px-4 py-1.5 bg-green-600 hover:bg-green-700 text-white text-sm rounded-full"
          >
            Add to Cart
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={() => updateQuantity(product.id, quantity - 1)}
              className="w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full text-center text-sm"
            >
              −
            </button>
            <span className="font-medium">{quantity}</span>
            <button
              onClick={() => updateQuantity(product.id, quantity + 1)}
              className="w-8 h-8 bg-green-500 hover:bg-green-600 text-white rounded-full text-center text-sm"
            >
              +
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
