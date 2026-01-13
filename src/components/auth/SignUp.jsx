import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, User, AlertCircle, CheckCircle } from "lucide-react";
import { useAuth } from '../../contexts/AuthContext';

export default function SignUp({ onSwitch }) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const { signup } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear messages when user starts typing
    if (message.text) {
      setMessage({ type: '', text: '' });
    }
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setMessage({ type: 'error', text: 'Name is required' });
      return false;
    }
    if (!formData.email.trim()) {
      setMessage({ type: 'error', text: 'Email is required' });
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setMessage({ type: 'error', text: 'Please enter a valid email' });
      return false;
    }
    if (formData.password.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters' });
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match' });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    
    try {
      const result = await signup(formData);
      
      if (result.success) {
        setMessage({ type: 'success', text: 'Account created successfully! Welcome to CareDetect!' });
        
        // Close modal after 2 seconds
        setTimeout(() => {
          const closeBtn = document.querySelector('[data-modal-close]');
          if (closeBtn) closeBtn.click();
        }, 2000);
      } else {
        setMessage({ type: 'error', text: result.error || 'Failed to create account' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      
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
      
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 text-transparent bg-clip-text mb-2">
          Create Account
        </h2>
        <p className="text-gray-600 text-sm">Join us on your health journey</p>
      </div>

      {/* Message Display */}
      {message.text && (
        <div className={`mb-4 p-3 rounded-lg flex items-center gap-2 ${
          message.type === 'error' 
            ? 'bg-red-50 text-red-700 border border-red-200' 
            : 'bg-green-50 text-green-700 border border-green-200'
        }`}>
          {message.type === 'error' ? (
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
          ) : (
            <CheckCircle className="w-4 h-4 flex-shrink-0" />
          )}
          <span className="text-sm">{message.text}</span>
        </div>
      )}

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="relative group">
          <User className="absolute left-4 top-3.5 text-gray-400 group-hover:text-pink-500 transition" />
          <input 
            type="text" 
            name="name"
            value={formData.name}
            onChange={handleChange}
            required 
            placeholder="Full Name" 
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/70 border border-gray-300 focus:ring-2 focus:ring-pink-400 outline-none transition text-gray-900 shadow-sm"
            disabled={isLoading}
          />
        </div>

        <div className="relative group">
          <Mail className="absolute left-4 top-3.5 text-gray-400 group-hover:text-pink-500 transition" />
          <input 
            type="email" 
            name="email"
            value={formData.email}
            onChange={handleChange}
            required 
            placeholder="Email Address" 
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/70 border border-gray-300 focus:ring-2 focus:ring-pink-400 outline-none transition text-gray-900 shadow-sm"
            disabled={isLoading}
          />
        </div>

        <div className="relative group">
          <Lock className="absolute left-4 top-3.5 text-gray-400 group-hover:text-pink-500 transition" />
          <input 
            type={showPassword ? 'text' : 'password'} 
            name="password"
            value={formData.password}
            onChange={handleChange}
            required 
            placeholder="Password (min 6 characters)" 
            className="w-full pl-12 pr-12 py-3 rounded-xl bg-white/70 border border-gray-300 focus:ring-2 focus:ring-pink-400 outline-none transition text-gray-900 shadow-sm"
            disabled={isLoading}
          />
          <button 
            type="button" 
            className="absolute right-4 top-3.5 text-gray-400 hover:text-purple-500 transition" 
            onClick={() => setShowPassword(!showPassword)}
            disabled={isLoading}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        <div className="relative group">
          <Lock className="absolute left-4 top-3.5 text-gray-400 group-hover:text-pink-500 transition" />
          <input 
            type={showConfirm ? 'text' : 'password'} 
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required 
            placeholder="Confirm Password" 
            className="w-full pl-12 pr-12 py-3 rounded-xl bg-white/70 border border-gray-300 focus:ring-2 focus:ring-pink-400 outline-none transition text-gray-900 shadow-sm"
            disabled={isLoading}
          />
          <button 
            type="button" 
            className="absolute right-4 top-3.5 text-gray-400 hover:text-purple-500 transition" 
            onClick={() => setShowConfirm(!showConfirm)}
            disabled={isLoading}
          >
            {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        <button 
          type="submit" 
          disabled={isLoading}
          className={`w-full py-3 rounded-xl font-semibold shadow-lg transition-all duration-300 ${
            isLoading 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:scale-[1.02]'
          }`}
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Creating Account...
            </div>
          ) : (
            'Create Account'
          )}
        </button>
      </form>

      <div className="mt-6 text-center text-gray-600 text-sm">
        Already have an account?
        <button
          className="text-pink-600 font-semibold hover:underline ml-1"
          onClick={onSwitch}
          disabled={isLoading}
        >
          Sign In
        </button>
      </div>
    </div>
  );
}