import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import Login from './auth/Login';
import SignUp from './auth/SignUp';

const AuthModal = ({ isOpen, onClose, onLogin, onSignUp }) => {
  const [currentMode, setCurrentMode] = useState('login');

  // Reset to login mode when modal opens
  useEffect(() => {
    if (isOpen) {
      setCurrentMode('login');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSwitch = () => {
    console.log('Switch clicked, current mode:', currentMode);
    setCurrentMode(currentMode === 'login' ? 'signup' : 'login');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md relative">
        <button 
          onClick={onClose}
          data-modal-close
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 z-10"
        >
          <X className="w-6 h-6" />
        </button>
        
        <div className="p-6">
          {currentMode === 'login' ? (
            <Login onSwitch={handleSwitch} />
          ) : (
            <SignUp onSwitch={handleSwitch} />
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
