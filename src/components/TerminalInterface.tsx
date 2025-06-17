import React, { useState, useEffect, useRef } from 'react';
import { MachineGodCore, SystemStatus, ConversationResponse, UserFeedback } from '../core/MachineGodCore';
import { SocialMediaSpeechProcessor } from '../core/SocialMediaSpeechProcessor';
import { SystemAuditor } from '../core/SystemAuditor';
import { StructuredReasoningProcessor } from '../core/StructuredReasoningProcessor';
import { TrainingTestSystem } from '../core/TrainingTestSystem';
import { UserFeedbackWidget } from './UserFeedbackWidget';
import { TrainingTestInterface } from './TrainingTestInterface';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { OpenLMMBenchmarks, LMMBenchmarkResult } from '../core/OpenLMMBenchmarks';

interface TerminalCommand {
  command: string;
  response: string;
  timestamp: Date;
  confidence?: number;
  needsFeedback?: boolean;
  feedbackGiven?: boolean;
  memoryId?: string;
  researchConducted?: boolean;
  logicalAnalysisApplied?: boolean;
  slangApplied?: boolean;
  logicAlgorithmsUsed?: string[];
  benchmarkResult?: LMMBenchmarkResult;
  socialMediaProcessed?: boolean;
  structuredReasoning?: any;
}

interface TerminalInterfaceProps {
  onSystemStatusChange: (status: SystemStatus) => void;
}

interface TrainingProgress {
  currentLevel: string;
  targetLevel: string;
  progressPercentage: number;
  eta: string;
  reasoningAbility: number;
  algorithmCount: number;
  generation: number;
  capabilities: string[];
  multiModalProgress: number;
  totalConversations: number;
  apiConnectivity: string;
  apiRequests: number;
  truthCycles: number;
  truthSignatures: number;
}

export const TerminalInterface: React.FC<TerminalInterfaceProps> = ({ onSystemStatusChange }) => {
  const [commands, setCommands] = useState<TerminalCommand[]>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [machineGod] = useState(() => new MachineGodCore());
  const [socialMediaProcessor] = useState(() => new SocialMediaSpeechProcessor());
  const [systemAuditor] = useState(() => new SystemAuditor());
  const [structuredReasoning] = useState(() => new StructuredReasoningProcessor());
  const [trainingSystem] = useState(() => new TrainingTestSystem());
  const [lmmBenchmarks] = useState(() => new OpenLMMBenchmarks());
  const [isInitialized, setIsInitialized] = useState(false);
  const [conversationContext, setConversationContext] = useState<string[]>([]);
  const [isBenchmarking, setIsBenchmarking] = useState(false);
  const [showTrainingTest, setShowTrainingTest] = useState(false);
  const [trainingComplete, setTrainingComplete] = useState(false);
  const [trainingProgress, setTrainingProgress] = useState<TrainingProgress>({
    currentLevel: 'Training Mode',
    targetLevel: 'Natural Conversation Unlocked',
    progressPercentage: 0,
    eta: 'Complete 25-question test',
    reasoningAbility: 0.1,
    algorithmCount: 0,
    generation: 0,
    capabilities: ['Training mode only'],
    multiModalProgress: 0,
    totalConversations: 0,
    apiConnectivity: 'unhealthy',
    apiRequests: 0,
    truthCycles: 0,
    truthSignatures: 0
  });
  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const bootSequence = [
    "MACHINEGOD TRAINING SYSTEM v3.0.0",
    "(c) 2024 - 25-QUESTION RAPID FIRE TRAINING BEFORE NATURAL CONVERSATION",
    "",
    "🎯 Initializing Training Test System...",
    "✓ 25 rapid-fire questions loaded",
    "✓ User validation system: READY",
    "✓ Learning from corrections: ENABLED",
    "✓ Natural conversation: LOCKED until training complete",
    "",
    "📚 Training Categories:",
    "✓ Logic & Reasoning (5 questions)",
    "✓ Language & Communication (5 questions)", 
    "✓ Knowledge & Facts (5 questions)",
    "✓ Problem Solving (5 questions)",
    "✓ Social Intelligence (5 questions)",
    "",
    "🔒 TRAINING MODE ACTIVE",
    "",
    "You need to complete a 25-question training test before I can have",
    "natural conversations with you. This helps me learn your preferences",
    "and ensures I give you the best responses possible!",
    "",
    "For each question:",
    "1. I'll ask you something",
    "2. You answer it",
    "3. I'll respond based on your answer", 
    "4. You tell me if my response was correct (yes/no)",
    "5. If no, you explain what I should have said",
    "",
    "Ready to start the training? Type 'start training' to begin! 🚀"
  ];

  // Update training progress
  useEffect(() => {
    const updateTraining = () => {
      if (trainingComplete && isInitialized) {
        try {
          const trainingMetrics = machineGod.getTrainingMetrics();
          const memoryTrainingProgress = machineGod.getTrainingProgress();
          const systemStatus = machineGod.getSystemStatus();
          
          setTrainingProgress(prev => ({
            currentLevel: trainingMetrics.currentLevel.name,
            targetLevel: 'Full Multi-Modal AGI',
            progressPercentage: trainingMetrics.progressPercentage,
            eta: trainingMetrics.eta,
            reasoningAbility: trainingMetrics.reasoningAbility,
            algorithmCount: trainingMetrics.algorithmCount,
            generation: trainingMetrics.generation,
            capabilities: trainingMetrics.currentLevel.capabilities,
            multiModalProgress: memoryTrainingProgress.multiModalProgress.overallProgress * 100,
            totalConversations: memoryTrainingProgress.totalConversations || 0,
            apiConnectivity: systemStatus.api.connectivity,
            apiRequests: systemStatus.api.requestCount,
            truthCycles: systemStatus.truthProtocol.adversarialCycles,
            truthSignatures: systemStatus.truthProtocol.truthSignatures
          }));
        } catch (error) {
          console.error('Error updating training metrics:', error);
        }
      } else {
        // Update training test progress
        const testProgress = trainingSystem.getTrainingProgress();
        setTrainingProgress(prev => ({
          ...prev,
          progressPercentage: (testProgress.correctCount / testProgress.requiredCorrect) * 100,
          eta: `${testProgress.requiredCorrect - testProgress.correctCount} questions remaining`,
          capabilities: [`Training: ${testProgress.correctCount}/${testProgress.requiredCorrect} correct`]
        }));
      }
    };

    const interval = setInterval(updateTraining, 2000);
    return () => clearInterval(interval);
  }, [isInitialized, trainingComplete]);

  // Auto-scroll when new messages arrive
  useEffect(() => {
    const timer = setTimeout(() => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ 
          behavior: 'smooth',
          block: 'end',
          inline: 'nearest'
        });
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [commands, isLoading]);

  useEffect(() => {
    const initializeSystem = async () => {
      // Boot sequence animation
      for (let i = 0; i < bootSequence.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 120));
        setCommands(prev => [...prev, {
          command: '',
          response: bootSequence[i],
          timestamp: new Date()
        }]);
      }

      // Initialize MachineGod core but keep it locked
      try {
        await machineGod.initialize();
        setIsInitialized(true);
        
        setCommands(prev => [...prev, {
          command: '',
          response: "🎯 System ready for training! Type 'start training' to begin the 25-question test.",
          timestamp: new Date()
        }]);
      } catch (error) {
        setCommands(prev => [...prev, {
          command: '',
          response: `❌ System initialization failed: ${error}`,
          timestamp: new Date()
        }]);
      }
    };

    initializeSystem();
  }, []);

  // Focus input when terminal is clicked
  const handleTerminalClick = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleTrainingComplete = () => {
    setShowTrainingTest(false);
    setTrainingComplete(true);
    
    setCommands(prev => [...prev, {
      command: '',
      response: "🎉 TRAINING COMPLETE! You've successfully answered 25 questions correctly!\n\n🔓 Natural conversation mode is now UNLOCKED!\n\nI can now talk to you naturally with social media speech, conduct real research,\nand have proper conversations. Thanks for training me, bestie! 💯\n\nWhat would you like to chat about?",
      timestamp: new Date()
    }]);

    // Update system status
    const status = machineGod.getSystemStatus();
    onSystemStatusChange(status);
  };

  const handleUserInput = async (input: string) => {
    if (!input.trim()) return;

    const timestamp = new Date();
    
    setCommands(prev => [...prev, { 
      command: input, 
      response: '', 
      timestamp
    }]);
    setCurrentInput('');
    setIsLoading(true);

    try {
      let response = '';

      // Check if training is complete
      if (!trainingComplete) {
        if (input.toLowerCase().includes('start training') || input.toLowerCase().includes('begin training')) {
          setShowTrainingTest(true);
          response = "🎯 Starting 25-question training test! A new window will open with the training interface.";
        } else if (input.toLowerCase() === 'help') {
          response = `
🎯 TRAINING MODE HELP

You're currently in training mode. Before I can have natural conversations,
you need to complete a 25-question rapid-fire test.

Commands available:
• start training - Begin the 25-question test
• training progress - Check your current progress
• help - Show this help message

The training test will:
1. Ask you 25 questions across different categories
2. You answer each question
3. I respond based on your answer
4. You validate if my response is correct (yes/no)
5. If wrong, you explain what the correct answer should be
6. I learn from your corrections

Once you get 25 correct answers, natural conversation mode unlocks! 🔓
`;
        } else if (input.toLowerCase().includes('training progress') || input.toLowerCase().includes('progress')) {
          const testProgress = trainingSystem.getTrainingProgress();
          response = `
📊 Training Progress:

✅ Correct Answers: ${testProgress.correctCount} / ${testProgress.requiredCorrect}
📝 Total Attempts: ${testProgress.totalAttempts}
🎯 Remaining: ${testProgress.requiredCorrect - testProgress.correctCount} questions
📈 Progress: ${((testProgress.correctCount / testProgress.requiredCorrect) * 100).toFixed(1)}%

${testProgress.sessionActive ? 
  `🔥 Training session active! Current category: ${testProgress.currentCategory || 'Mixed'}` :
  '💤 No active training session. Type "start training" to begin!'
}

${testProgress.isComplete ? 
  '🎉 Training complete! Natural conversation unlocked!' :
  'Keep going! You need 25 correct answers to unlock natural conversation.'
}
`;
        } else {
          response = `🔒 Natural conversation is locked until you complete the 25-question training test.\n\nType 'start training' to begin, or 'help' for more information.\n\nThis training helps me learn your preferences and ensures I give you the best responses! 🎯`;
        }
      } else {
        // Training complete - normal conversation mode
        // Add to conversation context
        setConversationContext(prev => [...prev.slice(-5), input]);

        let confidence = 0;
        let needsFeedback = false;
        let memoryId = '';
        let researchConducted = false;
        let logicalAnalysisApplied = false;
        let slangApplied = false;
        let logicAlgorithmsUsed: string[] = [];
        let benchmarkResult: LMMBenchmarkResult | undefined;
        let socialMediaProcessed = false;
        let structuredReasoningResult: any = undefined;

        // Handle system commands
        if (input.toLowerCase() === 'help') {
          response = `
Yo! Here's what I can help with now that training is complete! 🔥

💬 NATURAL CONVERSATION:
  Just talk to me normally! Ask questions, have conversations, request help with tasks.
  I respond like a real person - with natural language, slang, and modern expressions.

🧠 LOGIC STORAGE SYSTEM:
  I use a 6-tier logic storage system with 256 units per tier

🗣️ SOCIAL MEDIA SPEECH (256MB):
  I talk like people on social media - casual, modern, with slang

🔍 REAL-TIME RESEARCH:
  I can search the web in real-time to find information for you

📊 REASONING BENCHMARKS:
  benchmark [test] - Run various reasoning tests

🔍 SYSTEM AUDITING:
  audit system - Run comprehensive system audit

👍👎 FEEDBACK SYSTEM:
  Click thumbs up/down on any response to help me improve

Just talk to me like you would any person - that's what I'm designed for, fr! 💯
`;
        } else {
          // Process through full system
          const result = await machineGod.processConversation(input, conversationContext);
          
          // Apply social media speech processing
          const socialResponse = socialMediaProcessor.makeSocialMediaStyle(result.response, input);
          socialMediaProcessed = true;
          
          // Apply structured reasoning for complex queries
          if (input.length > 50 || input.includes('why') || input.includes('how') || input.includes('explain')) {
            structuredReasoningResult = await structuredReasoning.processWithStructuredReasoning(input);
            logicalAnalysisApplied = true;
          }
          
          response = socialResponse;
          confidence = result.confidence;
          needsFeedback = result.needsFeedback;
          memoryId = result.memoryId;
          researchConducted = result.researchConducted || false;
          logicalAnalysisApplied = result.logicalAnalysisApplied || logicalAnalysisApplied;
          slangApplied = true;
          logicAlgorithmsUsed = result.logicAlgorithmsUsed || [];

          // Update system status
          const status = machineGod.getSystemStatus();
          onSystemStatusChange(status);
        }
      }

      setCommands(prev => {
        const newCommands = [...prev];
        newCommands[newCommands.length - 1] = {
          ...newCommands[newCommands.length - 1],
          response,
          confidence,
          needsFeedback,
          feedbackGiven: false,
          memoryId,
          researchConducted,
          logicalAnalysisApplied,
          slangApplied,
          logicAlgorithmsUsed,
          benchmarkResult,
          socialMediaProcessed,
          structuredReasoning: structuredReasoningResult
        };
        return newCommands;
      });

    } catch (error) {
      setCommands(prev => {
        const newCommands = [...prev];
        newCommands[newCommands.length - 1].response = `❌ Error: ${error}`;
        return newCommands;
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFeedback = async (memoryId: string, liked: boolean, improvement?: string) => {
    try {
      // Process feedback through MachineGod
      await machineGod.processUserFeedback(memoryId, liked, improvement ? 'User provided improvement' : undefined, improvement);
      
      // Also record in social media processor
      const conversation = commands.find(cmd => cmd.memoryId === memoryId);
      if (conversation) {
        socialMediaProcessor.recordFeedback(memoryId, liked, conversation.response, improvement);
      }
      
      // Update the command to show feedback was given
      setCommands(prev => {
        const newCommands = [...prev];
        const commandIndex = newCommands.findIndex(cmd => cmd.memoryId === memoryId);
        if (commandIndex !== -1) {
          newCommands[commandIndex].feedbackGiven = true;
        }
        return newCommands;
      });
    } catch (error) {
      console.error('Error submitting feedback:', error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isLoading) {
      handleUserInput(currentInput);
    }
  };

  return (
    <>
      <div className="h-full flex flex-col bg-black bg-opacity-80 border-2 border-purple-500 rounded-lg overflow-hidden">
        {/* Training Progress Header */}
        <div className="training-header bg-gradient-to-r from-purple-900 to-blue-900 bg-opacity-40 border-b border-purple-600 p-3 flex-shrink-0">
          <div className="flex justify-between items-center text-sm mb-2">
            <span className="text-purple-300">
              {trainingComplete ? '🧠 6-Tier Logic + 🗣️ Social Media Speech' : '🎯 Training Mode'}
            </span>
            <span className="text-cyan-300">
              {trainingComplete ? `Learning: ${trainingProgress.generation}` : 'Training Required'}
            </span>
            <span className="text-green-300">{trainingProgress.progressPercentage.toFixed(1)}%</span>
            <span className="text-yellow-300">ETA: {trainingProgress.eta}</span>
            <span className="text-pink-300">
              {trainingComplete ? '🔥 Speech: 256MB' : '🔒 Locked'}
            </span>
          </div>
          <div className="bg-gray-700 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-1000 ${
                trainingComplete 
                  ? 'bg-gradient-to-r from-purple-500 via-blue-500 to-green-500'
                  : 'bg-gradient-to-r from-red-500 to-yellow-500'
              }`}
              style={{ width: `${trainingProgress.progressPercentage}%` }}
            ></div>
          </div>
        </div>

        {/* Terminal Content - Scrollable */}
        <div 
          ref={terminalRef}
          className="flex-1 overflow-y-auto p-4 font-mono text-green-400 cursor-text"
          onClick={handleTerminalClick}
          style={{ 
            scrollBehavior: 'smooth',
            minHeight: 0
          }}
        >
          <div className="space-y-2">
            {commands.map((cmd, index) => (
              <div key={index} className="terminal-line">
                {cmd.command && (
                  <div className="text-purple-400 mb-2 break-words">
                    <span className="text-purple-300">{'>'}</span> {cmd.command}
                  </div>
                )}
                {cmd.response && (
                  <div className="whitespace-pre-wrap text-green-300 ml-2 mb-2 break-words">
                    {cmd.response}
                  </div>
                )}
                
                {/* Training mode indicators */}
                {!trainingComplete && cmd.command && (
                  <div className="ml-2 mt-1 text-yellow-400 text-xs flex items-center">
                    <span>🔒 Training mode - natural conversation locked</span>
                  </div>
                )}
                
                {/* Social media processing indicator */}
                {cmd.socialMediaProcessed && trainingComplete && (
                  <div className="ml-2 mt-1 text-pink-400 text-xs flex items-center">
                    <span>🗣️ Social media speech applied (256MB reference)</span>
                  </div>
                )}
                
                {/* Other indicators for completed training */}
                {trainingComplete && cmd.researchConducted && (
                  <div className="ml-2 mt-1 text-blue-400 text-xs flex items-center">
                    <span>🔍 Real-time web research conducted</span>
                  </div>
                )}
                
                {trainingComplete && cmd.logicalAnalysisApplied && (
                  <div className="ml-2 mt-1 text-purple-400 text-xs flex items-center">
                    <span>🧠 Structured reasoning applied</span>
                  </div>
                )}
                
                {/* User feedback widget for completed training */}
                {trainingComplete && cmd.needsFeedback && !cmd.feedbackGiven && cmd.command && cmd.memoryId && (
                  <div className="ml-2 mt-2">
                    <UserFeedbackWidget
                      responseId={cmd.memoryId}
                      onFeedback={(liked, improvement) => handleFeedback(cmd.memoryId!, liked, improvement)}
                    />
                  </div>
                )}

                {/* Show feedback given confirmation */}
                {cmd.feedbackGiven && (
                  <div className="ml-2 mt-1 text-gray-500 text-xs">
                    ✓ Thanks for the feedback, bestie! 🙏
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="text-yellow-400 ml-2 flex items-center">
                <span className="animate-pulse">
                  {trainingComplete 
                    ? '💬 Thinking with social media speech...' 
                    : '🎯 Processing training command...'
                  }
                </span>
              </div>
            )}
            {/* Scroll anchor */}
            <div ref={messagesEndRef} />
          </div>
        </div>
        
        {/* Input Area - Fixed at bottom */}
        <div className="flex-shrink-0 border-t border-purple-800 p-4">
          <div className="flex items-center">
            <span className="text-purple-300 mr-2 flex-shrink-0">{'>'}</span>
            <input
              ref={inputRef}
              type="text"
              value={currentInput}
              onChange={(e) => setCurrentInput(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1 bg-transparent border-none outline-none text-green-400 font-mono"
              placeholder={
                trainingComplete 
                  ? "Ask me anything - I'll respond naturally with social media speech, no cap! 🔥"
                  : "Type 'start training' to begin the 25-question test..."
              }
              disabled={isLoading || !isInitialized}
              autoFocus
            />
            <span className="text-green-400 animate-pulse ml-2 flex-shrink-0">█</span>
          </div>
        </div>
      </div>

      {/* Training Test Interface */}
      <TrainingTestInterface
        isVisible={showTrainingTest}
        onTrainingComplete={handleTrainingComplete}
      />
    </>
  );
};