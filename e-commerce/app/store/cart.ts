import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Product } from "~/routes/product-library";

type CartItem = Product & { quantity: number };

interface CartState {
  cartItems: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  getTotalCount: () => number;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cartItems: [],
      addToCart: (product) => {
        const existing = get().cartItems.find((item) => item.id === product.id);
        if (existing) {
          set({
            cartItems: get().cartItems.map((item) =>
              item.id === product.id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            ),
          });
        } else {
          set({ cartItems: [...get().cartItems, { ...product, quantity: 1 }] });
        }
      },
      removeFromCart: (id) =>
        set({
          cartItems: get().cartItems.filter((item) => item.id !== id),
        }),
      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeFromCart(id);
        } else {
          set({
            cartItems: get().cartItems.map((item) =>
              item.id === id ? { ...item, quantity } : item
            ),
          });
        }
      },
      clearCart: () => set({ cartItems: [] }),
      getTotalCount: () =>
        get().cartItems.reduce((total, item) => total + item.quantity, 0),
      getTotalPrice: () =>
        get().cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
