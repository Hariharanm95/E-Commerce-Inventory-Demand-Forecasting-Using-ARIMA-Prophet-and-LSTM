import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 p-4 text-white text-center mt-8">
      <p>© {new Date().getFullYear()} E-Commerce Platform. All rights reserved.</p>
    </footer>
  );
};

export default Footer;