import apiClient from './api';

export const cartService = {
  // Get user's cart
  getCart: async (userId) => {
    const response = await apiClient.get(`/cart/${userId}`);
    return response.data;
  },

  // Add item to cart
  addToCart: async (userId, product) => {
    const response = await apiClient.post(`/cart/${userId}/items`, product);
    return response.data;
  },

  // Update cart item quantity
  updateCartItem: async (userId, itemId, quantity) => {
    const response = await apiClient.put(`/cart/${userId}/items/${itemId}`, { quantity });
    return response.data;
  },

  // Remove item from cart
  removeFromCart: async (userId, itemId) => {
    const response = await apiClient.delete(`/cart/${userId}/items/${itemId}`);
    return response.data;
  },

  // Clear cart
  clearCart: async (userId) => {
    const response = await apiClient.delete(`/cart/${userId}`);
    return response.data;
  },
};