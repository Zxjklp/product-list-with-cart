import "./App.css";
import { useProducts } from "./hooks/useProducts";
import { useCart } from "./context/CartContext";
import { useState } from "react";

function App() {
  const { products, loading } = useProducts();
  const {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    getTotalItems,
    getTotalPrice,
    clearCart,
  } = useCart();

  const [showOrderConfirmation, setShowOrderConfirmation] = useState(false);

  if (loading) {
    return <div className='App'>Loading...</div>;
  }

  const handleAddToCart = (product) => {
    addToCart(product);
  };

  const getItemInCart = (productName) => {
    return cart.find((item) => item.name === productName);
  };

  const handleQuantityChange = (productName, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productName);
    } else {
      updateQuantity(productName, newQuantity);
    }
  };

  const handleConfirmOrder = () => {
    setShowOrderConfirmation(true);
  };

  const handleStartNewOrder = () => {
    clearCart();
    setShowOrderConfirmation(false);
  };

  return (
    <div className='App'>
      <div className='main-content'>
        <h1>Desserts</h1>
        <div className='products-grid'>
          {products.map((product, index) => {
            const itemInCart = getItemInCart(product.name);

            return (
              <div key={index} className='product-card'>
                <div className='product-image'>
                  <picture>
                    <source
                      media='(min-width: 1024px)'
                      srcSet={`${
                        process.env.PUBLIC_URL
                      }${product.image.desktop.replace("./assets", "/assets")}`}
                    />
                    <source
                      media='(min-width: 768px)'
                      srcSet={`${
                        process.env.PUBLIC_URL
                      }${product.image.tablet.replace("./assets", "/assets")}`}
                    />
                    <img
                      src={`${
                        process.env.PUBLIC_URL
                      }${product.image.mobile.replace("./assets", "/assets")}`}
                      alt={product.name}
                    />
                  </picture>

                  {itemInCart ? (
                    <div className='quantity-control'>
                      <button
                        className='quantity-btn'
                        onClick={() =>
                          handleQuantityChange(
                            product.name,
                            itemInCart.quantity - 1
                          )
                        }
                      >
                        <img
                          className='minus-icon'
                          src={`${process.env.PUBLIC_URL}/assets/images/icon-decrement-quantity.svg`}
                          alt='Decrease quantity'
                        />
                      </button>
                      <span className='quantity-display'>
                        {itemInCart.quantity}
                      </span>
                      <button
                        className='quantity-btn'
                        onClick={() =>
                          handleQuantityChange(
                            product.name,
                            itemInCart.quantity + 1
                          )
                        }
                      >
                        <img
                          src={`${process.env.PUBLIC_URL}/assets/images/icon-increment-quantity.svg`}
                          alt='Increase quantity'
                        />
                      </button>
                    </div>
                  ) : (
                    <button
                      className='add-to-cart-btn'
                      onClick={() => handleAddToCart(product)}
                    >
                      <img
                        src={`${process.env.PUBLIC_URL}/assets/images/icon-add-to-cart.svg`}
                        alt='Cart'
                      />
                      Add to Cart
                    </button>
                  )}
                </div>
                <div className='product-info'>
                  <p className='product-category'>{product.category}</p>
                  <h3>{product.name}</h3>
                  <p className='product-price'>${product.price.toFixed(2)}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Cart Summary */}
      <div className='cart-summary'>
        <h2>Your Cart ({getTotalItems()})</h2>
        {getTotalItems() === 0 ? (
          <div className='cart-empty'>
            <img
              src={`${process.env.PUBLIC_URL}/assets/images/illustration-empty-cart.svg`}
              alt='Empty cart'
              className='cart-empty-icon'
            />
            <p>Your added items will appear here</p>
          </div>
        ) : (
          <div className='cart-items'>
            {cart.map((item, index) => (
              <div key={index} className='cart-item'>
                <div className='cart-item-info'>
                  <h3>{item.name}</h3>
                  <div className='cart-item-details'>
                    <span className='cart-item-quantity'>{item.quantity}x</span>
                    <span className='cart-item-price'>
                      @ ${item.price.toFixed(2)}
                    </span>
                    <span className='cart-item-total'>
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
                <button
                  className='remove-item-btn'
                  onClick={() => removeFromCart(item.name)}
                >
                  <img
                    src={`${process.env.PUBLIC_URL}/assets/images/icon-remove-item.svg`}
                    alt='Remove item'
                  />
                </button>
              </div>
            ))}

            <div className='cart-total'>
              <span>Order Total</span>
              <span className='total-price'>${getTotalPrice().toFixed(2)}</span>
            </div>

            <div className='carbon-neutral'>
              <img
                src={`${process.env.PUBLIC_URL}/assets/images/icon-carbon-neutral.svg`}
                alt='Carbon neutral'
              />
              <span>
                This is a <strong>carbon-neutral</strong> delivery
              </span>
            </div>

            <button className='confirm-order-btn' onClick={handleConfirmOrder}>
              Confirm Order
            </button>
          </div>
        )}
      </div>

      {/* Order Confirmation Modal */}
      {showOrderConfirmation && (
        <div className='modal-overlay'>
          <div className='modal-content'>
            <img
              src={`${process.env.PUBLIC_URL}/assets/images/icon-order-confirmed.svg`}
              alt='Order confirmed'
              className='order-confirmed-icon'
            />
            <h2>Order Confirmed</h2>
            <p>We hope you enjoy your food!</p>

            <div className='order-summary'>
              {cart.map((item, index) => (
                <div key={index} className='order-item'>
                  <div className='order-item-left'>
                    <img
                      src={`${
                        process.env.PUBLIC_URL
                      }${item.image.thumbnail.replace("./assets", "/assets")}`}
                      alt={item.name}
                      className='order-item-thumbnail'
                    />
                    <div className='order-item-details'>
                      <h3>{item.name}</h3>
                      <div className='order-item-pricing'>
                        <span className='order-item-quantity'>
                          {item.quantity}x
                        </span>
                        <span className='order-item-price'>
                          @ ${item.price.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className='order-item-total'>
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}

              <div className='order-total'>
                <span>Order Total</span>
                <span className='order-total-price'>
                  ${getTotalPrice().toFixed(2)}
                </span>
              </div>
            </div>

            <button
              className='start-new-order-btn'
              onClick={handleStartNewOrder}
            >
              Start New Order
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
