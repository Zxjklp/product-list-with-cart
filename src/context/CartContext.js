import { createContext, useContext, useState, useEffect } from "react";
import { cartService } from '../services/cartService';
import { orderService } from "../services/orderService";

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export const CartProvider = ({ children }) => {
  // Initialize cart from localStorage immediately
  const [cart, setCart] = useState(() => {
    try {
      const savedCart = localStorage.getItem("cart");
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
      console.error("Error loading cart from localStorage:", error);
      return [];
    }
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Mock user ID - replace with actual auth system later
  const userId = "user-123";

  // Optional: Load additional cart data from backend on mount
  useEffect(() => {
    const syncWithBackend = async () => {
      // Only sync with backend if you want to override localStorage
      // For now, we'll skip this to keep localStorage as primary source
      // TODO: Uncomment when you want backend to be primary source
      // try {
      //   setLoading(true);
      //   const cartData = await cartService.getCart(userId);
      //   setCart(cartData.items || []);
      // } catch (error) {
      //   console.error('Error syncing with backend:', error);
      //   // Keep localStorage data on error
      // } finally {
      //   setLoading(false);
      // }
    };

    syncWithBackend();
  }, [userId]);

  // Save to localStorage whenever cart changes (keep this)
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = async (product) => {
    try {
      setError(null);

      setCart((prevCart) => {
        const existingItem = prevCart.find(
          (item) => item.name === product.name
        );

        if (existingItem) {
          return prevCart.map((item) =>
            item.name === product.name
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        } else {
          return [...prevCart, { ...product, quantity: 1 }];
        }
      });

      // Sync with backend - UNCOMMENTED
      await cartService.addToCart(userId, product);
    } catch (error) {
      console.error("Error adding to cart:", error);
      setError("Failed to add item to cart");
    }
  };

  const removeFromCart = async (productName) => {
    try {
      setError(null);

      setCart((prevCart) =>
        prevCart.filter((item) => item.name !== productName)
      );

      // Sync with backend - UNCOMMENTED AND FIXED
      await cartService.removeFromCart(userId, encodeURIComponent(productName));
    } catch (error) {
      console.error("Error removing from cart:", error);
      setError("Failed to remove item from cart");
    }
  };

  const updateQuantity = async (productName, quantity) => {
    try {
      setError(null);

      if (quantity === 0) {
        await removeFromCart(productName);
        return;
      }

      setCart((prevCart) =>
        prevCart.map((item) =>
          item.name === productName ? { ...item, quantity } : item
        )
      );

      // Sync with backend - UNCOMMENTED AND FIXED
      await cartService.updateCartItem(
        userId,
        encodeURIComponent(productName),
        quantity
      );
    } catch (error) {
      console.error("Error updating cart quantity:", error);
      setError("Failed to update item quantity");
    }
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const clearCart = async () => {
    try {
      setError(null);

      setCart([]);

      // Sync with backend - UNCOMMENTED
      await cartService.clearCart(userId);
    } catch (error) {
      console.error("Error clearing cart:", error);
      setError("Failed to clear cart");
    }
  };

  // New method for order processing
  const processOrder = async (orderData) => {
    try {
      setLoading(true);
      setError(null);

      // Create order with backend - UNCOMMENTED
      const order = await orderService.createOrder({
        userId,
        items: cart,
        totalAmount: getTotalPrice(),
        ...orderData,
      });

      // Clear cart after successful order
      await clearCart();

      // Return the actual order from the API
      return order;
    } catch (error) {
      console.error("Error processing order:", error);
      setError("Failed to process order");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Method to sync cart with backend (useful for auth state changes)
  const syncCart = async () => {
    try {
      setLoading(true);
      setError(null);

      // Sync with backend - UNCOMMENTED
      const cartData = await cartService.getCart(userId);
      setCart(cartData.items || []);
    } catch (error) {
      console.error("Error syncing cart:", error);
      setError("Failed to sync cart");
    } finally {
      setLoading(false);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        error,
        addToCart,
        removeFromCart,
        updateQuantity,
        getTotalItems,
        getTotalPrice,
        clearCart,
        processOrder,
        syncCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};