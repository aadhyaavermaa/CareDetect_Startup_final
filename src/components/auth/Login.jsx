import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff } from "lucide-react";

export default function Login({ onSwitch, onLoginSuccess }) {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Simulate authentication - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simple validation (in real app, this would be server-side)
      if (formData.email && formData.password.length >= 6) {
        // Store user session
        localStorage.setItem('user', JSON.stringify({
          email: formData.email,
          name: formData.email.split('@')[0],
          loginTime: new Date().toISOString()
        }));
        
        onLoginSuccess && onLoginSuccess({
          email: formData.email,
          name: formData.email.split('@')[0]
        });
        
        // Close modal
        const closeBtn = document.querySelector(".auth-close-btn");
        if (closeBtn) closeBtn.click();
      } else {
        setError('Invalid email or password');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-gradient-to-br from-white via-pink-50 to-purple-50 backdrop-blur-2xl border-2 border-pink-200 shadow-xl p-6 animate-fade-in rounded-2xl">
      
      {/* Logo */}
      <div className="flex justify-center mb-6">
        <div className="relative">
          <div className="w-20 h-20 bg-gradient-to-tr from-pink-400 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
            {/* Ovary Icon SVG */}
            <svg className="w-10 h-10 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <ellipse cx="8" cy="12" rx="3" ry="5" stroke="currentColor" strokeWidth="2" fill="currentColor" opacity="0.8"/>
              <ellipse cx="16" cy="12" rx="3" ry="5" stroke="currentColor" strokeWidth="2" fill="currentColor" opacity="0.8"/>
              <path d="M8 7 L12 5 L16 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none"/>
            </svg>
          </div>
          <div className="absolute -top-1 -right-1 w-6 h-6 bg-pink-500 rounded-full animate-pulse flex items-center justify-center">
            <span className="text-white text-xs">🎀</span>
          </div>
        </div>
      </div>
      
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          Welcome Back
        </h2>
        <div className="h-1 w-16 bg-gradient-to-r from-pink-400 to-purple-600 mx-auto rounded-full mb-3"></div>
        <p className="text-gray-600 text-sm">Sign in to continue your health journey</p>
      </div>

      {/* Form */}
      <form className="space-y-4" onSubmit={handleSubmit}>
        
        {/* Email */}
        <div className="group">
          <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-400 group-hover:text-pink-500 transition-colors" />
            </div>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 bg-white/70 backdrop-blur"
            />
          </div>
        </div>

        {/* Password */}
        <div className="group">
          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400 group-hover:text-pink-500 transition-colors" />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter your password"
              className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 bg-white/70 backdrop-blur"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              {showPassword ? <EyeOff className="h-5 w-5 text-gray-400 hover:text-purple-500 transition-colors" /> : <Eye className="h-5 w-5 text-gray-400 hover:text-purple-500 transition-colors" />}
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Sign In Button */}
        <button 
          type="submit"
          disabled={loading}
          className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-all duration-200 transform ${
            loading 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl'
          }`}
        >
          {loading ? 'Signing In...' : 'Sign In'}
        </button>
      </form>

      {/* Switch */}
      <div className="mt-6 text-center">
        <span className="text-sm text-gray-600">Don't have an account? </span>
        <button
          className="text-sm font-medium text-pink-600 hover:text-pink-700 transition-colors"
          onClick={onSwitch}
        >
          Sign Up
        </button>
      </div>
    </div>
  );
}
