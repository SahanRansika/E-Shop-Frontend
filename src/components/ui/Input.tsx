import React from 'react';
import type{ LucideIcon } from 'lucide-react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: LucideIcon;
  helperText?: string;
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  icon: Icon,
  helperText,
  className = '',
  ...props
}) => {
  const inputClasses = [
    'w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition',
    error ? 'border-red-500' : 'border-gray-300',
    Icon ? 'pl-10' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
        )}
        
        <input
          className={inputClasses}
          {...props}
        />
      </div>
      
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
      
      {helperText && !error && (
        <p className="text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  );
};

export default Input;