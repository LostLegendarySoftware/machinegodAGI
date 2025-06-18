import React, { useState } from 'react';
import { ChevronRight, ChevronLeft, Check, User, Settings, Brain, Zap } from 'lucide-react';

interface OnboardingFlowProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

export const OnboardingFlow: React.FC<OnboardingFlowProps> = ({
  isOpen,
  onClose,
  onComplete
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [preferences, setPreferences] = useState({
    theme: 'dark',
    notifications: true,
    dataRetention: 30,
    analyticsEnabled: true,
    interests: [] as string[]
  });

  if (!isOpen) return null;

  const steps = [
    {
      title: 'Welcome to MachineGod AI',
      description: 'The next generation of artificial intelligence with natural learning capabilities.',
      icon: Brain
    },
    {
      title: 'Set Your Preferences',
      description: 'Customize your experience with MachineGod AI.',
      icon: Settings
    },
    {
      title: 'Choose Your Interests',
      description: 'Help us tailor the system to your needs.',
      icon: User
    },
    {
      title: 'Ready to Begin',
      description: 'Your MachineGod AI system is now configured and ready to use.',
      icon: Zap
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    // Save preferences
    localStorage.setItem('user_preferences', JSON.stringify(preferences));
    localStorage.setItem('onboarding_completed', 'true');
    onComplete();
  };

  const handleSkip = () => {
    // Set default preferences
    localStorage.setItem('onboarding_completed', 'true');
    onComplete();
  };

  const handlePreferenceChange = (key: string, value: any) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleInterestToggle = (interest: string) => {
    setPreferences(prev => {
      const interests = [...prev.interests];
      if (interests.includes(interest)) {
        return {
          ...prev,
          interests: interests.filter(i => i !== interest)
        };
      } else {
        return {
          ...prev,
          interests: [...interests, interest]
        };
      }
    });
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="text-center">
            <Brain className="mx-auto text-purple-400 mb-6" size={64} />
            <h2 className="text-2xl font-bold text-white mb-4">Welcome to MachineGod AI</h2>
            <p className="text-gray-300 mb-6">
              You're about to experience the most advanced AI system with natural learning capabilities.
              This short onboarding will help us customize the system to your needs.
            </p>
            <div className="bg-purple-900 bg-opacity-30 p-4 rounded-lg border border-purple-600">
              <p className="text-purple-300">
                MachineGod AI learns from every interaction, utilizing all available assets to continuously
                improve responses, reasoning, and natural conversation abilities.
              </p>
            </div>
          </div>
        );
      case 1:
        return (
          <div>
            <h2 className="text-2xl font-bold text-white mb-4">Set Your Preferences</h2>
            <p className="text-gray-300 mb-6">
              Customize your experience with MachineGod AI.
            </p>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Theme
                </label>
                <div className="flex space-x-4">
                  <label className={`flex items-center justify-center p-3 rounded-lg cursor-pointer ${
                    preferences.theme === 'dark' 
                      ? 'bg-purple-600 text-white' 
                      : 'bg-gray-700 text-gray-300'
                  }`}>
                    <input
                      type="radio"
                      name="theme"
                      value="dark"
                      checked={preferences.theme === 'dark'}
                      onChange={() => handlePreferenceChange('theme', 'dark')}
                      className="sr-only"
                    />
                    <span>Dark</span>
                  </label>
                  <label className={`flex items-center justify-center p-3 rounded-lg cursor-pointer ${
                    preferences.theme === 'light' 
                      ? 'bg-purple-600 text-white' 
                      : 'bg-gray-700 text-gray-300'
                  }`}>
                    <input
                      type="radio"
                      name="theme"
                      value="light"
                      checked={preferences.theme === 'light'}
                      onChange={() => handlePreferenceChange('theme', 'light')}
                      className="sr-only"
                    />
                    <span>Light</span>
                  </label>
                </div>
              </div>
              
              <div>
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={preferences.notifications}
                    onChange={() => handlePreferenceChange('notifications', !preferences.notifications)}
                    className="sr-only peer"
                  />
                  <div className="relative w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                  <span className="text-white">Enable Notifications</span>
                </label>
              </div>
              
              <div>
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={preferences.analyticsEnabled}
                    onChange={() => handlePreferenceChange('analyticsEnabled', !preferences.analyticsEnabled)}
                    className="sr-only peer"
                  />
                  <div className="relative w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                  <span className="text-white">Enable Analytics</span>
                </label>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Data Retention (days)
                </label>
                <select
                  value={preferences.dataRetention}
                  onChange={(e) => handlePreferenceChange('dataRetention', parseInt(e.target.value))}
                  className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-purple-500 focus:outline-none"
                >
                  <option value={7}>7 days</option>
                  <option value={30}>30 days</option>
                  <option value={90}>90 days</option>
                  <option value={365}>365 days</option>
                </select>
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div>
            <h2 className="text-2xl font-bold text-white mb-4">Choose Your Interests</h2>
            <p className="text-gray-300 mb-6">
              Select topics that interest you to help us tailor your experience.
            </p>
            
            <div className="grid grid-cols-2 gap-3">
              {[
                'Artificial Intelligence',
                'Machine Learning',
                'Natural Language Processing',
                'Computer Vision',
                'Robotics',
                'Data Science',
                'Quantum Computing',
                'Blockchain',
                'Cybersecurity',
                'Web Development',
                'Mobile Development',
                'Game Development',
                'Cloud Computing',
                'IoT',
                'AR/VR',
                'Business Intelligence'
              ].map(interest => (
                <label
                  key={interest}
                  className={`flex items-center p-3 rounded-lg cursor-pointer ${
                    preferences.interests.includes(interest)
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-700 text-gray-300'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={preferences.interests.includes(interest)}
                    onChange={() => handleInterestToggle(interest)}
                    className="sr-only"
                  />
                  <span>{interest}</span>
                  {preferences.interests.includes(interest) && (
                    <Check className="ml-auto" size={16} />
                  )}
                </label>
              ))}
            </div>
          </div>
        );
      case 3:
        return (
          <div className="text-center">
            <Zap className="mx-auto text-yellow-400 mb-6" size={64} />
            <h2 className="text-2xl font-bold text-white mb-4">You're All Set!</h2>
            <p className="text-gray-300 mb-6">
              Your MachineGod AI system is now configured and ready to use.
            </p>
            <div className="bg-green-900 bg-opacity-30 p-4 rounded-lg border border-green-600 mb-6">
              <p className="text-green-300">
                <strong>Natural Learning Active:</strong> The system will learn from every interaction,
                continuously improving to better serve your needs.
              </p>
            </div>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Check className="text-green-400" size={20} />
                <span className="text-white">Personalized settings applied</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="text-green-400" size={20} />
                <span className="text-white">Interest-based customization complete</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="text-green-400" size={20} />
                <span className="text-white">Continuous learning system activated</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="text-green-400" size={20} />
                <span className="text-white">Offline capabilities enabled</span>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-gray-900 border-2 border-purple-500 rounded-lg p-8 max-w-2xl w-full mx-4">
        <div className="mb-8">
          {/* Progress bar */}
          <div className="flex justify-between mb-2">
            {steps.map((step, index) => (
              <div
                key={index}
                className={`flex items-center justify-center w-8 h-8 rounded-full ${
                  index <= currentStep
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-700 text-gray-400'
                }`}
              >
                {index < currentStep ? (
                  <Check size={16} />
                ) : (
                  <span>{index + 1}</span>
                )}
              </div>
            ))}
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div
              className="bg-purple-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            ></div>
          </div>
        </div>

        <div className="min-h-[300px]">
          {renderStepContent()}
        </div>

        <div className="mt-8 flex justify-between">
          <div>
            {currentStep > 0 ? (
              <button
                onClick={handleBack}
                className="flex items-center px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg"
              >
                <ChevronLeft size={16} className="mr-1" />
                Back
              </button>
            ) : (
              <button
                onClick={handleSkip}
                className="px-4 py-2 text-gray-400 hover:text-white"
              >
                Skip
              </button>
            )}
          </div>
          <button
            onClick={handleNext}
            className="flex items-center px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg"
          >
            {currentStep === steps.length - 1 ? 'Get Started' : 'Next'}
            {currentStep < steps.length - 1 && <ChevronRight size={16} className="ml-1" />}
          </button>
        </div>
      </div>
    </div>
  );
};