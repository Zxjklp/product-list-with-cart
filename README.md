# Frontend Mentor - Product list with cart solution

This is a solution to the [Product list with cart challenge on Frontend Mentor](https://www.frontendmentor.io/challenges/product-list-with-cart-5MmqLVAp_d). Frontend Mentor challenges help you improve your coding skills by building realistic projects.

## Table of contents

- [Overview](#overview)
  - [The challenge](#the-challenge)
  - [Screenshot](#screenshot)
  - [Links](#links)
- [My process](#my-process)
  - [Built with](#built-with)
  - [What I learned](#what-i-learned)
  - [Continued development](#continued-development)
- [Author](#author)

## Overview

### The challenge

Users should be able to:

- Add items to the cart and remove them
- Increase/decrease the number of items in the cart
- See an order confirmation modal when they click "Confirm Order"
- Reset their selections when they click "Start New Order"
- View the optimal layout for the interface depending on their device's screen size
- See hover and focus states for all interactive elements on the page

### Screenshot

![Desktop Design](./preview.jpg)

### Links

- [Solution](https://www.frontendmentor.io/solutions/product-list-with-cart-VImIymvrdf)
- [Live Site](https://zxjklp.github.io/product-list-with-cart/)

## My process

### Built with

- Semantic HTML5 markup
- CSS custom properties
- Flexbox
- CSS Grid
- Mobile-first workflow
- [React](https://reactjs.org/) - JS library
- React Context API for state management
- Custom hooks for data fetching
- Responsive images with `<picture>` elements

### What I learned

Working on this project helped me improve my skills in several key areas:

**1. React Context API for Global State Management**

```javascript
const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  const addToCart = (product) => {
    // Add product logic
  };

  return (
    <CartContext.Provider value={{ cart, addToCart /* other methods */ }}>
      {children}
    </CartContext.Provider>
  );
};
```

**2. Responsive Image Implementation**

```jsx
<picture>
  <source media='(min-width: 1024px)' srcSet={product.image.desktop} />
  <source media='(min-width: 768px)' srcSet={product.image.tablet} />
  <img src={product.image.mobile} alt={product.name} />
</picture>
```

**3. Component-Based CSS Organization**

```css
/* Base styles */
.quantity-control {
  /* mobile styles */
}

/* Responsive breakpoints */
@media (min-width: 768px) {
  .quantity-control {
    /* tablet styles */
  }
}

@media (min-width: 1024px) {
  .quantity-control {
    /* desktop styles */
  }
}
```

## Author

- Frontend Mentor - [@Zxjklp](https://www.frontendmentor.io/profile/Zxjklp)
- GitHub - [@Zxjklp](https://github.com/Zxjklp)
