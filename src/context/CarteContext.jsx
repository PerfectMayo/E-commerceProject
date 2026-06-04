import { createContext, useState, useContext } from "react";
import { getProductById } from "../data/products";

const CarteContext = createContext(null);

export default function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);

  function addToCart(productID) {
    const existing = cartItems.find((item) => item.id === productID);
    if (existing) {
      setCartItems(
        cartItems.map((item) =>
          item.id === productID
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        ),
      );
    } else {
      setCartItems([...cartItems, { id: productID, quantity: 1 }]);
    }
  }

  function updateQuantity(productID, newQuantity) {
    if (newQuantity <= 0) {
      removeFromCart(productID);
    } else {
      setCartItems(
        cartItems.map((item) =>
          item.id === productID ? { ...item, quantity: newQuantity } : item,
        ),
      );
    }
  }

  function removeFromCart(productID) {
    setCartItems(cartItems.filter((item) => item.id !== productID));
  }

  function clearCart() {
    setCartItems([]);
  }

  function getCartItemsWithProducts() {
    return cartItems.map((item) => ({
      ...item,
      product: getProductById(item.id),
    }));
  }

  function getCartTotal() {
    return getCartItemsWithProducts().reduce(
      (total, item) => total + item.product.price * item.quantity,
      0,
    );
  }

  return (
    <CarteContext.Provider
      value={{
        cartItems,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        getCartItemsWithProducts,
        getCartTotal,
      }}
    >
      {children}
    </CarteContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CarteContext);
  return context;
}
