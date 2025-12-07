import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff } from "lucide-react";

export default function Login({ onSwitch }) {
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const closeBtn = document.querySelector(".auth-close-btn");
    if (closeBtn) closeBtn.click();
  };

  return (
    <div className="w-full max-w-md bg-white/40 backdrop-blur-2xl border border-pink-200 rounded-3xl shadow-2xl p-10 animate-fade-in">
      
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
        <h2 className="text-3xl font-bold mt-4 bg-gradient-to-r from-pink-500 to-purple-600 text-transparent bg-clip-text">
          Welcome Back
        </h2>
        <p className="text-gray-600 text-sm">Sign in to continue your journey</p>
      </div>

      {/* Form */}
      <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
        
        {/* Email */}
        <div className="relative group">
          <Mail className="absolute left-4 top-3.5 text-gray-400 group-hover:text-pink-500 transition" />
          <input
            type="email"
            required
            placeholder="Email Address"
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/70 border border-gray-300 focus:ring-2 focus:ring-pink-400 outline-none transition text-gray-900 shadow-sm"
          />
        </div>

        {/* Password */}
        <div className="relative group">
          <Lock className="absolute left-4 top-3.5 text-gray-400 group-hover:text-pink-500 transition" />
          <input
            type={showPassword ? "text" : "password"}
            required
            placeholder="Password"
            className="w-full pl-12 pr-12 py-3 rounded-xl bg-white/70 border border-gray-300 focus:ring-2 focus:ring-pink-400 outline-none transition text-gray-900 shadow-sm"
          />
          
          {/* Eye toggle */}
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-3.5 text-gray-400 hover:text-purple-500 transition"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        {/* Sign In Button */}
        <button className="w-full py-3 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold shadow-lg hover:scale-[1.02] transition-all duration-300">
          Sign In
        </button>
      </form>

      {/* Switch */}
      <div className="mt-6 text-center text-gray-600 text-sm">
        Don’t have an account?
        <button
          className="text-pink-600 font-semibold hover:underline ml-1"
          onClick={onSwitch}
        >
          Sign Up
        </button>
      </div>
    </div>
  );
}
