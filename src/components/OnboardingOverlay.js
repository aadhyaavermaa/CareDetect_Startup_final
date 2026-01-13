import React, { useEffect, useRef, useState } from "react";
import DoctorModel3D from "./DoctorModel3D";

const steps = [
  {
    selector: ".navbar-logo",
    title: "Welcome to CareDetect! 👋",
    message: "I'm your AI health assistant! Today I'll show you all the features of CareDetect. Let's get started!",
    position: "bottom"
  },
  {
    selector: "nav a[href='#how-it-works']",
    title: "How It Works 🔍",
    message: "This section shows you step-by-step how CareDetect works. It's very easy to understand!",
    position: "bottom"
  },
  {
    selector: "nav button:has-text('🎮 Games')",
    title: "Interactive Games 🎮",
    message: "Here you can play fun educational games! 'Spot the Sign' and 'Myth vs Fact' - learning with entertainment!",
    position: "bottom"
  },
  {
    selector: "nav button:contains('3D Model')",
    title: "3D Breast Model 🫀",
    message: "This interactive 3D model teaches you breast anatomy. Click on different regions to see symptoms!",
    position: "bottom"
  },
  {
    selector: "nav button:contains('Risk Assessment')",
    title: "Risk Assessment 📊",
    message: "Here you can do your personalized breast cancer risk assessment. It's completely free and accurate!",
    position: "bottom"
  },
  {
    selector: "nav button:contains('Genetic Risk')",
    title: "Genetic Risk Calculator 🧬",
    message: "This calculates your risk based on family history and genetics. It's a very important feature!",
    position: "bottom"
  },
  {
    selector: "nav button:contains('Login')",
    title: "Login Account 👤",
    message: "If you have an account, you can login here. Your data will be kept safe!",
    position: "bottom"
  },
  {
    selector: "nav button:contains('Sign Up')",
    title: "Create New Account ✨",
    message: "New user? Create your account here! It's free and takes only 2 minutes!",
    position: "bottom"
  },
  {
    selector: ".hero-section button:first-of-type",
    title: "Start Screening 🚀",
    message: "This is the main button! Here you can start AI-powered breast cancer screening!",
    position: "top"
  },
  {
    selector: ".hero-section button:nth-of-type(2)",
    title: "Watch Demo 📹",
    message: "Want to see a demo first? Click here! The video explains everything!",
    position: "top"
  },
  {
    selector: ".hero-section button:nth-of-type(3)",
    title: "Sweat Detection 💧",
    message: "This is a unique feature! Breast cancer detection using sweat biomarkers - completely non-invasive!",
    position: "top"
  },
  {
    selector: ".games-section",
    title: "Interactive Games Hub 🏆",
    message: "Access games from here! It's the best way to make learning fun!",
    position: "top"
  },
  {
    selector: ".how-it-works",
    title: "How CareDetect Works 📋",
    message: "This is a 4-step process: Start → Upload → AI Analysis → Get Report. Very simple!",
    position: "top"
  },
  {
    selector: ".doctor-model",
    title: "Meet Dr. CareDetect 👩‍⚕️",
    message: "That's me - your AI doctor! I'm always ready to help you. Feel free to ask questions!",
    position: "top"
  },
  {
    selector: "footer",
    title: "Footer Information 📞",
    message: "Here you'll find contact details, links, and company information. Check here if you need help!",
    position: "top"
  },
  {
    selector: ".guide-me-btn",
    title: "Guide Me Button 🎯",
    message: "If you're ever confused, click this button! I'll guide you again. Tour complete! 🎉",
    position: "top"
  }
];

export default function OnboardingOverlay({ stepIndex, onNext, onClose }) {
  const step = steps[stepIndex];
  const highlightRef = useRef();
  const [arrowPos, setArrowPos] = useState(null);
  const speechBubbleRef = useRef();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  useEffect(() => {
    let timeout;
    try {
      // More flexible selector matching with better fallbacks
      let el = document.querySelector(step.selector);
      
      // Improved fallback selectors for better matching
      if (!el && step.selector.includes('🎮 Games')) {
        el = Array.from(document.querySelectorAll('nav button')).find(btn => btn.textContent.includes('Games'));
      }
      if (!el && step.selector.includes('3D Model')) {
        el = Array.from(document.querySelectorAll('nav button')).find(btn => btn.textContent.includes('3D Model'));
      }
      if (!el && step.selector.includes('Risk Assessment')) {
        el = Array.from(document.querySelectorAll('nav button')).find(btn => btn.textContent.includes('Risk Assessment'));
      }
      if (!el && step.selector.includes('Genetic Risk')) {
        el = Array.from(document.querySelectorAll('nav button')).find(btn => btn.textContent.includes('Genetic Risk'));
      }
      if (!el && step.selector.includes('Login')) {
        el = Array.from(document.querySelectorAll('nav button')).find(btn => btn.textContent.includes('Login'));
      }
      if (!el && step.selector.includes('Sign Up')) {
        el = Array.from(document.querySelectorAll('nav button')).find(btn => btn.textContent.includes('Sign Up'));
      }
      if (!el && step.selector === '.navbar-logo') {
        el = document.querySelector('header .flex.items-center.space-x-2') || document.querySelector('header span');
      }
      if (!el && step.selector === 'nav a[href="#how-it-works"]') {
        el = Array.from(document.querySelectorAll('nav a')).find(a => a.textContent.includes('How It Works'));
      }
      if (!el && step.selector === '.hero-section button:first-of-type') {
        el = Array.from(document.querySelectorAll('button')).find(btn => btn.textContent.includes('Start Screening'));
      }
      if (!el && step.selector === '.hero-section button:nth-of-type(2)') {
        el = Array.from(document.querySelectorAll('button')).find(btn => btn.textContent.includes('Watch Demo'));
      }
      if (!el && step.selector === '.hero-section button:nth-of-type(3)') {
        el = Array.from(document.querySelectorAll('button')).find(btn => btn.textContent.includes('Detecting by Sweat'));
      }
      if (!el && step.selector === '.games-section') {
        el = Array.from(document.querySelectorAll('button')).find(btn => btn.textContent.includes('Play Games Now'))?.closest('.games-section') ||
            document.querySelector('.games-section') ||
            Array.from(document.querySelectorAll('div')).find(div => div.textContent.includes('Interactive Health Games'));
      }
      if (!el && step.selector === '.how-it-works') {
        el = Array.from(document.querySelectorAll('h2')).find(h => h.textContent.includes('How CareDetect Works'))?.closest('section');
      }
      if (!el && step.selector === '.doctor-model') {
        el = Array.from(document.querySelectorAll('h3')).find(h => h.textContent.includes('Meet Dr. CareDetect'))?.closest('div');
      }
      if (!el && step.selector === '.guide-me-btn') {
        el = Array.from(document.querySelectorAll('button')).find(btn => btn.textContent.includes('Guide Me'));
      }
      if (!el && step.selector === 'footer') {
        el = document.querySelector('footer');
      }

      if (el) {
        // Scroll element into view
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        
        // Add highlight with stronger visual effect
        el.classList.add("onboarding-highlight");
        highlightRef.current = el;
        
        // Calculate arrow position - simple and direct
        setTimeout(() => {
          const rect = el.getBoundingClientRect();
          const bubbleRect = speechBubbleRef.current?.getBoundingClientRect();
          
          if (bubbleRect && rect) {
            // Arrow from speech bubble to target element
            const startX = bubbleRect.left + bubbleRect.width - 20;
            const startY = bubbleRect.top + bubbleRect.height / 2;
            const endX = rect.left + rect.width / 2;
            const endY = rect.top + rect.height / 2;
            
            console.log('Arrow positions calculated:', { 
              startX: Math.round(startX), 
              startY: Math.round(startY), 
              endX: Math.round(endX), 
              endY: Math.round(endY),
              bubbleRect: {
                left: Math.round(bubbleRect.left),
                top: Math.round(bubbleRect.top),
                width: Math.round(bubbleRect.width),
                height: Math.round(bubbleRect.height)
              },
              targetRect: {
                left: Math.round(rect.left),
                top: Math.round(rect.top),
                width: Math.round(rect.width),
                height: Math.round(rect.height)
              }
            });
            
            setArrowPos({
              startX,
              startY,
              endX,
              endY
            });
          }
        }, 500); // Reduced timeout for faster arrow appearance
      } else {
        console.log('Element not found for selector:', step.selector);
      }
      // Removed automatic timeout - now completely user controlled
    } catch (e) {
      // If element not found, just continue without auto-advancing
      console.log('Element not found for selector:', step.selector);
    }
    
    return () => {
      if (highlightRef.current) {
        highlightRef.current.classList.remove("onboarding-highlight");
      }
      setArrowPos(null);
    };
  }, [step.selector, step.position, onNext]);

  // Simple arrow that actually works
  const Arrow = () => {
    if (!arrowPos) return null;
    
    const { startX, startY, endX, endY } = arrowPos;
    
    // Calculate distance and angle
    const dx = endX - startX;
    const dy = endY - startY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const angle = Math.atan2(dy, dx) * 180 / Math.PI;
    
    return (
      <div
        className="fixed pointer-events-none z-[10001]"
        style={{
          left: `${startX}px`,
          top: `${startY}px`,
          width: `${distance}px`,
          height: '4px',
          transformOrigin: '0 50%',
          transform: `rotate(${angle}deg)`,
        }}
      >
        {/* Arrow line */}
        <div className="w-full h-full bg-gradient-to-r from-pink-500 to-purple-600 relative">
          {/* Animated dashes */}
          <div 
            className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-600"
            style={{
              backgroundImage: 'repeating-linear-gradient(90deg, transparent 0px, transparent 8px, white 8px, white 12px)',
              animation: 'dash-move 2s linear infinite'
            }}
          />
          
          {/* Arrow head */}
          <div 
            className="absolute right-0 top-1/2 transform -translate-y-1/2"
            style={{
              width: '0',
              height: '0',
              borderLeft: '12px solid #ec4899',
              borderTop: '8px solid transparent',
              borderBottom: '8px solid transparent',
              right: '-6px'
            }}
          />
        </div>
        
        <style jsx>{`
          @keyframes dash-move {
            0% { background-position: 0px 0px; }
            100% { background-position: 20px 0px; }
          }
        `}</style>
      </div>
    );
  };

  return (
    <div
      className={`fixed inset-0 z-[9999] bg-black/70 backdrop-blur-sm transition-all duration-500 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      style={{ pointerEvents: "auto" }}
    >
      <style jsx>{`
        @keyframes dash-move {
          0% { background-position: 0px 0px; }
          100% { background-position: 20px 0px; }
        }
        .onboarding-highlight {
          position: relative;
          z-index: 10000;
          box-shadow: 0 0 0 6px rgba(236, 72, 153, 0.9), 0 0 30px rgba(236, 72, 153, 0.7) !important;
          border-radius: 12px !important;
          animation: pulse-highlight 2s infinite;
          background-color: rgba(236, 72, 153, 0.1) !important;
        }
        @keyframes pulse-highlight {
          0%, 100% { 
            box-shadow: 0 0 0 6px rgba(236, 72, 153, 0.9), 0 0 30px rgba(236, 72, 153, 0.7);
            transform: scale(1);
          }
          50% { 
            box-shadow: 0 0 0 10px rgba(236, 72, 153, 1), 0 0 40px rgba(236, 72, 153, 0.9);
            transform: scale(1.02);
          }
        }
      `}</style>
      
      <Arrow />
      
      {/* Enhanced Speech Bubble */}
      <div
        className={`fixed transition-all duration-500 ${
          step.position === 'bottom' ? 'bottom-32' : 'top-32'
        } left-8 z-[10002] w-full max-w-4xl px-4`}
      >
        <div className="flex items-center space-x-8 justify-start">
          {/* Doctor Avatar - positioned on left, larger and more visible */}
          <div className="w-40 h-40 flex-shrink-0 relative">
            <DoctorModel3D />
          </div>
          
          {/* Speech Bubble */}
          <div
            ref={speechBubbleRef}
            className="bg-white rounded-2xl p-6 shadow-2xl border-2 border-pink-200 max-w-lg relative"
            style={{
              background: "linear-gradient(135deg, #ffffff 0%, #fdf2f8 100%)",
            }}
          >
            {/* Bubble Tail - positioned to point from doctor to bubble */}
            <div className="absolute w-6 h-6 bg-white border-l-2 border-b-2 border-pink-200 transform rotate-45 left-0 top-1/2 -translate-x-3 -translate-y-1/2"></div>
            
            {/* Content */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <span className="text-2xl">{step.title?.split(' ')[step.title?.split(' ').length - 1]}</span>
                <h3 className="font-bold text-lg text-pink-600">{step.title?.replace(/[^\w\s]/gi, '')}</h3>
              </div>
              <p className="text-gray-700 text-sm leading-relaxed">{step.message}</p>
              
              {/* Progress Bar */}
              <div className="flex items-center space-x-2 mt-4">
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-pink-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${((stepIndex + 1) / steps.length) * 100}%` }}
                  ></div>
                </div>
                <span className="text-xs text-gray-500 font-semibold">
                  {stepIndex + 1}/{steps.length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Control Buttons */}
      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-[10003] flex space-x-4">
        <button
          className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-full font-semibold shadow-lg hover:scale-105 transition-all duration-300 flex items-center space-x-2"
          onClick={onNext}
        >
          <span>{stepIndex === steps.length - 1 ? "🎉 Complete Tour" : "➡️ Next"}</span>
        </button>
        
        {stepIndex > 0 && (
          <button
            className="px-6 py-3 bg-gray-600 text-white rounded-full font-semibold shadow-lg hover:scale-105 transition-all duration-300"
            onClick={() => onNext(stepIndex - 1)}
          >
            ⬅️ Previous
          </button>
        )}
        
        <button
          className="px-4 py-3 bg-white/20 text-white rounded-full font-semibold shadow-lg hover:bg-white/30 transition-all duration-300 text-sm"
          onClick={onClose}
        >
          ❌ Skip Tour
        </button>
      </div>
    </div>
  );
} 