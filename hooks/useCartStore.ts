
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CartItem {
  product: any;
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  isLoading: boolean;
  error: string | null;
  addItem: (product: any) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
  initCart: () => void;
}

const getProductId = (product: any): string => {
  return product._id || product.id || '';
};

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isLoading: false,
      error: null,

      addItem: (product) => {
        const productId = getProductId(product);
        
        set((state) => {
          const existingItem = state.items.find(
            (item) => getProductId(item.product) === productId
          );

          if (existingItem) {
            return {
              items: state.items.map((item) =>
                getProductId(item.product) === productId
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              ),
              error: null,
            };
          }

          return {
            items: [...state.items, { product, quantity: 1 }],
            error: null,
          };
        });
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter(
            (item) => getProductId(item.product) !== productId
          ),
          error: null,
        }));
      },

      updateQuantity: (productId, quantity) => {
        if (quantity < 1) {
          get().removeItem(productId);
          return;
        }

        set((state) => ({
          items: state.items.map((item) =>
            getProductId(item.product) === productId
              ? { ...item, quantity }
              : item
          ),
          error: null,
        }));
      },

      clearCart: () => {
        set({ items: [], error: null });
      },

      getTotalPrice: () => {
        return get().items.reduce(
          (total, item) => total + (item.product.price || 0) * item.quantity,
          0
        );
      },

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      initCart: () => {
        // Cart state is automatically loaded from localStorage by zustand persist middleware
        // This function ensures the cart is ready and validates the data
        try {
          const currentItems = get().items;
          
          // Validate that all items have required properties
          const validItems = currentItems.filter(
            (item) => item.product && item.quantity > 0
          );
          
          if (validItems.length !== currentItems.length) {
            set({ items: validItems, error: null });
          }
        } catch (error) {
          console.error('Error initializing cart:', error);
          set({ items: [], error: 'Failed to initialize cart' });
        }
      },
    }),
    {
      name: 'cart-storage',
    }
  )
);
