import React, { useState, useEffect } from 'react';
import { TrainingTestSystem, TrainingQuestion, TrainingAttempt } from '../core/TrainingTestSystem';
import { CheckCircle, XCircle, Brain, Target, BookOpen, MessageSquare } from 'lucide-react';

interface TrainingTestInterfaceProps {
  onTrainingComplete: () => void;
  isVisible: boolean;
}

export const TrainingTestInterface: React.FC<TrainingTestInterfaceProps> = ({
  onTrainingComplete,
  isVisible
}) => {
  const [trainingSystem] = useState(() => new TrainingTestSystem());
  const [currentQuestion, setCurrentQuestion] = useState<TrainingQuestion | null>(null);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [lastAttempt, setLastAttempt] = useState<TrainingAttempt | null>(null);
  const [waitingForValidation, setWaitingForValidation] = useState(false);
  const [waitingForFeedback, setWaitingForFeedback] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [progress, setProgress] = useState({ correct: 0, total: 25, remaining: 25 });
  const [sessionStarted, setSessionStarted] = useState(false);

  useEffect(() => {
    if (isVisible && !sessionStarted) {
      startTraining();
    }
  }, [isVisible, sessionStarted]);

  const startTraining = () => {
    trainingSystem.startTrainingSession();
    setCurrentQuestion(trainingSystem.getCurrentQuestion());
    setSessionStarted(true);
    console.log('🎯 Training test started - need 25 correct answers to unlock natural conversation');
  };

  const handleSubmitAnswer = async () => {
    if (!currentQuestion || !userInput.trim()) return;

    setIsLoading(true);
    
    // Simulate AI processing the answer
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // For now, just echo the user input as the AI response
    // In a real implementation, this would go through the AI system
    const aiResponse = userInput.trim();
    
    const attempt = trainingSystem.submitAnswer(userInput, aiResponse);
    setLastAttempt(attempt);
    setWaitingForValidation(true);
    setUserInput('');
    setIsLoading(false);
  };

  const handleValidation = (isCorrect: boolean) => {
    if (!lastAttempt) return;

    if (isCorrect) {
      const result = trainingSystem.processValidation('yes');
      setProgress(result.progress);
      setWaitingForValidation(false);
      
      if (result.isComplete) {
        onTrainingComplete();
        return;
      }
      
      // Move to next question
      setCurrentQuestion(trainingSystem.getCurrentQuestion());
    } else {
      setWaitingForValidation(false);
      setWaitingForFeedback(true);
    }
  };

  const handleFeedbackSubmit = () => {
    if (!feedback.trim()) return;

    const result = trainingSystem.processValidation('no', feedback);
    setProgress(result.progress);
    setWaitingForFeedback(false);
    setFeedback('');
    
    // Move to next question
    setCurrentQuestion(trainingSystem.getCurrentQuestion());
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isLoading && !waitingForValidation && !waitingForFeedback) {
      handleSubmitAnswer();
    }
  };

  if (!isVisible) return null;

  const progressPercentage = (progress.correct / progress.total) * 100;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
      <div className="bg-gray-900 border-2 border-purple-500 rounded-lg p-8 max-w-2xl w-full mx-4">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center mb-4">
            <Target className="text-purple-400 mr-3" size={32} />
            <h1 className="text-2xl font-bold text-purple-300">Training Test</h1>
          </div>
          <p className="text-gray-300 mb-4">
            Answer 25 questions correctly to unlock natural conversation mode
          </p>
          
          {/* Progress Bar */}
          <div className="bg-gray-700 rounded-full h-4 mb-2">
            <div 
              className="bg-gradient-to-r from-purple-500 to-green-500 h-4 rounded-full transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
          <div className="text-sm text-gray-400">
            {progress.correct} / {progress.total} correct ({progress.remaining} remaining)
          </div>
        </div>

        {/* Current Question */}
        {currentQuestion && (
          <div className="mb-6">
            <div className="flex items-center mb-3">
              <Brain className="text-blue-400 mr-2" size={20} />
              <span className="text-blue-300 font-medium capitalize">
                {currentQuestion.category} • {currentQuestion.difficulty}
              </span>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg border border-gray-600">
              <p className="text-white text-lg">{currentQuestion.question}</p>
            </div>
          </div>
        )}

        {/* Last AI Response (if waiting for validation) */}
        {waitingForValidation && lastAttempt && (
          <div className="mb-6">
            <div className="bg-green-900 bg-opacity-30 p-4 rounded-lg border border-green-600">
              <div className="flex items-center mb-2">
                <MessageSquare className="text-green-400 mr-2" size={16} />
                <span className="text-green-300 font-medium">AI Response:</span>
              </div>
              <p className="text-white">{lastAttempt.aiResponse}</p>
            </div>
            
            <div className="mt-4 text-center">
              <p className="text-yellow-300 mb-4">Is this answer correct?</p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => handleValidation(true)}
                  className="flex items-center px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <CheckCircle className="mr-2" size={20} />
                  Yes, Correct
                </button>
                <button
                  onClick={() => handleValidation(false)}
                  className="flex items-center px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  <XCircle className="mr-2" size={20} />
                  No, Wrong
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Feedback Input */}
        {waitingForFeedback && (
          <div className="mb-6">
            <div className="bg-red-900 bg-opacity-30 p-4 rounded-lg border border-red-600 mb-4">
              <p className="text-red-300 font-medium mb-2">Why was the answer wrong?</p>
              <p className="text-gray-300 text-sm">Help the AI learn by explaining what the correct answer should be:</p>
            </div>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Explain what the correct answer should be..."
              className="w-full p-3 bg-gray-800 text-white rounded-lg border border-gray-600 resize-none"
              rows={3}
            />
            <button
              onClick={handleFeedbackSubmit}
              disabled={!feedback.trim()}
              className="mt-3 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
            >
              Submit Feedback
            </button>
          </div>
        )}

        {/* Answer Input */}
        {!waitingForValidation && !waitingForFeedback && currentQuestion && (
          <div className="mb-6">
            <label className="block text-gray-300 mb-2">Your Answer:</label>
            <div className="flex space-x-3">
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your answer here..."
                className="flex-1 p-3 bg-gray-800 text-white rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none"
                disabled={isLoading}
              />
              <button
                onClick={handleSubmitAnswer}
                disabled={!userInput.trim() || isLoading}
                className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? 'Processing...' : 'Submit'}
              </button>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="bg-gray-800 p-4 rounded-lg border border-gray-600">
          <div className="flex items-center mb-2">
            <BookOpen className="text-yellow-400 mr-2" size={16} />
            <span className="text-yellow-300 font-medium">Instructions:</span>
          </div>
          <ul className="text-gray-300 text-sm space-y-1">
            <li>• Answer each question as best as you can</li>
            <li>• The AI will respond based on your answer</li>
            <li>• Validate if the AI's response is correct (Yes/No)</li>
            <li>• If wrong, explain what the correct answer should be</li>
            <li>• Need 25 correct answers to unlock natural conversation</li>
          </ul>
        </div>
      </div>
    </div>
  );
};