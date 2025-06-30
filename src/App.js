import "./App.css";
import { useProducts } from "./hooks/useProducts";
import { useCart } from "./context/CartContext";
import { useState } from "react";

function App() {
  const { products, loading, error } = useProducts();
  const {
    cart,
    loading: cartLoading,
    error: cartError,
    addToCart,
    removeFromCart,
    updateQuantity,
    getTotalItems,
    getTotalPrice,
    // clearCart,
    processOrder,
  } = useCart();

  const [showOrderConfirmation, setShowOrderConfirmation] = useState(false);
  const [orderData, setOrderData] = useState(null);
  const [orderProcessing, setOrderProcessing] = useState(false);

  if (loading) {
    return <div className='App'>Loading...</div>;
  }

  if (error) {
    return <div className='App'>Error: {error}</div>;
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

  const handleConfirmOrder = async () => {
    try {
      setOrderProcessing(true);
      
      // Process order through the cart context
      const order = await processOrder({
        customerInfo: {
          // Add customer info here when you implement user authentication
          email: 'customer@example.com',
          name: 'Customer Name',
        },
        deliveryAddress: {
          // Add delivery address when you implement address management
          street: '123 Main St',
          city: 'City',
          zipCode: '12345',
        },
        paymentMethod: 'credit_card', // Add payment method selection
      });

      setOrderData(order);
      setShowOrderConfirmation(true);
    } catch (error) {
      console.error('Order processing failed:', error);
      // You could add a toast notification or error modal here
      alert('Failed to process order. Please try again.');
    } finally {
      setOrderProcessing(false);
    }
  };

  const handleStartNewOrder = () => {
    setShowOrderConfirmation(false);
    setOrderData(null);
    // Cart is already cleared by processOrder
  };

  return (
    <div className='App'>
      <div className='main-content'>
        <h1>Desserts</h1>
        
        {/* Display cart error if any */}
        {cartError && (
          <div className="error-message" style={{
            background: '#fee', 
            border: '1px solid #fcc', 
            padding: '1rem', 
            borderRadius: '0.5rem', 
            marginBottom: '1rem',
            color: '#c33'
          }}>
            {cartError}
          </div>
        )}

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
                        type='button'
                        className='quantity-btn'
                        onClick={() =>
                          handleQuantityChange(
                            product.name,
                            itemInCart.quantity - 1
                          )
                        }
                        disabled={cartLoading}
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
                        type='button'
                        className='quantity-btn'
                        onClick={() =>
                          handleQuantityChange(
                            product.name,
                            itemInCart.quantity + 1
                          )
                        }
                        disabled={cartLoading}
                      >
                        <img
                          src={`${process.env.PUBLIC_URL}/assets/images/icon-increment-quantity.svg`}
                          alt='Increase quantity'
                        />
                      </button>
                    </div>
                  ) : (
                    <button
                      type='button'
                      className='add-to-cart-btn'
                      onClick={() => handleAddToCart(product)}
                      disabled={cartLoading}
                    >
                      <img
                        src={`${process.env.PUBLIC_URL}/assets/images/icon-add-to-cart.svg`}
                        alt='Cart'
                      />
                      {cartLoading ? 'Adding...' : 'Add to Cart'}
                    </button>
                  )}
                </div>
                <div className='product-info'>
                  <p className='product-category'>{product.category}</p>
                  <h2>{product.name}</h2>
                  <p className='product-price'>${product.price.toFixed(2)}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Cart Summary */}
      <div className='cart-summary'>
        <h3>Your Cart ({getTotalItems()})</h3>
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
                  <h4>{item.name}</h4>
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
                  type='button'
                  className='remove-item-btn'
                  onClick={() => removeFromCart(item.name)}
                  disabled={cartLoading}
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

            <button
              type='button'
              className='confirm-order-btn'
              onClick={handleConfirmOrder}
              disabled={cartLoading || orderProcessing}
            >
              {orderProcessing ? 'Processing Order...' : 'Confirm Order'}
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

            {/* Show order data if available, otherwise show cart data */}
            <div className='order-summary'>
              {(orderData?.items || cart).map((item, index) => (
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
                      <h4>{item.name}</h4>
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
                  ${(orderData?.totalAmount || getTotalPrice()).toFixed(2)}
                </span>
              </div>

              {/* Display order ID if available */}
              {orderData && (
                <div style={{ 
                  marginTop: '1rem', 
                  padding: '0.75rem', 
                  background: '#f0f9ff', 
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  color: '#0369a1'
                }}>
                  <strong>Order ID:</strong> {orderData.id}
                  <br />
                  <strong>Status:</strong> {orderData.status}
                  <br />
                  <strong>Date:</strong> {new Date(orderData.createdAt).toLocaleDateString()}
                </div>
              )}
            </div>

            <button
              type='button'
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