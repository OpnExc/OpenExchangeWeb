import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 py-4 text-white">
      <div className="mx-auto text-center container">
        <p>&copy; {new Date().getFullYear()} My React App. All rights reserved.</p>
        <p>
          <a href="/contact" className="text-gray-400 hover:text-white">Contact Us</a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;