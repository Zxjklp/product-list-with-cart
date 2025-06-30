import apiClient from './api';

export const productService = {
  // Get all products
  getProducts: async () => {
    const response = await apiClient.get('/products');
    return response.data;
  },

  // Get product by ID
  getProductById: async (id) => {
    const response = await apiClient.get(`/products/${id}`);
    return response.data;
  },

  // Get products by category
  getProductsByCategory: async (category) => {
    const response = await apiClient.get(`/products?category=${category}`);
    return response.data;
  },
};