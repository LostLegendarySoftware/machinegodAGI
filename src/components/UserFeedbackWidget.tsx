import React, { useState } from 'react';
import { ThumbsUp, ThumbsDown, MessageSquare, X } from 'lucide-react';

interface UserFeedbackWidgetProps {
  responseId: string;
  onFeedback: (liked: boolean, improvement?: string) => void;
  disabled?: boolean;
}

export const UserFeedbackWidget: React.FC<UserFeedbackWidgetProps> = ({
  responseId,
  onFeedback,
  disabled = false
}) => {
  const [feedbackGiven, setFeedbackGiven] = useState(false);
  const [showImprovement, setShowImprovement] = useState(false);
  const [improvement, setImprovement] = useState('');
  const [feedbackType, setFeedbackType] = useState<'like' | 'dislike' | null>(null);

  const handleLike = () => {
    if (disabled || feedbackGiven) return;
    
    setFeedbackType('like');
    setFeedbackGiven(true);
    onFeedback(true);
  };

  const handleDislike = () => {
    if (disabled || feedbackGiven) return;
    
    setFeedbackType('dislike');
    setShowImprovement(true);
  };

  const submitImprovement = () => {
    setFeedbackGiven(true);
    setShowImprovement(false);
    onFeedback(false, improvement);
  };

  const cancelImprovement = () => {
    setShowImprovement(false);
    setFeedbackType(null);
  };

  if (feedbackGiven && !showImprovement) {
    return (
      <div className="flex items-center space-x-2 text-sm text-gray-500 mt-2">
        {feedbackType === 'like' ? (
          <>
            <ThumbsUp size={16} className="text-green-500" />
            <span>Thanks for the feedback!</span>
          </>
        ) : (
          <>
            <ThumbsDown size={16} className="text-red-500" />
            <span>Thanks for helping me improve!</span>
          </>
        )}
      </div>
    );
  }

  if (showImprovement) {
    return (
      <div className="mt-3 p-3 bg-gray-800 rounded-lg border border-gray-600">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-yellow-300">How can I improve?</span>
          <button
            onClick={cancelImprovement}
            className="text-gray-400 hover:text-white"
          >
            <X size={16} />
          </button>
        </div>
        <textarea
          value={improvement}
          onChange={(e) => setImprovement(e.target.value)}
          placeholder="Tell me what you'd prefer instead..."
          className="w-full p-2 bg-gray-700 text-white rounded border border-gray-600 text-sm resize-none"
          rows={2}
        />
        <div className="flex space-x-2 mt-2">
          <button
            onClick={submitImprovement}
            className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
          >
            Submit
          </button>
          <button
            onClick={cancelImprovement}
            className="px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700"
          >
            Skip
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-3 mt-2">
      <span className="text-xs text-gray-400">Was this helpful?</span>
      <div className="flex space-x-1">
        <button
          onClick={handleLike}
          disabled={disabled}
          className={`p-1 rounded transition-colors ${
            disabled 
              ? 'text-gray-600 cursor-not-allowed' 
              : 'text-gray-400 hover:text-green-400 hover:bg-green-900 hover:bg-opacity-20'
          }`}
          title="This was helpful"
        >
          <ThumbsUp size={16} />
        </button>
        <button
          onClick={handleDislike}
          disabled={disabled}
          className={`p-1 rounded transition-colors ${
            disabled 
              ? 'text-gray-600 cursor-not-allowed' 
              : 'text-gray-400 hover:text-red-400 hover:bg-red-900 hover:bg-opacity-20'
          }`}
          title="This wasn't helpful"
        >
          <ThumbsDown size={16} />
        </button>
      </div>
    </div>
  );
};