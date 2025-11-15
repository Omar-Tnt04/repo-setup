import React from 'react';

const LoadingSpinner = ({ size = 'md', fullScreen = false }) => {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-4',
    lg: 'w-12 h-12 border-4',
    xl: 'w-16 h-16 border-4'
  };

  const spinner = (
    <div className={`spinner ${sizeClasses[size]}`} />
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-emerald-900 to-blue-900 bg-opacity-95 flex items-center justify-center z-50">
        <div className="text-center">
          {spinner}
          <p className="mt-4 text-slate-300">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center p-4">
      {spinner}
    </div>
  );
};

export default LoadingSpinner;
