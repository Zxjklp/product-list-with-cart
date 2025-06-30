import apiClient from './api';

export const orderService = {
  // Create new order
  createOrder: async (orderData) => {
    const response = await apiClient.post('/orders', orderData);
    return response.data;
  },

  // Get user's orders
  getOrders: async (userId) => {
    const response = await apiClient.get(`/orders/user/${userId}`);
    return response.data;
  },

  // Get order by ID
  getOrderById: async (orderId) => {
    const response = await apiClient.get(`/orders/${orderId}`);
    return response.data;
  },
};