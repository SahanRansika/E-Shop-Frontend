import React from 'react';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'blue' | 'white' | 'gray';
  className?: string;
}

const Spinner: React.FC<SpinnerProps> = ({
  size = 'md',
  color = 'blue',
  className = '',
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-2',
    lg: 'h-12 w-12 border-3',
  };

  const colorClasses = {
    blue: 'border-blue-600',
    white: 'border-white',
    gray: 'border-gray-400',
  };

  const classes = [
    'rounded-full animate-spin border-t-transparent',
    sizeClasses[size],
    colorClasses[color],
    className
  ].filter(Boolean).join(' ');

  return <div className={classes} />;
};

export default Spinner;