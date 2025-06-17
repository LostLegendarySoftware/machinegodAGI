import React, { useState, useEffect } from 'react';
import { EnhancedTrainingSystem } from '../core/EnhancedTrainingSystem';
import { Brain, Target, Lightbulb, CheckCircle, XCircle, MessageSquare, TrendingUp } from 'lucide-react';

interface EnhancedTrainingInterfaceProps {
  onTrainingComplete: () => void;
  isVisible: boolean;
}

export const EnhancedTrainingInterface: React.FC<EnhancedTrainingInterfaceProps> = ({
  onTrainingComplete,
  isVisible
}) => {
  const [trainingSystem] = useState(() => new EnhancedTrainingSystem());
  const [currentPrompt, setCurrentPrompt] = useState<any>(null);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [waitingForValidation, setWaitingForValidation] = useState(false);
  const [waitingForExplanation, setWaitingForExplanation] = useState(false);
  const [lastAIResponse, setLastAIResponse] = useState('');
  const [progress, setProgress] = useState<any>({ correct: 0, total: 25, remaining: 25 });
  const [sessionStarted, setSessionStarted] = useState(false);
  const [personalityProfile, setPersonalityProfile] = useState<any>(null);
  const [knownFacts, setKnownFacts] = useState<any[]>([]);
  const [learningFeedback, setLearningFeedback] = useState('');

  useEffect(() => {
    if (isVisible && !sessionStarted) {
      startEnhancedTraining();
    }
  }, [isVisible, sessionStarted]);

  const startEnhancedTraining = () => {
    trainingSystem.startTrainingSession();
    setCurrentPrompt(trainingSystem.getNextPrompt());
    setSessionStarted(true);
    updateMetrics();
    console.log('🧠 Enhanced training started with contextual reasoning');
  };

  const updateMetrics = () => {
    setProgress(trainingSystem.getTrainingProgress());
    setPersonalityProfile(trainingSystem.getPersonalityProfile());
    setKnownFacts(trainingSystem.getKnownFacts());
  };

  const handleSubmitInput = async () => {
    if (!currentPrompt || !userInput.trim()) return;

    setIsLoading(true);
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    if (currentPrompt.type === 'guess') {
      // Handle guess response
      const result = trainingSystem.processResponse(userInput, currentPrompt.questionId!, true);
      
      if (result.success && !result.needsMoreInfo) {
        // Guess was correct
        setCurrentPrompt(result.nextPrompt);
        setLearningFeedback(result.feedback || '');
        updateMetrics();
      } else if (result.needsMoreInfo) {
        // Guess was wrong, need explanation
        setWaitingForExplanation(true);
        setLearningFeedback(result.feedback || '');
      }
    } else {
      // Handle regular question response
      const result = trainingSystem.processResponse(userInput, currentPrompt.questionId!, false);
      
      if (result.waitingForValidation) {
        setLastAIResponse(result.aiResponse);
        setWaitingForValidation(true);
      }
    }
    
    setUserInput('');
    setIsLoading(false);
  };

  const handleValidation = (isCorrect: boolean) => {
    if (isCorrect) {
      const result = trainingSystem.processValidation('yes');
      setProgress(result.progress);
      setWaitingForValidation(false);
      
      if (result.isComplete) {
        onTrainingComplete();
        return;
      }
      
      setCurrentPrompt(result.nextPrompt);
      updateMetrics();
    } else {
      setWaitingForValidation(false);
      setWaitingForExplanation(true);
    }
  };

  const handleExplanationSubmit = () => {
    if (!userInput.trim()) return;

    const result = trainingSystem.processValidation('no', userInput);
    setProgress(result.progress);
    setWaitingForExplanation(false);
    setLearningFeedback(result.learningApplied || '');
    
    if (result.nextPrompt) {
      setCurrentPrompt(result.nextPrompt);
    }
    
    setUserInput('');
    updateMetrics();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isLoading) {
      if (waitingForExplanation) {
        handleExplanationSubmit();
      } else if (!waitingForValidation) {
        handleSubmitInput();
      }
    }
  };

  if (!isVisible) return null;

  const progressPercentage = (progress.correct / progress.total) * 100;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
      <div className="bg-gray-900 border-2 border-purple-500 rounded-lg p-8 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center mb-4">
            <Brain className="text-purple-400 mr-3" size={32} />
            <h1 className="text-2xl font-bold text-purple-300">Enhanced Training with Contextual Reasoning</h1>
          </div>
          <p className="text-gray-300 mb-4">
            Smart training that learns from your preferences and skips redundant questions
          </p>
          
          {/* Progress Bar */}
          <div className="bg-gray-700 rounded-full h-4 mb-2">
            <div 
              className="bg-gradient-to-r from-purple-500 to-green-500 h-4 rounded-full transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
          <div className="text-sm text-gray-400">
            {progress.correct} / {progress.total} correct • {progress.personalityDeveloped?.toFixed(0)}% personality developed
          </div>
        </div>

        {/* Metrics Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-purple-900 bg-opacity-30 p-3 rounded-lg border border-purple-600">
            <div className="flex items-center mb-2">
              <Target className="text-purple-400 mr-2" size={16} />
              <span className="text-purple-300 font-medium">Progress</span>
            </div>
            <div className="text-2xl font-bold text-white">{progress.correct}/25</div>
            <div className="text-xs text-gray-400">{progress.remaining} remaining</div>
          </div>
          
          <div className="bg-blue-900 bg-opacity-30 p-3 rounded-lg border border-blue-600">
            <div className="flex items-center mb-2">
              <Brain className="text-blue-400 mr-2" size={16} />
              <span className="text-blue-300 font-medium">Facts Learned</span>
            </div>
            <div className="text-2xl font-bold text-white">{progress.factsLearned || 0}</div>
            <div className="text-xs text-gray-400">Known preferences</div>
          </div>
          
          <div className="bg-green-900 bg-opacity-30 p-3 rounded-lg border border-green-600">
            <div className="flex items-center mb-2">
              <Lightbulb className="text-green-400 mr-2" size={16} />
              <span className="text-green-300 font-medium">Inferences</span>
            </div>
            <div className="text-2xl font-bold text-white">{progress.inferencesMade || 0}</div>
            <div className="text-xs text-gray-400">Smart guesses made</div>
          </div>
        </div>

        {/* Learning Feedback */}
        {learningFeedback && (
          <div className="mb-4 p-3 bg-blue-900 bg-opacity-30 rounded-lg border border-blue-600">
            <div className="flex items-center mb-2">
              <TrendingUp className="text-blue-400 mr-2" size={16} />
              <span className="text-blue-300 font-medium">Learning Applied:</span>
            </div>
            <p className="text-white text-sm">{learningFeedback}</p>
          </div>
        )}

        {/* Current Prompt */}
        {currentPrompt && (
          <div className="mb-6">
            <div className="flex items-center mb-3">
              {currentPrompt.type === 'guess' ? (
                <>
                  <Lightbulb className="text-yellow-400 mr-2" size={20} />
                  <span className="text-yellow-300 font-medium">
                    Smart Guess (Confidence: {(currentPrompt.confidence * 100).toFixed(0)}%)
                  </span>
                </>
              ) : (
                <>
                  <MessageSquare className="text-blue-400 mr-2" size={20} />
                  <span className="text-blue-300 font-medium">Question</span>
                </>
              )}
            </div>
            <div className={`p-4 rounded-lg border ${
              currentPrompt.type === 'guess' 
                ? 'bg-yellow-900 bg-opacity-30 border-yellow-600' 
                : 'bg-gray-800 border-gray-600'
            }`}>
              <p className="text-white text-lg">{currentPrompt.content}</p>
            </div>
          </div>
        )}

        {/* AI Response Validation */}
        {waitingForValidation && lastAIResponse && (
          <div className="mb-6">
            <div className="bg-green-900 bg-opacity-30 p-4 rounded-lg border border-green-600">
              <div className="flex items-center mb-2">
                <MessageSquare className="text-green-400 mr-2" size={16} />
                <span className="text-green-300 font-medium">AI Response:</span>
              </div>
              <p className="text-white">{lastAIResponse}</p>
            </div>
            
            <div className="mt-4 text-center">
              <p className="text-yellow-300 mb-4">Is this response appropriate and helpful?</p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => handleValidation(true)}
                  className="flex items-center px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <CheckCircle className="mr-2" size={20} />
                  Yes, Good Response
                </button>
                <button
                  onClick={() => handleValidation(false)}
                  className="flex items-center px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  <XCircle className="mr-2" size={20} />
                  No, Needs Improvement
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Explanation Input */}
        {waitingForExplanation && (
          <div className="mb-6">
            <div className="bg-orange-900 bg-opacity-30 p-4 rounded-lg border border-orange-600 mb-4">
              <p className="text-orange-300 font-medium mb-2">Help me learn!</p>
              <p className="text-gray-300 text-sm">
                Please explain what the correct answer should be, or what you'd prefer instead:
              </p>
            </div>
            <textarea
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Explain what the correct answer should be..."
              className="w-full p-3 bg-gray-800 text-white rounded-lg border border-gray-600 resize-none"
              rows={3}
            />
            <button
              onClick={handleExplanationSubmit}
              disabled={!userInput.trim()}
              className="mt-3 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
            >
              Submit Explanation
            </button>
          </div>
        )}

        {/* Input Area */}
        {!waitingForValidation && !waitingForExplanation && currentPrompt && (
          <div className="mb-6">
            <label className="block text-gray-300 mb-2">
              {currentPrompt.type === 'guess' ? 'Your Response:' : 'Your Answer:'}
            </label>
            <div className="flex space-x-3">
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={
                  currentPrompt.type === 'guess' 
                    ? "Yes/No or explain..." 
                    : "Type your answer here..."
                }
                className="flex-1 p-3 bg-gray-800 text-white rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none"
                disabled={isLoading}
              />
              <button
                onClick={handleSubmitInput}
                disabled={!userInput.trim() || isLoading}
                className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? 'Processing...' : 'Submit'}
              </button>
            </div>
          </div>
        )}

        {/* Personality Profile */}
        {personalityProfile && (
          <div className="bg-gray-800 p-4 rounded-lg border border-gray-600">
            <h3 className="text-purple-300 font-medium mb-3">Your Developing Personality Profile:</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
              <div>
                <span className="text-gray-400">Formality:</span>
                <div className="text-white font-medium">
                  {personalityProfile.formality > 0.3 ? 'Formal' : 
                   personalityProfile.formality < -0.3 ? 'Casual' : 'Balanced'}
                </div>
              </div>
              <div>
                <span className="text-gray-400">Style:</span>
                <div className="text-white font-medium">
                  {personalityProfile.directness > 0.3 ? 'Direct' : 
                   personalityProfile.directness < -0.3 ? 'Detailed' : 'Moderate'}
                </div>
              </div>
              <div>
                <span className="text-gray-400">Humor:</span>
                <div className="text-white font-medium">
                  {personalityProfile.humor > 0.3 ? 'Enjoys humor' : 
                   personalityProfile.humor < -0.3 ? 'Serious' : 'Neutral'}
                </div>
              </div>
              <div>
                <span className="text-gray-400">Tech Level:</span>
                <div className="text-white font-medium">
                  {personalityProfile.techLevel > 0.3 ? 'Technical' : 
                   personalityProfile.techLevel < -0.3 ? 'Simple' : 'Mixed'}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};