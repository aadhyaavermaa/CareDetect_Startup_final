import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, Sparkles, User } from "lucide-react";

export default function SignUp({ onSwitch, onSignUpSuccess }) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
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
      // Basic validation
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        setLoading(false);
        return;
      }

      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters');
        setLoading(false);
        return;
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Store user session
      const userData = {
        name: formData.name,
        email: formData.email,
        signupTime: new Date().toISOString()
      };
      
      localStorage.setItem('user', JSON.stringify(userData));
      
      onSignUpSuccess && onSignUpSuccess(userData);
      
      // Close modal
      const closeBtn = document.querySelector(".auth-close-btn");
      if (closeBtn) closeBtn.click();
      
    } catch (err) {
      setError('Signup failed. Please try again.');
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
            <Sparkles className="text-white w-10 h-10" />
          </div>
          <div className="absolute -top-1 -right-1 w-6 h-6 bg-pink-500 rounded-full animate-pulse"></div>
        </div>
      </div>
      
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          Create Account
        </h2>
        <div className="h-1 w-16 bg-gradient-to-r from-pink-400 to-purple-600 mx-auto rounded-full mb-3"></div>
        <p className="text-gray-600 text-sm">Join us on your health journey</p>
      </div>

      {/* Form */}
      <form className="space-y-4" onSubmit={handleSubmit}>
        
        {/* Name */}
        <div className="group">
          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-gray-400 group-hover:text-pink-500 transition-colors" />
            </div>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter your full name"
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 bg-white/70 backdrop-blur"
            />
          </div>
        </div>

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
              placeholder="Create a password"
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

        {/* Confirm Password */}
        <div className="group">
          <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400 group-hover:text-pink-500 transition-colors" />
            </div>
            <input
              type={showConfirm ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              placeholder="Confirm your password"
              className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 bg-white/70 backdrop-blur"
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              {showConfirm ? <EyeOff className="h-5 w-5 text-gray-400 hover:text-purple-500 transition-colors" /> : <Eye className="h-5 w-5 text-gray-400 hover:text-purple-500 transition-colors" />}
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Sign Up Button */}
        <button 
          type="submit"
          disabled={loading}
          className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-all duration-200 transform ${
            loading 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl'
          }`}
        >
          {loading ? 'Creating Account...' : 'Sign Up'}
        </button>
      </form>

      {/* Switch */}
      <div className="mt-6 text-center">
        <span className="text-sm text-gray-600">Already have an account? </span>
        <button
          className="text-sm font-medium text-pink-600 hover:text-pink-700 transition-colors"
          onClick={onSwitch}
        >
          Sign In
        </button>
      </div>
    </div>
  );
}