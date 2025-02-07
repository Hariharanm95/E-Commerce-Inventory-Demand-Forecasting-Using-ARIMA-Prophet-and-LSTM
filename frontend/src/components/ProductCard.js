import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <Link to={`/products/${product._id}`}>
        <img className="w-full h-48 object-cover" src={product.imageUrl} alt={product.name} />
      </Link>
      <div className="p-4">
        <h3 className="text-lg font-semibold">{product.name}</h3>
        <p className="text-gray-600">${product.price}</p>
        <Link to={`/products/${product._id}`} className="mt-2 inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          View Details
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;