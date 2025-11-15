import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-900 to-blue-900 flex items-center justify-center">
      <div className="container-custom py-20 text-center">
        {/* Floating shapes in background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        </div>
        
        <div className="relative z-10 animate-scale-in">
          <h1 className="text-9xl font-bold gradient-text mb-4">404</h1>
          <p className="text-3xl text-slate-300 mb-8 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>Page Not Found</p>
          <p className="text-slate-400 mb-8 max-w-md mx-auto animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            The page you're looking for doesn't exist or has been moved.
          </p>
          <Link to="/" className="btn-primary inline-block hover-lift animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
