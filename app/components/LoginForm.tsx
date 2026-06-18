'use client';

import React, { useState, useEffect } from 'react';

interface LoginFormProps {
  loginDisabled?: boolean;
  onAuthenticated: () => void;
}

const VALID_USERNAME = 'holman';
const VALID_PASSWORD = '12345';

export default function LoginForm({ loginDisabled = true, onAuthenticated }: LoginFormProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showError, setShowError] = useState(false);
  const [isVisible, setIsVisible] = useState(!loginDisabled);

  useEffect(() => {
    if (loginDisabled) {
      onAuthenticated();
      return;
    }

    // Check if already authenticated
    const isAuthenticated = sessionStorage.getItem('authenticated') === 'true';
    if (isAuthenticated) {
      onAuthenticated();
    } else {
      setIsVisible(true);
    }
  }, [loginDisabled, onAuthenticated]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (username === VALID_USERNAME && password === VALID_PASSWORD) {
      sessionStorage.setItem('authenticated', 'true');
      setIsVisible(false);
      onAuthenticated();
    } else {
      setShowError(true);
      setUsername('');
      setPassword('');
    }
  };

  if (loginDisabled || !isVisible) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Sign In</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          {showError && (
            <div className="text-red-500 text-sm">
              Invalid username or password. Please try again.
            </div>
          )}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors duration-200 font-medium"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}
