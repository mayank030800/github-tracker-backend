import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-blue-600 text-white shadow-md">
      <div className="container mx-auto flex justify-between items-center py-4 px-6">
        {/* Logo or Title */}
        <h1 className="text-2xl font-bold">
          GitHub Tracker
        </h1>

        {/* Navigation Links */}
        <nav className="flex space-x-6">
          <a
            href="#"
            className="text-white hover:text-gray-200 transition-colors"
          >
            Home
          </a>
          <a
            href="#"
            className="text-white hover:text-gray-200 transition-colors"
          >
            About
          </a>
          <a
            href="#"
            className="text-white hover:text-gray-200 transition-colors"
          >
            Contact
          </a>
        </nav>
      </div>
    </header>
  );
};

export default Header;
