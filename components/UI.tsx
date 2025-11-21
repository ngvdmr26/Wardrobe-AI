import React from 'react';

export const Loader: React.FC<{ text?: string }> = ({ text = "Loading..." }) => (
  <div className="flex flex-col items-center justify-center p-8 text-primary">
    <svg className="animate-spin h-8 w-8 mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
    <p className="text-sm font-medium animate-pulse">{text}</p>
  </div>
);

export const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'outline' }> = ({ 
  children, 
  variant = 'primary', 
  className = '', 
  ...props 
}) => {
  const baseStyles = "px-4 py-2 rounded-xl font-medium transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed";
  const variants = {
    primary: "bg-primary text-white shadow-lg shadow-primary/30 hover:bg-indigo-600",
    secondary: "bg-secondary text-white shadow-lg shadow-secondary/30 hover:bg-pink-600",
    outline: "border-2 border-slate-200 text-slate-600 hover:border-primary hover:text-primary bg-white"
  };

  return (
    <button className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

export const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden ${className}`}>
    {children}
  </div>
);
