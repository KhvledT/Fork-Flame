import React from 'react';
import { Link } from 'react-router-dom';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-8 text-center">
      <div>
        <div className="text-8xl mb-4">🧭</div>
        <h1 className="text-3xl font-bold mb-2">Page not found</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">The page you are looking for doesn’t exist.</p>
        <Link to="/" className="btn-primary inline-block">Go home</Link>
      </div>
    </div>
  );
};

export default NotFound;


