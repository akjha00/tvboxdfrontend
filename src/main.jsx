import React from 'react';
import './index.css';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthProvider } from './context/AuthContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
    <React.StrictMode>
      <AuthProvider>
          <App />
      </AuthProvider>
    </React.StrictMode>
  </div>
);