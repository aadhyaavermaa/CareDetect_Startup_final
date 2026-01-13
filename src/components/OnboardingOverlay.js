import React, { useEffect, useRef, useState } from "react";
import DoctorModel3D from "./DoctorModel3D";

const steps = [
  {
    selector: ".navbar-logo",
    title: "Welcome to CareDetect! 👋",
    message: "Main aapka AI health assistant hun! Aaj main aapko CareDetect ke saare features dikhaunga. Chaliye shuru karte hain!",
    position: "bottom"
  },
  {
    selector: "nav a[href='#how-it-works']",
    title: "How It Works 🔍",
    message: "Yeh section aapko step-by-step batata hai ki CareDetect kaise kaam karta hai. Bahut easy hai!",
    position: "bottom"
  },
  {
    selector: "nav button:has-text('🎮 Games')",
    title: "Interactive Games 🎮",
    message: "Yahan se aap fun games khel sakte hain! 'Spot the Sign' aur 'Myth vs Fact' - learning ke saath entertainment!",
    position: "bottom"
  },
  {
    selector: "nav button:contains('3D Model')",
    title: "3D Breast Model 🫀",
    message: "Yeh interactive 3D model aapko breast anatomy sikhata hai. Different regions click kar ke symptoms dekh sakte hain!",
    position: "bottom"
  },
  {
    selector: "nav button:contains('Risk Assessment')",
    title: "Risk Assessment 📊",
    message: "Yahan aap apna personalized breast cancer risk assessment kar sakte hain. Bilkul free aur accurate!",
    position: "bottom"
  },
  {
    selector: "nav button:contains('Genetic Risk')",
    title: "Genetic Risk Calculator 🧬",
    message: "Family history aur genetics ke basis par aapka risk calculate karta hai. Bahut important feature hai!",
    position: "bottom"
  },
  {
    selector: "nav button:contains('Login')",
    title: "Login Account 👤",
    message: "Agar aapka account hai to yahan se login kar sakte hain. Aapka data safe rahega!",
    position: "bottom"
  },
  {
    selector: "nav button:contains('Sign Up')",
    title: "Create New Account ✨",
    message: "Naya user hain? Yahan se account banayiye! Free hai aur sirf 2 minute lagega!",
    position: "bottom"
  },
  {
    selector: ".hero-section button:first-of-type",
    title: "Start Screening 🚀",
    message: "Yeh main button hai! Yahan se aap AI-powered breast cancer screening shuru kar sakte hain!",
    position: "top"
  },
  {
    selector: ".hero-section button:nth-of-type(2)",
    title: "Watch Demo 📹",
    message: "Pehle demo dekhna chahte hain? Yahan click kariye! Video mein sab kuch samjhaya gaya hai!",
    position: "top"
  },
  {
    selector: ".hero-section button:nth-of-type(3)",
    title: "Sweat Detection 💧",
    message: "Yeh unique feature hai! Sweat biomarkers se breast cancer detection - bilkul non-invasive!",
    position: "top"
  },
  {
    selector: ".games-section",
    title: "Interactive Games Hub 🏆",
    message: "Yahan se games access kar sakte hain! Learning ko fun banane ka best tarika hai!",
    position: "top"
  },
  {
    selector: ".how-it-works",
    title: "How CareDetect Works 📋",
    message: "Yeh 4-step process hai: Start → Upload → AI Analysis → Get Report. Bahut simple!",
    position: "top"
  },
  {
    selector: ".doctor-model",
    title: "Meet Dr. CareDetect 👩‍⚕️",
    message: "Main hun aapka AI doctor! Hamesha aapki help ke liye ready hun. Questions puchiye!",
    position: "top"
  },
  {
    selector: "footer",
    title: "Footer Information 📞",
    message: "Yahan aapko contact details, links, aur company information milti hai. Help chahiye to yahan dekh sakte hain!",
    position: "top"
  },
  {
    selector: ".guide-me-btn",
    title: "Guide Me Button 🎯",
    message: "Kabhi bhi confused ho to yeh button click kariye! Main phir se guide kar dungi. Tour complete! 🎉",
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
      // More flexible selector matching
      let el = document.querySelector(step.selector);
      
      // Fallback selectors for better matching
      if (!el && step.selector.includes('🎮 Games')) {
        el = document.querySelector('nav button[onclick*="setShowGameHub"]') || 
            Array.from(document.querySelectorAll('nav button')).find(btn => btn.textContent.includes('Games'));
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
        el = document.querySelector('.flex.items-center.space-x-2') || document.querySelector('header .flex.items-center');
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
      if (!el && step.selector === '.project-features') {
        el = document.querySelector('section h2') && Array.from(document.querySelectorAll('h2')).find(h => h.textContent.includes('Project Features'))?.closest('section');
      }
      if (!el && step.selector === '.games-section') {
        el = Array.from(document.querySelectorAll('button')).find(btn => btn.textContent.includes('Play Games Now'))?.closest('div');
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

      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        el.classList.add("onboarding-highlight");
        highlightRef.current = el;
        
        // Calculate arrow position - improved accuracy
        setTimeout(() => {
          const rect = el.getBoundingClientRect();
          const bubbleRect = speechBubbleRef.current?.getBoundingClientRect();
          if (bubbleRect) {
            const isBottom = step.position === 'bottom';
            
            // Better arrow positioning from bubble edge to element center
            setArrowPos({
              startX: bubbleRect.right - 20, // Start from right edge of bubble
              startY: bubbleRect.top + bubbleRect.height / 2, // Middle of bubble
              endX: rect.left + rect.width / 2, // Center of target element
              endY: isBottom ? rect.top - 10 : rect.bottom + 10, // Slightly offset from element
              isBottom
            });
          }
        }, 300);
      } else {
        timeout = setTimeout(() => {
          onNext();
        }, 1000);
      }
    } catch (e) {
      timeout = setTimeout(() => {
        onNext();
      }, 1000);
    }
    
    return () => {
      if (highlightRef.current) {
        highlightRef.current.classList.remove("onboarding-highlight");
      }
      if (timeout) clearTimeout(timeout);
      setArrowPos(null);
    };
  }, [step.selector, step.position, onNext]);

  // Simple and effective arrow
  const Arrow = () => {
    if (!arrowPos) return null;
    const { startX, startY, endX, endY } = arrowPos;
    
    // Calculate better arrow positioning
    const deltaX = endX - startX;
    const deltaY = endY - startY;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    
    // Create a smooth curved path
    const controlX = startX + deltaX * 0.7;
    const controlY = startY + deltaY * 0.3 - 50; // Add curve
    
    const width = Math.abs(endX - startX) + 200;
    const height = Math.abs(endY - startY) + 200;
    const left = Math.min(startX, endX) - 100;
    const top = Math.min(startY, endY) - 100;

    const path = `M${startX - left},${startY - top} Q${controlX - left},${controlY - top} ${endX - left},${endY - top}`;
    
    return (
      <svg
        style={{
          position: "fixed",
          left,
          top,
          pointerEvents: "none",
          zIndex: 10001,
        }}
        width={width}
        height={height}
      >
        <defs>
          <marker id="arrowhead" markerWidth="15" markerHeight="15" refX="12" refY="7.5" orient="auto">
            <polygon points="0,0 15,7.5 0,15 3,7.5" fill="#ec4899" />
          </marker>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        <path
          d={path}
          stroke="#ec4899"
          strokeWidth="3"
          fill="none"
          markerEnd="url(#arrowhead)"
          filter="url(#glow)"
          style={{ 
            strokeDasharray: "8,4",
            animation: "dash 1.5s linear infinite"
          }}
        />
      </svg>
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
        @keyframes dash {
          to {
            stroke-dashoffset: -24;
          }
        }
        .onboarding-highlight {
          position: relative;
          z-index: 10000;
          box-shadow: 0 0 0 4px rgba(236, 72, 153, 0.8), 0 0 20px rgba(236, 72, 153, 0.5) !important;
          border-radius: 8px !important;
          animation: pulse-highlight 2s infinite;
        }
        @keyframes pulse-highlight {
          0%, 100% { 
            box-shadow: 0 0 0 4px rgba(236, 72, 153, 0.8), 0 0 20px rgba(236, 72, 153, 0.5);
          }
          50% { 
            box-shadow: 0 0 0 8px rgba(236, 72, 153, 1), 0 0 30px rgba(236, 72, 153, 0.7);
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
          <div className="w-40 h-40 flex-shrink-0 relative bg-white/90 rounded-2xl p-4 shadow-xl border-2 border-pink-200">
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