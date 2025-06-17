import React, { useState, useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Users, Brain } from 'lucide-react';

interface FloatingResponseBoxProps {
  content: string;
  consensusAchieved: boolean;
  verificationPassed: boolean;
  onUserClick: () => void;
  onClose: () => void;
  visible: boolean;
}

export const FloatingResponseBox: React.FC<FloatingResponseBoxProps> = ({
  content,
  consensusAchieved,
  verificationPassed,
  onUserClick,
  onClose,
  visible
}) => {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (visible) {
      setIsAnimating(true);
    }
  }, [visible]);

  if (!visible) return null;

  const getStatusColor = () => {
    if (consensusAchieved && verificationPassed) return 'border-green-500 bg-green-900';
    if (consensusAchieved && !verificationPassed) return 'border-yellow-500 bg-yellow-900';
    return 'border-red-500 bg-red-900';
  };

  const getStatusIcon = () => {
    if (consensusAchieved && verificationPassed) return <CheckCircle className="text-green-400" size={20} />;
    if (consensusAchieved && !verificationPassed) return <AlertCircle className="text-yellow-400" size={20} />;
    return <AlertCircle className="text-red-400" size={20} />;
  };

  const getStatusText = () => {
    if (consensusAchieved && verificationPassed) return 'Consensus Achieved & Verified';
    if (consensusAchieved && !verificationPassed) return 'Consensus Achieved - Verification Pending';
    return 'Consensus Failed';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div 
        className={`
          relative max-w-2xl w-full mx-4 p-6 rounded-lg border-2 bg-opacity-95 backdrop-blur-md
          ${getStatusColor()}
          ${isAnimating ? 'animate-pulse' : ''}
          transform transition-all duration-500 ease-in-out
          ${visible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}
        `}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <X size={24} />
        </button>

        {/* Header */}
        <div className="flex items-center mb-4">
          {getStatusIcon()}
          <div className="ml-3">
            <h3 className="text-lg font-bold text-white">{getStatusText()}</h3>
            <div className="flex items-center text-sm text-gray-300">
              <Users size={16} className="mr-1" />
              <span>Agent Teams</span>
              <Brain size={16} className="ml-3 mr-1" />
              <span>Verification Loop</span>
            </div>
          </div>
        </div>

        {/* Status indicators */}
        <div className="flex space-x-4 mb-4">
          <div className={`flex items-center px-3 py-1 rounded-full text-sm ${
            consensusAchieved ? 'bg-green-800 text-green-200' : 'bg-red-800 text-red-200'
          }`}>
            <Users size={14} className="mr-1" />
            {consensusAchieved ? 'Consensus ✓' : 'Consensus ✗'}
          </div>
          
          <div className={`flex items-center px-3 py-1 rounded-full text-sm ${
            verificationPassed ? 'bg-green-800 text-green-200' : 'bg-yellow-800 text-yellow-200'
          }`}>
            <Brain size={14} className="mr-1" />
            {verificationPassed ? 'Verified ✓' : 'Pending ⏳'}
          </div>
        </div>

        {/* Content */}
        <div className="bg-black bg-opacity-40 rounded-lg p-4 mb-4 max-h-64 overflow-y-auto">
          <div className="text-green-300 whitespace-pre-wrap font-mono text-sm">
            {content}
          </div>
        </div>

        {/* Action button */}
        <div className="flex justify-center">
          <button
            onClick={onUserClick}
            className={`
              px-6 py-3 rounded-lg font-semibold transition-all duration-200
              ${consensusAchieved 
                ? 'bg-green-600 hover:bg-green-700 text-white' 
                : 'bg-red-600 hover:bg-red-700 text-white'
              }
              transform hover:scale-105 active:scale-95
            `}
          >
            {consensusAchieved ? 'Accept Response' : 'Try Again'}
          </button>
        </div>

        {/* Footer info */}
        <div className="mt-4 text-xs text-gray-400 text-center">
          {consensusAchieved 
            ? 'All agent teams have reached agreement on this response'
            : 'Agent teams could not reach consensus - please rephrase your question'
          }
        </div>
      </div>
    </div>
  );
};