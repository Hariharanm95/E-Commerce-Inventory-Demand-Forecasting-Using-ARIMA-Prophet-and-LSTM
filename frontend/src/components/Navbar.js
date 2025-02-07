import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="bg-gray-800 p-4 text-white flex items-center justify-between">
      <Link to="/" className="text-xl font-bold">E-Commerce Platform</Link>
      <div className="flex items-center space-x-4">
        <Link to="/" className="hover:text-gray-300">Home</Link>
        <Link to="/products" className="hover:text-gray-300">Products</Link>
        {user ? (
          <>
            <Link to="/profile" className="hover:text-gray-300">Profile</Link>
            <Link to="/cart" className="hover:text-gray-300">Cart</Link>
            {user.isAdmin && (
              <Link to="/admin" className="hover:text-gray-300">Admin</Link>
            )}
            <button onClick={logout} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="hover:text-gray-300">Login</Link>
            <Link to="/signup" className="hover:text-gray-300">Signup</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;