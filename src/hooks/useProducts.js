import { useState, useEffect } from "react";
import { productService } from '../services/productService';

export const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        
        const useAPI = true; 

        if (useAPI && process.env.REACT_APP_API_URL) {
          
          const data = await productService.getProducts();
          setProducts(data);
        } else {
          // Use local data during development
          const response = await fetch(`${process.env.PUBLIC_URL}/data.json`);
          const data = await response.json();
          setProducts(data);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return { products, loading, error };
};