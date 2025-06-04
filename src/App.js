import "./App.css";
import { useProducts } from "./hooks/useProducts";

function App() {
  const { products, loading } = useProducts();

  if (loading) {
    return <div className='App'>Loading...</div>;
  }

  return (
    <div className='App'>
      <h1>Desserts</h1>
      <div className='products-grid'>
        {products.map((product, index) => (
          <div key={index} className='product-card'>
            <div className='product-image'>
              <img
                src={`${process.env.PUBLIC_URL}${product.image.mobile.replace(
                  "./assets",
                  "/assets"
                )}`}
                alt={product.name}
              />
              <button className='add-to-cart-btn'>
                <img
                  src={`${process.env.PUBLIC_URL}/assets/images/icon-add-to-cart.svg`}
                  alt='Cart'
                />
                Add to Cart
              </button>
            </div>
            <div className='product-info'>
              <p className='product-category'>{product.category}</p>
              <h3>{product.name}</h3>
              <p className='product-price'>${product.price.toFixed(2)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
