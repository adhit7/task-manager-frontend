import React from 'react';
import Loader from './Loader';

const buttonClass =
  'group relative w-full hover:bg-blue-500 gap-3 justify-center py-2 px-4 border border-transparent text-sm font-medium text-base rounded-md hover:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 transition duration-300';

const Button = ({
  children,
  type = 'button',
  variant,
  label,
  loading = false,
  message = '',
  onClick,
  classes,
  disabled,
}) => {
  return (
    <button
      className={`
        ${buttonClass}
        ${variant !== 'outlined' ? 'bg-blue-600' : 'border-blue-500'}
        ${disabled ? '!pointer-events-none !bg-indigo-300' : ''}
        ${classes}
      `}
      type={type}
      onClick={onClick}
      disabled={loading || disabled}
    >
      {loading ? (
        <div className='flex justify-center'>
          <Loader />
        </div>
      ) : (
        <p
          className={`${
            variant === 'outlined' ? 'hover:text-white' : 'text-white'
          }`}
        >
          {label}
        </p>
      )}
      {children}
    </button>
  );
};

export default Button;
