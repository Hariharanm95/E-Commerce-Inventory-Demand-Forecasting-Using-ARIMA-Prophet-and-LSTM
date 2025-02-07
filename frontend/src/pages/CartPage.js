import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { Link } from 'react-router-dom';

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const response = await api.get('/cart');
        setCartItems(response.data.data.cart.items);
        setLoading(false);
      } catch (err) {
        setError(err.message || 'Failed to fetch cart items');
        setLoading(false);
      }
    };

    fetchCartItems();
  }, []);

  const handleQuantityChange = async (productId, quantity) => {
    try {
      await api.post(`/cart/update/${productId}`, { quantity });
      // Refresh cart after update
      const response = await api.get('/cart');
      setCartItems(response.data.data.cart.items);
    } catch (err) {
      setError(err.message || 'Failed to update quantity');
    }
  };

  const handleRemoveFromCart = async (productId) => {
    try {
      await api.post('/cart/remove', { productId });
      // Refresh cart after removing
      const response = await api.get('/cart');
      setCartItems(response.data.data.cart.items);
    } catch (err) {
      setError(err.message || 'Failed to remove item');
    }
  };

  const handleCheckout = () => {
    // Navigate to checkout page or trigger checkout process
    console.log('Checkout clicked');
  };

  if (loading) {
    return <div className="container mx-auto mt-8">Loading cart...</div>;
  }

  if (error) {
    return <div className="container mx-auto mt-8 text-red-500">Error: {error}</div>;
  }

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="container mx-auto mt-8">
        <p>Your cart is empty. <Link to="/products">Browse Products</Link></p>
      </div>
    );
  }

  return (
    <div className="container mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-4">Shopping Cart</h1>
      {cartItems.map((item) => (
        <div key={item.product._id} className="flex items-center justify-between mb-4 border-b pb-2">
          <img className="w-24 h-24 object-cover rounded" src={item.product.imageUrl} alt={item.product.name} />
          <div>
            <Link to={`/products/${item.product._id}`} className="text-blue-500 hover:text-blue-700">
              {item.product.name}
            </Link>
            <p className="text-gray-600">${item.product.price}</p>
          </div>
          <div className="flex items-center">
            <button
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-l"
              onClick={() => handleQuantityChange(item.product._id, item.quantity - 1)}
              disabled={item.quantity <= 1}
            >
              -
            </button>
            <input
              type="number"
              className="mx-2 w-20 text-center border rounded"
              value={item.quantity}
              onChange={(e) => handleQuantityChange(item.product._id, parseInt(e.target.value))}
            />
            <button
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-r"
              onClick={() => handleQuantityChange(item.product._id, item.quantity + 1)}
            >
              +
            </button>
          </div>
          <button
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => handleRemoveFromCart(item.product._id)}
          >
            Remove
          </button>
        </div>
      ))}
      <div className="mt-4">
        <button
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          onClick={handleCheckout}
        >
          Checkout
        </button>
      </div>
    </div>
  );
};

export default CartPage;