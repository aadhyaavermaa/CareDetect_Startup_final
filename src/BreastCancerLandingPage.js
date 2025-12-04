import React, { useState, useEffect } from 'react';
import { Heart, Shield, Zap, Users, ArrowRight, Play, CheckCircle, Star, AlertTriangle, User, Users as UsersIcon, Droplets, UserPlus, UserCircle, RotateCcw, Pause, ArrowRightCircle } from 'lucide-react';
import BreastCancerScreening from './BreastCancerScreening';
import DoctorScene from './components/DoctorModel';
import { BreastModel } from './components/BreastModel';
import { speak } from './components/TextToSpeech';
import SweatBiomarkerDetection from './SweatBiomarkerDetection';
import Login from './components/auth/Login';
import SignUp from './components/auth/SignUp';
import OnboardingOverlay from "./components/OnboardingOverlay";

function FamilyHealthDashboard({ open, onClose }) {
  const [family, setFamily] = useState([
    { relation: 'Grandmother', cancer: false, age: '', genetic: false, risk: [] },
    { relation: 'Mother', cancer: false, age: '', genetic: false, risk: [] },
    { relation: 'You', cancer: false, age: '', genetic: false, risk: [] },
  ]);
  const [selected, setSelected] = useState(2); // Default to 'You'

  // Controlled input states
  const member = family[selected];

  // Risk calculation logic
  function calculateRisk() {
    let risk = 12; // baseline risk %
    let firstDegree = 0;
    let extra = 0;
    family.forEach((m, idx) => {
      if (m.cancer) {
        if (m.relation === 'Mother' || m.relation === 'Sister' || m.relation === 'You') firstDegree++;
        else extra++;
      }
    });
    if (firstDegree > 0) risk += 20;
    if (firstDegree > 1) risk += 10 * (firstDegree - 1);
    if (extra > 0) risk += 5 * extra;
    if (member.age && Number(member.age) < 50) risk += 10;
    if (member.genetic) risk += 10;
    if (member.risk.includes('Smoking')) risk += 5;
    if (member.risk.includes('Drinking')) risk += 5;
    if (member.risk.includes('Lifestyle')) risk += 5;
    return Math.min(Math.round(risk), 99);
  }

  const riskScore = calculateRisk();

  // Handlers
  function updateField(field, value) {
    setFamily(fam => fam.map((m, i) => i === selected ? { ...m, [field]: value } : m));
  }
  function updateRisk(factor) {
    setFamily(fam => fam.map((m, i) => i === selected ? { ...m, risk: m.risk.includes(factor) ? m.risk.filter(f => f !== factor) : [...m.risk, factor] } : m));
  }
  function updateRelation(val) {
    setFamily(fam => fam.map((m, i) => i === selected ? { ...m, relation: val } : m));
  }

  // Helper for relation icon
  function getRelationIcon(relation, selected) {
    const base = 'inline w-5 h-5';
    switch (relation) {
      case 'Grandmother':
        return <UserPlus className={base + (selected ? ' text-pink-500' : ' text-pink-400')} />;
      case 'Mother':
        return <UserCircle className={base + (selected ? ' text-purple-500' : ' text-pink-400')} />;
      case 'Sister':
        return <UsersIcon className={base + (selected ? ' text-pink-500' : ' text-pink-400')} />;
      case 'You':
        return <User className={base + (selected ? ' text-purple-600' : ' text-purple-400')} />;
      default:
        return <UsersIcon className={base + (selected ? ' text-pink-500' : ' text-pink-400')} />;
    }
  }

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div className="backdrop-blur-2xl bg-white/80 border border-pink-100 rounded-3xl shadow-2xl p-0 w-full max-w-2xl flex flex-col items-center animate-fade-in relative overflow-y-auto max-h-screen" onClick={e => e.stopPropagation()} style={{boxShadow: '0 8px 32px 0 rgba(255, 182, 193, 0.25)'}}>
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-pink-500 text-2xl font-bold">&times;</button>
        <div className="p-8 w-full flex flex-col items-center">
          <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600 mb-6 font-lexend tracking-tight drop-shadow-lg text-center" style={{letterSpacing: '0.03em'}}>Family Health Dashboard</h2>
          {/* Family Tree Visualizer */}
          <div className="w-full flex flex-col items-center mb-8">
            <div className="flex flex-col items-center gap-3">
              {family.map((m, idx) => (
                <div
                  key={idx}
                  className={`flex items-center gap-3 px-6 py-2 rounded-xl cursor-pointer transition-all duration-200
                    ${selected === idx
                      ? 'bg-gradient-to-r from-pink-100/80 to-purple-100/80 shadow-xl scale-105 ring-2 ring-pink-400/60'
                      : 'hover:bg-pink-50 hover:scale-105 hover:shadow-lg'}
                  `}
                  onClick={() => setSelected(idx)}
                  style={{ minWidth: 220 }}
                >
                  <span className={`text-lg font-bold flex items-center gap-2 ${selected === idx ? 'text-pink-600' : 'text-gray-700'}`}
                    style={{ letterSpacing: '0.01em' }}
                  >
                    {getRelationIcon(m.relation, selected === idx)}
                    {m.relation}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-2 text-xs text-gray-500">Click a family member to edit their info. (Add more coming soon!)</div>
          </div>
          {/* Minimal Data Entry */}
          <div className="w-full flex flex-col gap-6 mb-8 max-w-md">
            <div className="flex gap-3 items-center">
              <span className="font-semibold text-gray-800">Relation:</span>
              <select className="rounded-xl px-3 py-2 border border-pink-200 bg-white/60 backdrop-blur-md shadow-inner focus:outline-none focus:ring-2 focus:ring-pink-300 transition-all" value={member.relation} onChange={e => updateRelation(e.target.value)}>
                <option>Mother</option>
                <option>Sister</option>
                <option>Grandmother</option>
                <option>You</option>
                <option>Other</option>
              </select>
            </div>
            <CustomCheckbox
              label="Breast Cancer?"
              checked={member.cancer}
              onChange={e => updateField('cancer', e.target.checked)}
            />
            <div className="flex gap-3 items-center">
              <span className="font-semibold text-gray-800">Age at Diagnosis:</span>
              <input type="number" min="0" className="rounded-xl px-3 py-2 border border-pink-200 bg-white/60 backdrop-blur-md shadow-inner focus:outline-none focus:ring-2 focus:ring-pink-300 transition-all w-28" value={member.age} onChange={e => updateField('age', e.target.value)} />
            </div>
            <CustomCheckbox
              label="Genetic Testing?"
              checked={member.genetic}
              onChange={e => updateField('genetic', e.target.checked)}
            />
            <div className="flex gap-3 items-center flex-wrap">
              <span className="font-semibold text-gray-800">Risk Factors:</span>
              {['Smoking', 'Drinking', 'Lifestyle'].map(factor => (
                <CustomCheckbox
                  key={factor}
                  label={factor}
                  checked={member.risk.includes(factor)}
                  onChange={() => updateRisk(factor)}
                  className="ml-2"
                />
              ))}
            </div>
          </div>
          {/* Risk Score */}
          <div className="w-full flex flex-col items-center mb-4">
            <div className="text-lg font-bold text-purple-600">Your estimated risk: <span className="text-pink-600 text-2xl animate-pulse">{riskScore}%</span> <span className="text-base text-gray-600 font-normal">lifetime risk</span></div>
            <div className="text-xs text-gray-500">(Personalized risk score based on your family and lifestyle data)</div>
          </div>
          {/* Privacy Notice */}
          <div className="w-full text-xs text-gray-500 text-center mt-2">
            We store only minimal data, fully user-controlled, privacy focused. All fields are optional. Sharing requires your consent.
          </div>
        </div>
      </div>
    </div>
  );
}

function CustomCheckbox({ label, checked, onChange, className = '' }) {
  return (
    <label className={`flex items-center gap-2 cursor-pointer group ${className}`}>
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="hidden"
      />
      <span className={`w-6 h-6 rounded-full border-2 border-pink-300 flex items-center justify-center transition-all duration-200
        ${checked ? 'bg-gradient-to-br from-pink-400 to-purple-400 border-pink-500 shadow-md' : 'bg-white/60'}
        group-hover:ring-2 group-hover:ring-pink-200
      `}>
        {checked && (
          <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
            <path d="M5 13l4 4L19 7" />
          </svg>
        )}
      </span>
      <span className="select-none text-gray-700 group-hover:text-pink-600 transition-colors font-semibold">{label}</span>
    </label>
  );
}

export default function BreastCancerLandingPage() {
    // Risk Assessment Modal placeholder
    const RiskAssessmentModal = () => {
      const [form, setForm] = useState({
        menarche: '',
        menopause: '',
        menopauseAge: '',
        pregnant: '',
        firstChildAge: '',
        parity: '',
        breastfeeding: '',
        bfDuration: '',
        birthControl: '',
        hrt: '',
        familyHistory: '',
        familyCancerAge: '',
        personalHistory: '',
      });
      const [result, setResult] = useState(null);

      function handleChange(e) {
        const { name, value } = e.target;
        setForm(f => ({ ...f, [name]: value }));
      }

      function handleSubmit(e) {
        e.preventDefault();
        // Risk logic
        let risk = 'Average/Lower Risk';
        let score = 0;
        // Early menarche
        if (form.menarche === '<12') score++;
        // Late menopause
        if (form.menopause === 'Yes' && form.menopauseAge && Number(form.menopauseAge) > 55) score++;
        // No pregnancy or first child after 30
        if (form.pregnant === 'No') score++;
        if (form.pregnant === 'Yes' && form.firstChildAge && Number(form.firstChildAge) > 30) score++;
        // Low parity
        if (form.parity && Number(form.parity) < 2) score++;
        // Breastfeeding <6 months
        if (form.breastfeeding === 'No') score++;
        if (form.breastfeeding === 'Yes' && form.bfDuration && Number(form.bfDuration) < 6) score++;
        // Long-term birth control/hormones
        if (form.birthControl === 'Yes') score++;
        if (form.hrt === 'Yes') score++;
        // Family history
        if (form.familyHistory === 'Yes') score += 2;
        // Personal history
        if (form.personalHistory === 'Yes') score += 2;
        if (score >= 4) risk = 'Higher Risk';
        setResult(risk);
      }

      if (!showRiskModal) return null;
      return (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/40" style={{overflowY: 'auto'}} onClick={() => setShowRiskModal(false)}>
          <div className="backdrop-blur-2xl bg-white border border-pink-200 rounded-3xl shadow-2xl p-0 w-full max-w-2xl flex flex-col items-center animate-fade-in relative mt-16" style={{maxHeight: '90vh', overflowY: 'auto'}} onClick={e => e.stopPropagation()}>
            <button onClick={() => setShowRiskModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-pink-500 text-2xl font-bold">&times;</button>
            <div className="p-10 w-full flex flex-col items-center">
              <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600 mb-8 font-lexend tracking-tight drop-shadow-lg text-center">Risk Assessment</h2>
              <form className="w-full max-w-xl space-y-7" onSubmit={handleSubmit}>
                {/* Menstrual history */}
                <div>
                  <label className="font-semibold text-lg text-gray-800 mb-2 block">Age at first period (menarche):</label>
                  <select name="menarche" value={form.menarche} onChange={handleChange} className="w-full mt-1 rounded-xl border-2 border-pink-300 px-4 py-3 text-base focus:ring-2 focus:ring-pink-400">
                    <option value="">Select</option>
                    <option value="<12">Less than 12</option>
                    <option value="12-14">12-14</option>
                    <option value=">14">Above 14</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-lg text-gray-800 mb-2 block">Are periods regular or has menopause occurred?</label>
                  <select name="menopause" value={form.menopause} onChange={handleChange} className="w-full mt-1 rounded-xl border-2 border-pink-300 px-4 py-3 text-base focus:ring-2 focus:ring-pink-400">
                    <option value="">Select</option>
                    <option value="No">Regular</option>
                    <option value="Yes">Menopause</option>
                  </select>
                  {form.menopause === 'Yes' && (
                    <input type="number" name="menopauseAge" value={form.menopauseAge} onChange={handleChange} placeholder="Age at menopause" className="w-full mt-2 rounded-xl border-2 border-pink-300 px-4 py-3 text-base" />
                  )}
                </div>
                {/* Pregnancy & childbirth */}
                <div>
                  <label className="font-semibold text-lg text-gray-800 mb-2 block">Have you ever been pregnant?</label>
                  <select name="pregnant" value={form.pregnant} onChange={handleChange} className="w-full mt-1 rounded-xl border-2 border-pink-300 px-4 py-3 text-base focus:ring-2 focus:ring-pink-400">
                    <option value="">Select</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                  {form.pregnant === 'Yes' && (
                    <>
                      <input type="number" name="firstChildAge" value={form.firstChildAge} onChange={handleChange} placeholder="Age at first child" className="w-full mt-2 rounded-xl border-2 border-pink-300 px-4 py-3 text-base" />
                      <input type="number" name="parity" value={form.parity} onChange={handleChange} placeholder="Number of full-term children" className="w-full mt-2 rounded-xl border-2 border-pink-300 px-4 py-3 text-base" />
                    </>
                  )}
                </div>
                {/* Breastfeeding */}
                <div>
                  <label className="font-semibold text-lg text-gray-800 mb-2 block">Did you breastfeed your children?</label>
                  <select name="breastfeeding" value={form.breastfeeding} onChange={handleChange} className="w-full mt-1 rounded-xl border-2 border-pink-300 px-4 py-3 text-base focus:ring-2 focus:ring-pink-400">
                    <option value="">Select</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                  {form.breastfeeding === 'Yes' && (
                    <input type="number" name="bfDuration" value={form.bfDuration} onChange={handleChange} placeholder="Duration (months)" className="w-full mt-2 rounded-xl border-2 border-pink-300 px-4 py-3 text-base" />
                  )}
                </div>
                {/* Hormonal medicines */}
                <div>
                  <label className="font-semibold text-lg text-gray-800 mb-2 block">Long-term birth control pills or hormonal injection/implant?</label>
                  <select name="birthControl" value={form.birthControl} onChange={handleChange} className="w-full mt-1 rounded-xl border-2 border-pink-300 px-4 py-3 text-base focus:ring-2 focus:ring-pink-400">
                    <option value="">Select</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-lg text-gray-800 mb-2 block">Hormone replacement therapy (HRT) after menopause?</label>
                  <select name="hrt" value={form.hrt} onChange={handleChange} className="w-full mt-1 rounded-xl border-2 border-pink-300 px-4 py-3 text-base focus:ring-2 focus:ring-pink-400">
                    <option value="">Select</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </div>
                {/* Family & personal history */}
                <div>
                  <label className="font-semibold text-lg text-gray-800 mb-2 block">Any close relative (mother, sister, daughter) with breast or ovarian cancer?</label>
                  <select name="familyHistory" value={form.familyHistory} onChange={handleChange} className="w-full mt-1 rounded-xl border-2 border-pink-300 px-4 py-3 text-base focus:ring-2 focus:ring-pink-400">
                    <option value="">Select</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                  {form.familyHistory === 'Yes' && (
                    <input type="number" name="familyCancerAge" value={form.familyCancerAge} onChange={handleChange} placeholder="Relative's age at diagnosis" className="w-full mt-2 rounded-xl border-2 border-pink-300 px-4 py-3 text-base" />
                  )}
                </div>
                <div>
                  <label className="font-semibold text-lg text-gray-800 mb-2 block">Have you ever been diagnosed with breast cancer or any other breast tumor?</label>
                  <select name="personalHistory" value={form.personalHistory} onChange={handleChange} className="w-full mt-1 rounded-xl border-2 border-pink-300 px-4 py-3 text-base focus:ring-2 focus:ring-pink-400">
                    <option value="">Select</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </div>
                <button type="submit" className="w-full py-4 rounded-xl font-bold text-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg hover:scale-105 mt-6">Analyze Risk</button>
              </form>
              {result && (
                <div className="mt-8 text-2xl font-bold text-pink-600 text-center">Your Risk Category: <span className="text-purple-600">{result}</span></div>
              )}
            </div>
          </div>
        </div>
      );
    };
  const [isVisible, setIsVisible] = useState(false);
  const [showSweatDetection, setShowSweatDetection] = useState(false);
  const [showDoctorModel, setShowDoctorModel] = useState(false);
  const [authModal, setAuthModal] = useState(null); // 'login' | 'signup' | null
  const [showFamilyDashboard, setShowFamilyDashboard] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState(null); // null = not showing
  const [showRiskModal, setShowRiskModal] = useState(false);

  // Listen controls state
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const listenText = `How It Works. Step 1: Start Screening. Click on Start Screening and answer a few simple questions to begin your health checkup journey. Step 2: Upload or Capture Image. Upload your medical image or capture a new one using your phone or computer. Step 3: AI Analysis. Our advanced AI instantly analyzes your image and provides accurate results with easy-to-understand feedback. Step 4: Get Personalized Report. Download or view your personalized report and get recommendations for next steps.`;

  // Listen controls handlers
  const handlePlay = () => {
    window.speechSynthesis.cancel(); // Stop any current speech
    setIsSpeaking(true);
    setIsPaused(false);
    speak(listenText);
  };
  const handlePause = () => {
    if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
      window.speechSynthesis.pause();
      setIsPaused(true);
    }
  };
  const handleResume = () => {
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
    }
  };
  // Listen for speech end to reset state
  useEffect(() => {
    const handleEnd = () => {
      setIsSpeaking(false);
      setIsPaused(false);
    };
    window.speechSynthesis.addEventListener('end', handleEnd);
    window.speechSynthesis.addEventListener('pause', () => setIsPaused(true));
    window.speechSynthesis.addEventListener('resume', () => setIsPaused(false));
    return () => {
      window.speechSynthesis.removeEventListener('end', handleEnd);
    };
  }, []);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  if (showSweatDetection) {
    return <BreastCancerScreening onBack={() => setShowSweatDetection(false)} />;
  }

  if (showDoctorModel) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-pink-200 via-rose-100 to-purple-200">
        <div className="absolute top-8 left-8 z-10">
          <button
            className="flex items-center gap-2 bg-white/80 backdrop-blur-lg border border-pink-200 text-pink-600 px-5 py-2 rounded-full shadow-lg hover:bg-pink-100 hover:shadow-pink-200/60 transition-all duration-200 font-semibold text-base"
            onClick={() => setShowDoctorModel(false)}
          >
            <svg xmlns='http://www.w3.org/2000/svg' className='h-5 w-5' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 19l-7-7 7-7' /></svg>
            Back
          </button>
        </div>
        <div className="flex flex-col items-center justify-center w-full max-w-3xl">
          <div className="bg-white/60 backdrop-blur-2xl rounded-3xl shadow-2xl border border-pink-100 p-10 flex flex-col items-center transition-all duration-300 hover:shadow-pink-200/80 hover:ring-4 hover:ring-pink-100/40 animate-fade-in" style={{boxShadow: '0 8px 32px 0 rgba(255, 182, 193, 0.25)'}}>
            <div className="w-full flex items-center justify-center" style={{minHeight: '600px'}}>
              <BreastModel />
            </div>
            <h2 className="text-5xl font-extrabold text-pink-600 mt-8 font-lexend tracking-tight drop-shadow-lg text-center" style={{letterSpacing: '0.04em', textShadow: '0 2px 16px #f472b6aa'}}>
              3D Breast Model
            </h2>
          </div>
        </div>
      </div>
    );
  }

  // Auth Modal
  const AuthModal = () => {
    if (!authModal) return null;
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setAuthModal(null)}>
        <div className="backdrop-blur-xl bg-white/70 border border-pink-100 rounded-3xl shadow-2xl p-0 w-full max-w-lg flex flex-col items-center animate-fade-in relative" onClick={e => e.stopPropagation()}>
          <button onClick={() => setAuthModal(null)} className="absolute top-4 right-4 text-gray-400 hover:text-pink-500 text-2xl font-bold">&times;</button>
          {authModal === 'login' ? <Login onSwitch={() => setAuthModal('signup')} /> : <SignUp onSwitch={() => setAuthModal('login')} />}
        </div>
      </div>
    );
  };

  // Handler for opening dashboard with terms check
  const handleOpenDashboard = () => {
    if (!agreedToTerms) {
      setShowTermsModal(true);
    } else {
      setShowFamilyDashboard(true);
    }
  };

  // Terms & Conditions Modal
  const TermsModal = () => {
    if (!showTermsModal) return null;
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setShowTermsModal(false)}>
        <div className="backdrop-blur-2xl bg-white/90 border border-pink-100 rounded-3xl shadow-2xl p-0 w-full max-w-lg flex flex-col items-center animate-fade-in relative" onClick={e => e.stopPropagation()} style={{boxShadow: '0 8px 32px 0 rgba(255, 182, 193, 0.25)'}}>
          <button onClick={() => setShowTermsModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-pink-500 text-2xl font-bold">&times;</button>
          <div className="p-8 w-full flex flex-col items-center">
            <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600 mb-4 font-lexend tracking-tight drop-shadow-lg text-center">Terms & Conditions</h2>
            <div className="text-gray-700 text-base mb-6 text-center">
              We collect only the information necessary for providing your personalized breast cancer risk assessment. <br />
              <span className="font-semibold text-pink-600">Your privacy is extremely important to us.</span> <br />
              This information will <span className="font-bold">never be shared</span> with any third party and is used solely for your health dashboard experience. <br />
              You are always in control of your data.
            </div>
            <CustomCheckbox
              label="I agree to the terms and conditions."
              checked={agreedToTerms}
              onChange={e => setAgreedToTerms(e.target.checked)}
              className="mb-6"
            />
            <button
              className={`w-full py-3 rounded-xl font-bold text-lg transition-all duration-200 ${agreedToTerms ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg hover:scale-105' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
              disabled={!agreedToTerms}
              onClick={() => { setShowTermsModal(false); setShowFamilyDashboard(true); }}
            >
              Proceed
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 font-sans">
      <RiskAssessmentModal />
      {/* Header */}
      <header className="bg-white/60 backdrop-blur-md border-b border-pink-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4 relative">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">CareDetect</span>
            </div>
            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#features" className="nav-link">Features</a>
              <a href="#how-it-works" className="nav-link">How It Works</a>
              <a href="#about" className="nav-link">About</a>
              <a href="#contact" className="nav-link">Contact</a>
              <button
                id="3d-model-btn"
                className="nav-link bg-transparent border-none p-0 focus:outline-none"
                onClick={() => setShowDoctorModel(true)}
              >
                3D Model
              </button>
              <button
                id="genetic-risk-btn"
                className="text-gray-700 hover:text-purple-600 transition-colors focus:outline-none font-semibold border border-purple-200 rounded-full px-4 py-1 ml-2 bg-white/70 hover:bg-purple-100"
                onClick={handleOpenDashboard}
              >
                Genetic Risk
              </button>
              <button
                id="risk-assessment-btn"
                className="text-gray-700 hover:text-pink-600 transition-colors focus:outline-none font-semibold border border-pink-200 rounded-full px-4 py-1 ml-2 bg-white/70 hover:bg-pink-100"
                onClick={() => setShowRiskModal(true)}
              >
                Risk Assessment
              </button>
            </nav>
            {/* Desktop Auth Buttons */}
            <div className="hidden md:flex gap-3 items-center">
              <button
                id="login-btn"
                className="bg-white border border-purple-500 text-purple-600 px-6 py-2 rounded-full font-semibold hover:bg-purple-600 hover:text-white transition-all duration-200"
                onClick={() => setAuthModal('login')}
              >
                Login
              </button>
              <button
                id="signup-btn"
                className="bg-white border border-purple-500 text-purple-600 px-6 py-2 rounded-full font-semibold hover:bg-purple-600 hover:text-white transition-all duration-200"
                onClick={() => setAuthModal('signup')}
              >
                Sign Up
              </button>
            </div>
            {/* Hamburger Icon for Mobile */}
            <button
              className="md:hidden flex items-center justify-center p-2 rounded focus:outline-none focus:ring-2 focus:ring-pink-400"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Open menu"
            >
              <svg className="w-7 h-7 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            {/* Mobile Menu Dropdown */}
            {mobileMenuOpen && (
              <div className="md:hidden absolute top-full right-0 mt-2 w-56 bg-white/95 rounded-2xl shadow-2xl border border-pink-100 z-50 animate-fade-in flex flex-col p-4 gap-2">
                <a href="#features" className="nav-link" onClick={() => setMobileMenuOpen(false)}>Features</a>
                <a href="#how-it-works" className="nav-link" onClick={() => setMobileMenuOpen(false)}>How It Works</a>
                <a href="#about" className="nav-link" onClick={() => setMobileMenuOpen(false)}>About</a>
                <a href="#contact" className="nav-link" onClick={() => setMobileMenuOpen(false)}>Contact</a>
                <button
                  className="nav-link bg-transparent border-none p-0 text-left focus:outline-none"
                  onClick={() => { setShowDoctorModel(true); setMobileMenuOpen(false); }}
                >
                  3D Model
                </button>
                <button
                  className="nav-link bg-transparent border-none p-0 text-left focus:outline-none"
                  onClick={() => { setShowFamilyDashboard(true); setMobileMenuOpen(false); }}
                >
                  Genetic Risk
                </button>
                <hr className="my-2 border-pink-100" />
                <button
                  className="bg-white border border-purple-500 text-purple-600 px-4 py-2 rounded-full font-semibold hover:bg-purple-600 hover:text-white transition-all duration-200 w-full text-left"
                  onClick={() => { setAuthModal('login'); setMobileMenuOpen(false); }}
                >
                  Login
                </button>
                <button
                  className="bg-white border border-purple-500 text-purple-600 px-4 py-2 rounded-full font-semibold hover:bg-purple-600 hover:text-white transition-all duration-200 w-full text-left"
                  onClick={() => { setAuthModal('signup'); setMobileMenuOpen(false); }}
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-pink-600/10 to-purple-600/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <h1 
                className="text-5xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight font-lexend tracking-tight"
              >
                Early Detection
                <span className="bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent block">
                  Saves Lives
                </span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Revolutionary AI-powered breast cancer detection technology that empowers women with accurate, 
                accessible screening solutions for better health outcomes.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <button id="start-screening-btn" className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-4 rounded-full font-semibold hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center group">
                  Start Screening
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button id="watch-demo-btn" className="bg-white/80 backdrop-blur-sm text-gray-700 px-8 py-4 rounded-full font-semibold hover:bg-white transition-all duration-300 flex items-center justify-center group border border-gray-200">
                  <Play className="mr-2 w-5 h-5 group-hover:scale-110 transition-transform" />
                  Watch Demo
                </button>
                <button
                  id="sweat-detect-btn"
                  className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-4 rounded-full font-semibold hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center group"
                  onClick={() => setShowSweatDetection(true)}
                >
                  Detecting by Sweat
                </button>
              </div>
              <div className="flex items-center space-x-6 text-sm text-gray-500">
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  FDA Approved
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  92.83% Accuracy
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Instant Results
                </div>
              </div>
            </div>
            
            <div className={`transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-pink-400 to-purple-500 rounded-3xl blur-3xl opacity-20 animate-pulse"></div>
                <div className="relative bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-pink-100">
                  <div className="w-full flex justify-center items-center mb-0">
                    <div className="w-full max-w-xl aspect-video bg-gradient-to-br from-pink-100 to-purple-100 rounded-2xl flex items-center justify-center">
                      <video 
                        src="/video.mp4" 
                        controls 
                        className="w-full h-full object-cover rounded-2xl shadow-lg border border-purple-200 bg-white"
                        style={{ background: 'rgba(255,255,255,0.7)' }}
                      >
                        Your browser does not support the video tag.
                      </video>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div className="group">
              <div className="text-4xl font-bold text-pink-600 mb-2 group-hover:scale-110 transition-transform">92.83%</div>
              <div className="text-gray-600">Accuracy Rate</div>
            </div>
            <div className="group">
              <div className="text-4xl font-bold text-purple-600 mb-2 group-hover:scale-110 transition-transform">500K+</div>
              <div className="text-gray-600">Lives Impacted</div>
            </div>
            <div className="group">
              <div className="text-4xl font-bold text-pink-600 mb-2 group-hover:scale-110 transition-transform">1M+</div>
              <div className="text-gray-600">Screenings Done</div>
            </div>
            <div className="group">
              <div className="text-4xl font-bold text-purple-600 mb-2 group-hover:scale-110 transition-transform">24/7</div>
              <div className="text-gray-600">Support Available</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 
              className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4 font-lexend tracking-tight"
            >
              Project Features
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Explore the core features of our breast cancer detection platform.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* AI-powered Screening */}
            <div className="group bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-pink-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="text-pink-600 mb-4 group-hover:scale-110 transition-transform">
                <Zap className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">AI-powered Screening</h3>
              <p className="text-gray-600">Upload or capture images for instant, accurate breast cancer risk analysis using advanced AI.</p>
            </div>
            {/* Sweat Biomarker Detection */}
            <div className="group bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-pink-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="text-blue-500 mb-4 group-hover:scale-110 transition-transform">
                <Droplets className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Sweat Biomarker Detection</h3>
              <p className="text-gray-600">Non-invasive detection using sweat test strips and smartphone camera for early risk assessment.</p>
            </div>
            {/* 3D Breast Model */}
            <div className="group bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-pink-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="text-purple-600 mb-4 group-hover:scale-110 transition-transform">
                <Shield className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">3D Breast Model</h3>
              <p className="text-gray-600">Interactive 3D model for education, symptom awareness, and region-specific information.</p>
            </div>
            {/* Genetic Risk Calculator */}
            <div className="group bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-pink-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="text-pink-500 mb-4 group-hover:scale-110 transition-transform">
                <Users className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Genetic Risk Calculator</h3>
              <p className="text-gray-600">Personalized risk score based on family history, genetics, and lifestyle factors.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-white/70 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            {/* Doctor Card (Left) */}
            <div className="flex flex-col items-center">
              <div className="w-full max-w-lg h-[480px] bg-white/80 rounded-3xl shadow-2xl flex flex-col items-center justify-center border border-pink-100 backdrop-blur-2xl p-8">
                <div className="flex-1 flex items-center justify-center" style={{minHeight: '320px'}}>
                  <DoctorScene />
                </div>
                <div className="mt-6 text-center">
                  <h3 className="text-2xl font-bold text-pink-600 mb-2">Meet Dr. CareDetect</h3>
                  <p className="text-gray-600 text-base">Your friendly AI health assistant, here to guide you through every step of your breast cancer screening journey.</p>
                </div>
              </div>
            </div>
            {/* Steps (Right) */}
            <div className="pl-0 md:pl-8">
              <h2 className="text-4xl lg:text-5xl font-bold text-pink-600 mb-6 font-lexend tracking-tight">How CareDetect Works</h2>
              {/* Listen Controls */}
              <div className="mb-6 flex items-center gap-2 bg-white/70 backdrop-blur-lg rounded-full px-3 py-1 shadow-lg border border-pink-200/60 w-fit" style={{ boxShadow: '0 2px 12px 0 rgba(236, 72, 153, 0.10)' }}>
                {/* Play or Replay */}
                {!isSpeaking ? (
                  <button
                    className="p-0.5 rounded-full transition-all duration-200 flex items-center justify-center group ring-2 ring-pink-300 bg-white hover:bg-pink-50 shadow-sm hover:scale-105 focus:outline-none"
                    onClick={handlePlay}
                    aria-label="Play"
                    title="Play"
                    style={{ width: 28, height: 28 }}
                  >
                    {/* Simple play icon (like |>) */}
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <polygon points="4,3 13,8 4,13" fill="currentColor" className="text-pink-500 group-hover:text-purple-600 transition-colors duration-200" />
                    </svg>
                  </button>
                ) : (
                  <button
                    className="p-0.5 rounded-full transition-all duration-200 flex items-center justify-center group ring-2 ring-pink-300 bg-white hover:bg-pink-50 shadow-sm hover:scale-105 focus:outline-none"
                    onClick={handlePlay}
                    aria-label="Replay"
                    title="Replay"
                    style={{ width: 28, height: 28 }}
                  >
                    {/* Simple replay icon (circular arrow) */}
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M8 3a5 5 0 1 1-4.33 2.5" stroke="currentColor" strokeWidth="1.5" fill="none" className="text-pink-500 group-hover:text-purple-600 transition-colors duration-200" />
                      <polygon points="3,2 3,6 6,4" fill="currentColor" className="text-pink-500 group-hover:text-purple-600 transition-colors duration-200" />
                    </svg>
                  </button>
                )}
                {/* Pause */}
                <button
                  className="p-0.5 rounded-full transition-all duration-200 flex items-center justify-center group ring-2 ring-pink-200 bg-white hover:bg-pink-50 shadow-sm hover:scale-105 focus:outline-none disabled:opacity-50"
                  onClick={handlePause}
                  aria-label="Pause"
                  title="Pause"
                  disabled={!isSpeaking || isPaused}
                  style={{ width: 28, height: 28 }}
                >
                  {/* Pause icon */}
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="4" y="4" width="2" height="8" rx="1" fill="currentColor" className="text-pink-400 group-hover:text-purple-600 transition-colors duration-200" />
                    <rect x="10" y="4" width="2" height="8" rx="1" fill="currentColor" className="text-pink-400 group-hover:text-purple-600 transition-colors duration-200" />
                  </svg>
                </button>
                {/* Resume (ArrowRightCircle) */}
                <button
                  className="p-0.5 rounded-full transition-all duration-200 flex items-center justify-center group ring-2 ring-green-300 bg-white hover:bg-green-50 shadow-sm hover:scale-105 focus:outline-none disabled:opacity-50"
                  onClick={handleResume}
                  aria-label="Resume"
                  title="Resume"
                  disabled={!isSpeaking || !isPaused}
                  style={{ width: 28, height: 28 }}
                >
                  {/* Simple right arrow in a circle */}
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.5" className="text-green-400 group-hover:text-green-600 transition-colors duration-200" />
                    <polygon points="7,5 11,8 7,11" fill="currentColor" className="text-green-400 group-hover:text-green-600 transition-colors duration-200" />
                  </svg>
                </button>
                <span className="ml-1 font-semibold text-sm bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">Listen</span>
              </div>
              <ol className="space-y-8">
                <li className="flex items-start">
                  <span className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center text-white text-2xl shadow-lg mr-4">1</span>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-1">Start Screening</h3>
                    <p className="text-gray-600">Click on <b>Start Screening</b> and answer a few simple questions to begin your health checkup journey.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center text-white text-2xl shadow-lg mr-4">2</span>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-1">Upload or Capture Image</h3>
                    <p className="text-gray-600">Upload your medical image or capture a new one using your phone or computer.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center text-white text-2xl shadow-lg mr-4">3</span>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-1">AI Analysis</h3>
                    <p className="text-gray-600">Our advanced AI instantly analyzes your image and provides accurate results with easy-to-understand feedback.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center text-white text-2xl shadow-lg mr-4">4</span>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-1">Get Personalized Report</h3>
                    <p className="text-gray-600">Download or view your personalized report and get recommendations for next steps.</p>
                  </div>
                </li>
              </ol>
              <div className="mt-8 text-gray-500 text-sm italic">* Available in multiple languages soon for everyone!</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-pink-500 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 
            className="text-4xl lg:text-5xl font-bold mb-6 font-lexend tracking-tight"
          >
            Ready to Take Control of Your Health?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Join thousands of women who trust CareDetect for their breast cancer screening needs. 
            Early detection saves lives.
          </p>
          <button className="bg-white text-pink-600 px-10 py-4 rounded-full font-semibold hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            Start Your Free Screening Today
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Heart className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-bold">CareDetect</span>
              </div>
              <p className="text-gray-400">
                Empowering women with advanced breast cancer detection technology for better health outcomes.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-pink-400 transition-colors">Screening</a></li>
                <li><a href="#" className="hover:text-pink-400 transition-colors">AI Analysis</a></li>
                <li><a href="#" className="hover:text-pink-400 transition-colors">Reports</a></li>
                <li><a href="#" className="hover:text-pink-400 transition-colors">Support</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-pink-400 transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-pink-400 transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-pink-400 transition-colors">Press</a></li>
                <li><a href="#" className="hover:text-pink-400 transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Resources</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-pink-400 transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-pink-400 transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-pink-400 transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-pink-400 transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 CareDetect. All rights reserved. Made with ❤ for women's health.</p>
          </div>
        </div>
      </footer>
      <AuthModal />
      <TermsModal />
      <FamilyHealthDashboard open={showFamilyDashboard} onClose={() => setShowFamilyDashboard(false)} />
      {/* Floating Guide Me Button */}
      <button
        className="fixed bottom-8 right-8 z-[9999] bg-pink-500 text-white px-4 py-2 rounded-full shadow-lg hover:scale-105 transition"
        onClick={() => setOnboardingStep(0)}
        style={{ display: onboardingStep === null ? 'block' : 'none' }}
      >
        Guide Me
      </button>
      {/* Onboarding Overlay */}
      {onboardingStep !== null && (
        <OnboardingOverlay
          stepIndex={onboardingStep}
          onNext={() => {
            if (onboardingStep < 2) setOnboardingStep(onboardingStep + 1);
            else setOnboardingStep(null);
          }}
          onClose={() => setOnboardingStep(null)}
        />
      )}
    </div>
  );
} 