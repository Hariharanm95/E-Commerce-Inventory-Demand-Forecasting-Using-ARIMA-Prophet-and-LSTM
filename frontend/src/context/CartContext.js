import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../utils/api'; // Import your API utility
import { AuthContext } from './AuthContext';

const CartContext = createContext();

const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchCartItems = async () => {
      if (user) { // Only fetch cart if user is logged in
        try {
          const response = await api.get('/cart');
          setCartItems(response.data.data.cart.items);
          setLoading(false);
        } catch (err) {
          setError(err.message || 'Failed to fetch cart items');
          setLoading(false);
        }
      } else {
        setCartItems([]); // Clear cart if user is logged out
        setLoading(false);
      }
    };

    fetchCartItems();
  }, [user]); // Refetch when user logs in/out

  const addItemToCart = async (productId, quantity) => {
    try {
      await api.post('/cart/add', { productId, quantity });
      // Refresh cart after adding
      const response = await api.get('/cart');
      setCartItems(response.data.data.cart.items);
    } catch (err) {
      setError(err.message || 'Failed to add item');
    }
  };

  const removeItemFromCart = async (productId) => {
    try {
      await api.post('/cart/remove', { productId });
      // Refresh cart after removing
      const response = await api.get('/cart');
      setCartItems(response.data.data.cart.items);
    } catch (err) {
      setError(err.message || 'Failed to remove item');
    }
  };

  const updateCartItemQuantity = async (productId, quantity) => {
    try {
      await api.post(`/cart/update/${productId}`, { quantity });
      // Refresh cart after update
      const response = await api.get('/cart');
      setCartItems(response.data.data.cart.items);
    } catch (err) {
      setError(err.message || 'Failed to update quantity');
    }
  };

  const clearCart = async () => {
    try {
      await api.delete('/cart');
      setCartItems([]); // Clear cart locally
    } catch (err) {
      setError(err.message || 'Failed to clear cart');
    }
  };

  const value = {
    cartItems,
    loading,
    error,
    addItemToCart,
    removeItemFromCart,
    updateCartItemQuantity,
    clearCart,
  };

  return (
    <CartContext.Provider value={value}>
      {!loading && children}
    </CartContext.Provider>
  );
};

export { CartContext, CartProvider };