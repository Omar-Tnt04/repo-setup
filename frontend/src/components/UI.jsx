import React from 'react';

export const GlassCard = ({ children, className = '' }) => (
  <div className={`backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl shadow-xl ${className}`}>
    {children}
  </div>
);

export const GradientText = ({ children, className = '' }) => (
  <span className={`bg-clip-text text-transparent bg-gradient-to-r from-neonBlue via-neonPurple to-neonPink ${className}`}>
    {children}
  </span>
);

export const Button = ({ children, variant = 'primary', className = '', ...props }) => {
  const baseStyles = "px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed";
  const variants = {
    primary: "bg-gradient-to-r from-neonBlue to-neonPurple text-white shadow-lg shadow-neonBlue/25 hover:shadow-neonBlue/40",
    secondary: "bg-white/10 text-white hover:bg-white/20 border border-white/10",
    ghost: "text-gray-400 hover:text-white hover:bg-white/5"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export const TechBadge = ({ label, color = "bg-blue-500" }) => (
  <span className={`px-3 py-1 rounded-full text-xs font-medium text-white border border-white/10 ${color} bg-opacity-20`}>
    {label}
  </span>
);

export const StatusIndicator = ({ status }) => {
  const colors = {
    active: "bg-emerald-500",
    pending: "bg-amber-500",
    offline: "bg-gray-500"
  };
  
  return (
    <div className="flex items-center gap-2">
      <span className={`w-2 h-2 rounded-full ${colors[status] || colors.offline} animate-pulse`} />
      <span className="text-sm text-gray-400 capitalize">{status}</span>
    </div>
  );
};
