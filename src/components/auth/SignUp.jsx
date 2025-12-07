import React, { useState } from 'react';

export default function SignUp({ onSwitch }) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate signup success: close modal or show success (call onSwitch if needed)
    if (typeof window !== 'undefined') {
      // Try to close modal if possible
      const closeBtn = document.querySelector('.fixed .absolute.top-4.right-4');
      if (closeBtn) closeBtn.click();
    }
    // Optionally, show a toast or message here
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-200 via-purple-100 to-blue-200">
      <div className="backdrop-blur-xl bg-white/60 border border-pink-100 rounded-3xl shadow-2xl p-10 w-full max-w-md flex flex-col items-center animate-fade-in">
        <h2 className="text-3xl font-extrabold text-pink-600 mb-8 font-lexend tracking-tight drop-shadow-lg text-center">Create Your Account</h2>
        <form className="w-full flex flex-col gap-6" onSubmit={handleSubmit}>
          <div className="relative">
            <input type="text" required placeholder="Name" className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-purple-400 transition text-gray-900" />
          </div>
          <div className="relative">
            <input type="email" required placeholder="Email" className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-purple-400 transition text-gray-900" />
          </div>
          <div className="relative">
            <input type={showPassword ? 'text' : 'password'} required placeholder="Password" className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-purple-400 transition text-gray-900" />
            <button type="button" className="absolute right-4 top-3 text-gray-400 hover:text-purple-500" onClick={() => setShowPassword(v => !v)}>
              {showPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10 0-1.657.402-3.221 1.125-4.575M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0zm2.121-2.121A9.969 9.969 0 0122 12c0 5.523-4.477 10-10 10S2 17.523 2 12c0-2.21.896-4.21 2.343-5.657" /></svg>
              )}
            </button>
          </div>
          <div className="relative">
            <input type={showConfirm ? 'text' : 'password'} required placeholder="Confirm Password" className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-purple-400 transition text-gray-900" />
            <button type="button" className="absolute right-4 top-3 text-gray-400 hover:text-purple-500" onClick={() => setShowConfirm(v => !v)}>
              {showConfirm ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10 0-1.657.402-3.221 1.125-4.575M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0zm2.121-2.121A9.969 9.969 0 0122 12c0 5.523-4.477 10-10 10S2 17.523 2 12c0-2.21.896-4.21 2.343-5.657" /></svg>
              )}
            </button>
          </div>
          <button type="submit" className="w-full py-3 rounded-lg bg-purple-600 text-white font-semibold hover:bg-purple-700 transition">Sign Up</button>
        </form>
        <div className="mt-5 text-gray-500 text-sm">Already have an account? <button className="text-purple-600 font-semibold hover:underline" onClick={onSwitch}>Sign In</button></div>
      </div>
    </div>
  );
} 