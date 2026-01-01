'use client';

import { useState, useEffect } from 'react';
import { getUserId, setLocalPreference, getLocalPreference } from '@/lib/utils/user';

export default function Onboarding() {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [step, setStep] = useState(1);

  useEffect(() => {
    const hasSeenOnboarding = getLocalPreference('has_seen_onboarding', false);
    if (!hasSeenOnboarding) {
      setShowOnboarding(true);
    }
  }, []);

  const handleAcceptPersonalization = () => {
    // Initialize user ID (cookie)
    getUserId();
    setLocalPreference('personalization_enabled', true);
    setLocalPreference('has_seen_onboarding', true);
    setStep(2);
  };

  const handleSkip = () => {
    setLocalPreference('personalization_enabled', false);
    setLocalPreference('has_seen_onboarding', true);
    setShowOnboarding(false);
  };

  const handleComplete = () => {
    setShowOnboarding(false);
  };

  if (!showOnboarding) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl max-w-2xl w-full p-8 md:p-12 animate-in fade-in zoom-in duration-300">
        {step === 1 && (
          <div className="text-center space-y-6">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto">
              <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 3.5a1.5 1.5 0 013 0V4a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-.5a1.5 1.5 0 000 3h.5a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-.5a1.5 1.5 0 00-3 0v.5a1 1 0 01-1 1H6a1 1 0 01-1-1v-3a1 1 0 00-1-1h-.5a1.5 1.5 0 010-3H4a1 1 0 001-1V6a1 1 0 011-1h3a1 1 0 001-1v-.5z" />
              </svg>
            </div>

            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3">
                Welcome to Pheme
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Your AI-powered news aggregator
              </p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-6 text-left space-y-4">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Get a 100% Tailored Experience
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Enable personalization to get article recommendations based on your reading habits. We'll use cookies to remember your preferences and provide a customized news feed just for you.
              </p>

              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Personalized Recommendations</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Articles curated based on what you read</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Follow Authors</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Get notified when your favorite authors publish</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Sync Across Devices</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Your preferences and history saved</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <button
                onClick={handleAcceptPersonalization}
                className="flex-1 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl font-semibold hover:shadow-xl hover:scale-105 transition-all"
              >
                Enable Personalization
              </button>
              <button
                onClick={handleSkip}
                className="px-8 py-4 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-2xl font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Skip for Now
              </button>
            </div>

            <p className="text-xs text-gray-500 dark:text-gray-400">
              We respect your privacy. Cookies are only used to improve your experience.
            </p>
          </div>
        )}

        {step === 2 && (
          <div className="text-center space-y-6">
            <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl flex items-center justify-center mx-auto">
              <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>

            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3">
                You're All Set!
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Start exploring personalized news
              </p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl p-6 space-y-3">
              <p className="text-gray-700 dark:text-gray-300">
                As you read articles, we'll learn your preferences and show you more of what you love in the <span className="font-semibold text-blue-600 dark:text-blue-400">"For You"</span> feed.
              </p>
            </div>

            <button
              onClick={handleComplete}
              className="w-full px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-2xl font-semibold hover:shadow-xl hover:scale-105 transition-all"
            >
              Start Reading
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
