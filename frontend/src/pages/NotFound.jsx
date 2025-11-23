import React from 'react';
import { Link } from 'react-router-dom';
import { GradientText, Button } from '../components/UI';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="container-custom py-20 text-center">
        {/* Floating shapes in background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-64 h-64 bg-neonBlue/10 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-neonPurple/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        </div>
        
        <div className="relative z-10 animate-scale-in">
          <h1 className="text-9xl font-bold mb-4"><GradientText>404</GradientText></h1>
          <p className="text-3xl text-white mb-8 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>Page Not Found</p>
          <p className="text-gray-400 mb-8 max-w-md mx-auto animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            The page you're looking for doesn't exist or has been moved.
          </p>
          <Link to="/" className="inline-block animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <Button variant="primary">Back to Home</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
