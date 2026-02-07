import React, { useState } from 'react';
import { 
  MessageSquare, CheckCircle, XCircle, AlertCircle, 
  Send, Star, ThumbsUp, ThumbsDown, FileText 
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const FeedbackForm = () => {
  const { language: globalLanguage } = useLanguage();
  const [localLanguage, setLocalLanguage] = useState(globalLanguage);
  
  const translations = {
    en: {
      title: 'Model Accuracy Feedback',
      subtitle: 'Help us improve by sharing your mammography results',
      thankYou: 'Thank you for your feedback!',
      thankYouMsg: 'Your input helps us improve our AI model accuracy.',
      modelPrediction: "What was our AI model's prediction?",
      selectPrediction: 'Select prediction',
      mammographyResult: 'What was your actual mammography result?',
      selectResult: 'Select result',
      resultsMatch: 'Did our prediction match your mammography result?',
      yesExact: 'Yes, Exact Match',
      partialCorrect: 'Partially Correct',
      noDifferent: 'No, Different',
      confidence: 'How confident are you in the mammography result?',
      notConfident: 'Not Confident',
      veryConfident: 'Very Confident',
      experienceRating: 'Rate your experience with our AI model',
      wouldRecommend: 'Would you recommend our AI screening tool to others?',
      yesWould: 'Yes, I would',
      noWouldnt: "No, I wouldn't",
      additionalComments: 'Additional Comments (Optional)',
      commentsPlaceholder: 'Share any additional details about your experience or suggestions for improvement...',
      submitFeedback: 'Submit Feedback',
      feedbackHistory: 'Your Feedback History',
      exactMatch: 'Exact Match',
      partialMatch: 'Partial Match',
      noMatch: 'No Match',
      modelPredLabel: 'Model Prediction:',
      mammographyLabel: 'Mammography Result:',
      normal: 'Normal / No Cancer Detected',
      benign: 'Benign (Non-cancerous)',
      malignant: 'Malignant (Cancerous)',
      suspicious: 'Suspicious / Requires Further Testing'
    },
    hi: {
      title: 'मॉडल सटीकता फीडबैक',
      subtitle: 'अपने मैमोग्राफी परिणाम साझा करके हमें बेहतर बनाने में मदद करें',
      thankYou: 'आपके फीडबैक के लिए धन्यवाद!',
      thankYouMsg: 'आपका इनपुट हमारे AI मॉडल की सटीकता में सुधार करने में मदद करता है।',
      modelPrediction: 'हमारे AI मॉडल की भविष्यवाणी क्या थी?',
      selectPrediction: 'भविष्यवाणी चुनें',
      mammographyResult: 'आपका वास्तविक मैमोग्राफी परिणाम क्या था?',
      selectResult: 'परिणाम चुनें',
      resultsMatch: 'क्या हमारी भविष्यवाणी आपके मैमोग्राफी परिणाम से मेल खाती है?',
      yesExact: 'हां, बिल्कुल मेल',
      partialCorrect: 'आंशिक रूप से सही',
      noDifferent: 'नहीं, अलग',
      confidence: 'मैमोग्राफी परिणाम में आप कितने आश्वस्त हैं?',
      notConfident: 'आश्वस्त नहीं',
      veryConfident: 'बहुत आश्वस्त',
      experienceRating: 'हमारे AI मॉडल के साथ अपने अनुभव को रेट करें',
      wouldRecommend: 'क्या आप हमारे AI स्क्रीनिंग टूल को दूसरों को सुझाएंगे?',
      yesWould: 'हां, मैं सुझाऊंगा',
      noWouldnt: 'नहीं, मैं नहीं सुझाऊंगा',
      additionalComments: 'अतिरिक्त टिप्पणियां (वैकल्पिक)',
      commentsPlaceholder: 'अपने अनुभव के बारे में कोई अतिरिक्त विवरण या सुधार के लिए सुझाव साझा करें...',
      submitFeedback: 'फीडबैक जमा करें',
      feedbackHistory: 'आपका फीडबैक इतिहास',
      exactMatch: 'बिल्कुल मेल',
      partialMatch: 'आंशिक मेल',
      noMatch: 'कोई मेल नहीं',
      modelPredLabel: 'मॉडल भविष्यवाणी:',
      mammographyLabel: 'मैमोग्राफी परिणाम:',
      normal: 'सामान्य / कोई कैंसर नहीं',
      benign: 'सौम्य (गैर-कैंसरयुक्त)',
      malignant: 'घातक (कैंसरयुक्त)',
      suspicious: 'संदिग्ध / आगे परीक्षण की आवश्यकता'
    }
  };

  const t = translations[localLanguage] || translations.en;
  const [formData, setFormData] = useState({
    modelPrediction: '',
    mammographyResult: '',
    resultsMatch: '',
    confidence: 5,
    additionalComments: '',
    wouldRecommend: '',
    experienceRating: 5
  });

  const [submitted, setSubmitted] = useState(false);
  const [feedbackHistory, setFeedbackHistory] = useState([]);

  // Load feedback history from localStorage
  React.useEffect(() => {
    const savedFeedback = localStorage.getItem('feedbackHistory');
    if (savedFeedback) {
      setFeedbackHistory(JSON.parse(savedFeedback));
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newFeedback = {
      ...formData,
      id: Date.now(),
      timestamp: new Date().toISOString(),
      date: new Date().toLocaleDateString('en-IN')
    };

    const updatedHistory = [newFeedback, ...feedbackHistory];
    setFeedbackHistory(updatedHistory);
    localStorage.setItem('feedbackHistory', JSON.stringify(updatedHistory));
    
    setSubmitted(true);
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setFormData({
        modelPrediction: '',
        mammographyResult: '',
        resultsMatch: '',
        confidence: 5,
        additionalComments: '',
        wouldRecommend: '',
        experienceRating: 5
      });
      setSubmitted(false);
    }, 3000);
  };

  const getMatchIcon = (match) => {
    if (match === 'yes') return <CheckCircle className="w-5 h-5 text-green-600" />;
    if (match === 'no') return <XCircle className="w-5 h-5 text-red-600" />;
    if (match === 'partial') return <AlertCircle className="w-5 h-5 text-yellow-600" />;
    return null;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-500 to-purple-600 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className="bg-white/20 p-3 rounded-xl">
              <MessageSquare className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-3xl font-bold">{t.title}</h2>
              <p className="text-pink-100 mt-1">{t.subtitle}</p>
            </div>
          </div>
          
          {/* Language Toggle */}
          <div className="flex items-center bg-white/20 rounded-xl p-1">
            <button
              onClick={() => setLocalLanguage('en')}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                localLanguage === 'en'
                  ? 'bg-white text-pink-600 shadow-lg'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              English
            </button>
            <button
              onClick={() => setLocalLanguage('hi')}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                localLanguage === 'hi'
                  ? 'bg-white text-pink-600 shadow-lg'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              हिंदी
            </button>
          </div>
        </div>
      </div>

      {/* Success Message */}
      {submitted && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-6 flex items-center space-x-4">
          <CheckCircle className="w-8 h-8 text-green-600 flex-shrink-0" />
          <div>
            <h3 className="font-bold text-green-900">{t.thankYou}</h3>
            <p className="text-green-700 text-sm mt-1">{t.thankYouMsg}</p>
          </div>
        </div>
      )}

      {/* Feedback Form */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Model Prediction */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {t.modelPrediction}
            </label>
            <select
              name="modelPrediction"
              value={formData.modelPrediction}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            >
              <option value="">{t.selectPrediction}</option>
              <option value="normal">{t.normal}</option>
              <option value="benign">{t.benign}</option>
              <option value="malignant">{t.malignant}</option>
              <option value="suspicious">{t.suspicious}</option>
            </select>
          </div>

          {/* Mammography Result */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {t.mammographyResult}
            </label>
            <select
              name="mammographyResult"
              value={formData.mammographyResult}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            >
              <option value="">{t.selectResult}</option>
              <option value="normal">{t.normal}</option>
              <option value="benign">{t.benign}</option>
              <option value="malignant">{t.malignant}</option>
              <option value="suspicious">{t.suspicious}</option>
            </select>
          </div>

          {/* Results Match */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {t.resultsMatch}
            </label>
            <div className="grid grid-cols-3 gap-4">
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, resultsMatch: 'yes' }))}
                className={`p-4 rounded-xl border-2 transition-all ${
                  formData.resultsMatch === 'yes'
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-gray-300 hover:border-green-300'
                }`}
              >
                <CheckCircle className="w-6 h-6 mx-auto mb-2" />
                <div className="font-semibold">{t.yesExact}</div>
              </button>
              
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, resultsMatch: 'partial' }))}
                className={`p-4 rounded-xl border-2 transition-all ${
                  formData.resultsMatch === 'partial'
                    ? 'border-yellow-500 bg-yellow-50 text-yellow-700'
                    : 'border-gray-300 hover:border-yellow-300'
                }`}
              >
                <AlertCircle className="w-6 h-6 mx-auto mb-2" />
                <div className="font-semibold">{t.partialCorrect}</div>
              </button>
              
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, resultsMatch: 'no' }))}
                className={`p-4 rounded-xl border-2 transition-all ${
                  formData.resultsMatch === 'no'
                    ? 'border-red-500 bg-red-50 text-red-700'
                    : 'border-gray-300 hover:border-red-300'
                }`}
              >
                <XCircle className="w-6 h-6 mx-auto mb-2" />
                <div className="font-semibold">{t.noDifferent}</div>
              </button>
            </div>
          </div>

          {/* Confidence Rating */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {t.confidence} ({formData.confidence}/10)
            </label>
            <input
              type="range"
              name="confidence"
              min="1"
              max="10"
              value={formData.confidence}
              onChange={handleInputChange}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-pink-500"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>{t.notConfident}</span>
              <span>{t.veryConfident}</span>
            </div>
          </div>

          {/* Experience Rating */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {t.experienceRating}
            </label>
            <div className="flex items-center space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, experienceRating: star }))}
                  className="focus:outline-none"
                >
                  <Star
                    className={`w-8 h-8 ${
                      star <= formData.experienceRating
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
              <span className="ml-4 text-gray-600 font-semibold">
                {formData.experienceRating}/5
              </span>
            </div>
          </div>

          {/* Would Recommend */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {t.wouldRecommend}
            </label>
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, wouldRecommend: 'yes' }))}
                className={`flex-1 p-4 rounded-xl border-2 transition-all ${
                  formData.wouldRecommend === 'yes'
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-gray-300 hover:border-green-300'
                }`}
              >
                <ThumbsUp className="w-6 h-6 mx-auto mb-2" />
                <div className="font-semibold">{t.yesWould}</div>
              </button>
              
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, wouldRecommend: 'no' }))}
                className={`flex-1 p-4 rounded-xl border-2 transition-all ${
                  formData.wouldRecommend === 'no'
                    ? 'border-red-500 bg-red-50 text-red-700'
                    : 'border-gray-300 hover:border-red-300'
                }`}
              >
                <ThumbsDown className="w-6 h-6 mx-auto mb-2" />
                <div className="font-semibold">{t.noWouldnt}</div>
              </button>
            </div>
          </div>

          {/* Additional Comments */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {t.additionalComments}
            </label>
            <textarea
              name="additionalComments"
              value={formData.additionalComments}
              onChange={handleInputChange}
              rows="4"
              placeholder={t.commentsPlaceholder}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!formData.modelPrediction || !formData.mammographyResult || !formData.resultsMatch}
            className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            <Send className="w-5 h-5" />
            <span>{t.submitFeedback}</span>
          </button>
        </form>
      </div>

      {/* Feedback History */}
      {feedbackHistory.length > 0 && (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
          <div className="flex items-center space-x-3 mb-6">
            <FileText className="w-6 h-6 text-gray-600" />
            <h3 className="text-xl font-bold text-gray-900">{t.feedbackHistory}</h3>
          </div>
          
          <div className="space-y-4">
            {feedbackHistory.slice(0, 5).map((feedback) => (
              <div key={feedback.id} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    {getMatchIcon(feedback.resultsMatch)}
                    <span className="font-semibold text-gray-900">
                      {feedback.resultsMatch === 'yes' ? t.exactMatch : 
                       feedback.resultsMatch === 'partial' ? t.partialMatch : t.noMatch}
                    </span>
                  </div>
                  <span className="text-sm text-gray-500">{feedback.date}</span>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">{t.modelPredLabel}</span>
                    <div className="font-medium text-gray-900 capitalize">
                      {feedback.modelPrediction === 'normal' ? t.normal :
                       feedback.modelPrediction === 'benign' ? t.benign :
                       feedback.modelPrediction === 'malignant' ? t.malignant :
                       feedback.modelPrediction === 'suspicious' ? t.suspicious : feedback.modelPrediction}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-500">{t.mammographyLabel}</span>
                    <div className="font-medium text-gray-900 capitalize">
                      {feedback.mammographyResult === 'normal' ? t.normal :
                       feedback.mammographyResult === 'benign' ? t.benign :
                       feedback.mammographyResult === 'malignant' ? t.malignant :
                       feedback.mammographyResult === 'suspicious' ? t.suspicious : feedback.mammographyResult}
                    </div>
                  </div>
                </div>
                
                <div className="mt-3 flex items-center space-x-4 text-sm">
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-gray-600">{feedback.experienceRating}/5</span>
                  </div>
                  <div className="text-gray-500">
                    {t.confidence.split('?')[0]}: {feedback.confidence}/10
                  </div>
                </div>
                
                {feedback.additionalComments && (
                  <div className="mt-3 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                    "{feedback.additionalComments}"
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FeedbackForm;
