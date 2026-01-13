import React from 'react';
import { X, Check, AlertTriangle } from 'lucide-react';

const TermsModal = ({ isOpen, onClose, onAgree }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X className="w-6 h-6" />
        </button>
        
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Terms & Conditions</h2>
        
        <div className="prose max-w-none text-gray-700 mb-6">
          <p className="mb-4">
            By using our services, you agree to the following terms and conditions:
          </p>
          
          <ol className="list-decimal pl-5 space-y-2 mb-6">
            <li>This tool is for informational purposes only and does not provide medical advice.</li>
            <li>Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.</li>
            <li>Never disregard professional medical advice or delay in seeking it because of something you have read or seen on this platform.</li>
            <li>We do not store your personal health information without your explicit consent.</li>
            <li>You must be at least 18 years old to use this service.</li>
          </ol>
          
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-5 w-5 text-yellow-400" aria-hidden="true" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  This is not a diagnostic tool. Please consult with a healthcare professional for medical advice.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onAgree();
              onClose();
            }}
            className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 flex items-center"
          >
            <Check className="w-4 h-4 mr-2" />
            I Agree
          </button>
        </div>
      </div>
    </div>
  );
};

export default TermsModal;
