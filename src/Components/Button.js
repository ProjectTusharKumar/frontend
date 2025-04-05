import React from 'react';

const Button = ({ children, onClick, type = 'button', className = '' }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`px-4 py-2 bg-blue-500  rounded hover:bg-blue-600 transition ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
