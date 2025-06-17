import React, { useState, useEffect, useRef } from 'react';
import { MachineGodCore, SystemStatus, ConversationResponse, UserFeedback } from '../core/MachineGodCore';
import { SocialMediaSpeechProcessor } from '../core/SocialMediaSpeechProcessor';
import { SystemAuditor } from '../core/SystemAuditor';
import { StructuredReasoningProcessor } from '../core/StructuredReasoningProcessor';
import { EnhancedTrainingSystem } from '../core/EnhancedTrainingSystem';
import { UserFeedbackWidget } from './UserFeedbackWidget';
import { EnhancedTrainingInterface } from './EnhancedTrainingInterface';
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
  const [enhancedTraining] = useState(() => new EnhancedTrainingSystem());
  const [lmmBenchmarks] = useState(() => new OpenLMMBenchmarks());
  const [isInitialized, setIsInitialized] = useState(false);
  const [conversationContext, setConversationContext] = useState<string[]>([]);
  const [isBenchmarking, setIsBenchmarking] = useState(false);
  const [showTrainingTest, setShowTrainingTest] = useState(false);
  const [trainingComplete, setTrainingComplete] = useState(false);
  const [trainingProgress, setTrainingProgress] = useState<TrainingProgress>({
    currentLevel: 'Enhanced Training Mode',
    targetLevel: 'Natural Conversation with Contextual Learning',
    progressPercentage: 0,
    eta: 'Complete enhanced 25-question test',
    reasoningAbility: 0.1,
    algorithmCount: 0,
    generation: 0,
    capabilities: ['Enhanced training with contextual reasoning'],
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
    "MACHINEGOD ENHANCED TRAINING SYSTEM v4.0.0",
    "(c) 2024 - CONTEXTUAL REASONING + ADAPTIVE LEARNING",
    "",
    "🧠 Initializing Enhanced Training with Contextual Reasoning...",
    "✓ Redundancy checking: ENABLED",
    "✓ Contextual guessing: ACTIVE", 
    "✓ Better 'no' response handling: READY",
    "✓ Explanation parsing: ENHANCED",
    "✓ Known facts storage: INITIALIZED",
    "✓ Personality profiling: ACTIVE",
    "",
    "🎯 Enhanced Training Features:",
    "✓ Smart question skipping based on inferred answers",
    "✓ Contextual guesses from previous responses",
    "✓ Deep learning from user corrections",
    "✓ Personality development tracking",
    "✓ Adaptive reasoning patterns",
    "",
    "🔒 ENHANCED TRAINING MODE ACTIVE",
    "",
    "This enhanced training system learns your preferences as we go",
    "and makes smart guesses to skip redundant questions. It builds",
    "a personality profile and adapts to your communication style.",
    "",
    "The system will:",
    "1. Ask you questions and learn from your answers",
    "2. Make educated guesses based on what it's learned",
    "3. When you say 'no', ask for explanations to improve",
    "4. Skip questions it can already answer from context",
    "5. Build a comprehensive personality profile",
    "",
    "Ready to start enhanced training? Type 'start training' to begin! 🚀"
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
            multiModalProgress: (memoryTrainingProgress.overallProgress || 0) * 100,
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
        // Update enhanced training progress
        const testProgress = enhancedTraining.getTrainingProgress();
        setTrainingProgress(prev => ({
          ...prev,
          progressPercentage: (testProgress.correctCount / testProgress.requiredCorrect) * 100,
          eta: `${testProgress.requiredCorrect - testProgress.correctCount} questions remaining`,
          capabilities: [
            `Enhanced Training: ${testProgress.correctCount}/${testProgress.requiredCorrect} correct`,
            `Personality: ${testProgress.personalityDeveloped?.toFixed(0)}% developed`,
            `Facts learned: ${testProgress.factsLearned}`,
            `Smart inferences: ${testProgress.inferencesMade}`
          ]
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
          response: "🧠 Enhanced training system ready! Type 'start training' to begin contextual learning.",
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
    
    const personalityProfile = enhancedTraining.getPersonalityProfile();
    const knownFacts = enhancedTraining.getKnownFacts();
    
    setCommands(prev => [...prev, {
      command: '',
      response: `🎉 ENHANCED TRAINING COMPLETE! 

🧠 Personality Profile Developed:
• Communication: ${personalityProfile.formality > 0.3 ? 'Formal' : personalityProfile.formality < -0.3 ? 'Casual' : 'Balanced'}
• Response Style: ${personalityProfile.directness > 0.3 ? 'Direct' : personalityProfile.directness < -0.3 ? 'Detailed' : 'Moderate'}
• Humor: ${personalityProfile.humor > 0.3 ? 'Enjoys humor' : personalityProfile.humor < -0.3 ? 'Serious' : 'Neutral'}
• Tech Level: ${personalityProfile.techLevel > 0.3 ? 'Technical' : personalityProfile.techLevel < -0.3 ? 'Simple' : 'Mixed'}

📚 Facts Learned: ${knownFacts.length} preferences and patterns

🔓 Natural conversation mode is now UNLOCKED with your personalized profile!

I can now talk to you naturally with social media speech, conduct real research,
and adapt to your specific communication preferences. Let's chat! 💯`,
      timestamp: new Date()
    }]);

    // Update system status
    const status = machineGod.getSystemStatus();
    onSystemStatusChange(status);
  };

  const handleUserInput = async (input: string) => {
    if (!input.trim()) return;

    const timestamp = new Date();
    
    // Initialize all variables at the top of the function with default values
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
          response = "🧠 Starting enhanced training with contextual reasoning! The training interface will guide you through adaptive learning.";
        } else if (input.toLowerCase() === 'help') {
          response = `
🧠 ENHANCED TRAINING MODE HELP

You're in enhanced training mode with contextual reasoning capabilities.

Commands available:
• start training - Begin the enhanced 25-question test
• training progress - Check your current progress and personality development
• help - Show this help message

The enhanced training features:
🎯 Smart question skipping - Won't ask what it can already infer
🧠 Contextual guessing - Makes educated guesses based on your previous answers
📚 Deep learning - When you say "no", it asks why and learns from explanations
👤 Personality profiling - Builds a comprehensive profile of your preferences
🔄 Adaptive reasoning - Gets smarter as it learns more about you

This creates a truly personalized AI that understands your unique communication style! 🚀
`;
        } else if (input.toLowerCase().includes('training progress') || input.toLowerCase().includes('progress')) {
          const testProgress = enhancedTraining.getTrainingProgress();
          const personalityProfile = enhancedTraining.getPersonalityProfile();
          response = `
🧠 Enhanced Training Progress:

✅ Correct Answers: ${testProgress.correctCount} / ${testProgress.requiredCorrect}
📝 Total Attempts: ${testProgress.totalAttempts}
🎯 Remaining: ${testProgress.requiredCorrect - testProgress.correctCount} questions
📈 Progress: ${((testProgress.correctCount / testProgress.requiredCorrect) * 100).toFixed(1)}%

👤 Personality Development: ${testProgress.personalityDeveloped?.toFixed(0)}%
📚 Facts Learned: ${testProgress.factsLearned} preferences
🧠 Smart Inferences: ${testProgress.inferencesMade} contextual guesses

Current Personality Profile:
• Formality: ${personalityProfile.formality > 0.3 ? 'Formal' : personalityProfile.formality < -0.3 ? 'Casual' : 'Developing...'}
• Style: ${personalityProfile.directness > 0.3 ? 'Direct' : personalityProfile.directness < -0.3 ? 'Detailed' : 'Learning...'}
• Humor: ${personalityProfile.humor > 0.3 ? 'Enjoys humor' : personalityProfile.humor < -0.3 ? 'Serious' : 'Neutral'}

${testProgress.sessionActive ? 
  '🔥 Training session active! Continue in the training interface.' :
  '💤 No active training session. Type "start training" to begin!'
}

${testProgress.isComplete ? 
  '🎉 Training complete! Natural conversation unlocked!' :
  'Keep going! The system gets smarter with each answer you provide.'
}
`;
        } else {
          response = `🔒 Natural conversation is locked until you complete the enhanced training.\n\nType 'start training' to begin the adaptive learning system, or 'help' for more information.\n\nThis enhanced training builds a personalized profile and learns your preferences! 🧠`;
        }
      } else {
        // Training complete - normal conversation mode with personality
        setConversationContext(prev => [...prev.slice(-5), input]);

        // Handle system commands
        if (input.toLowerCase() === 'help') {
          response = `
Yo! Here's what I can help with now that enhanced training is complete! 🔥

💬 PERSONALIZED CONVERSATION:
  I now know your communication style and preferences from our training!
  Talk to me naturally - I'll adapt to your personality profile.

🧠 ENHANCED CAPABILITIES:
  • 6-tier logic storage system
  • Social media speech (256MB reference)
  • Real-time web research
  • Contextual reasoning from your training
  • Personalized response style

🎯 YOUR PERSONALITY PROFILE:
  I remember your preferences and adapt my responses accordingly!

📊 REASONING BENCHMARKS:
  benchmark [test] - Run various reasoning tests

🔍 SYSTEM AUDITING:
  audit system - Run comprehensive system audit

👍👎 FEEDBACK SYSTEM:
  I continue learning from your feedback to improve!

Just talk to me naturally - I know your style now, bestie! 💯
`;
        } else {
          // Process through full system with personality awareness
          const result = await machineGod.processConversation(input, conversationContext);
          
          // Apply social media speech processing with personality
          const personalityProfile = enhancedTraining.getPersonalityProfile();
          let socialResponse = socialMediaProcessor.makeSocialMediaStyle(result.response, input);
          
          // Adjust response based on learned personality
          if (personalityProfile.formality > 0.3) {
            // More formal style
            socialResponse = socialResponse.replace(/\b(gonna|wanna|gotta)\b/g, (match) => {
              return match === 'gonna' ? 'going to' : match === 'wanna' ? 'want to' : 'have to';
            });
          } else if (personalityProfile.formality < -0.3) {
            // More casual style - keep all the slang
          }
          
          if (personalityProfile.humor < -0.3) {
            // Remove humor for serious users
            socialResponse = socialResponse.replace(/\b(lol|lmao|😂|🤣)\b/g, '');
          }
          
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
              {trainingComplete ? '🧠 Enhanced AI + 🗣️ Personalized Speech' : '🧠 Enhanced Training Mode'}
            </span>
            <span className="text-cyan-300">
              {trainingComplete ? `Learning: ${trainingProgress.generation}` : 'Contextual Learning'}
            </span>
            <span className="text-green-300">{trainingProgress.progressPercentage.toFixed(1)}%</span>
            <span className="text-yellow-300">ETA: {trainingProgress.eta}</span>
            <span className="text-pink-300">
              {trainingComplete ? '🎯 Personalized' : '🔒 Locked'}
            </span>
          </div>
          <div className="bg-gray-700 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-1000 ${
                trainingComplete 
                  ? 'bg-gradient-to-r from-purple-500 via-blue-500 to-green-500'
                  : 'bg-gradient-to-r from-orange-500 to-purple-500'
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
                  <div className="ml-2 mt-1 text-orange-400 text-xs flex items-center">
                    <span>🧠 Enhanced training mode - building your personality profile</span>
                  </div>
                )}
                
                {/* Personalized processing indicator */}
                {cmd.socialMediaProcessed && trainingComplete && (
                  <div className="ml-2 mt-1 text-pink-400 text-xs flex items-center">
                    <span>🎯 Personalized response based on your training profile</span>
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
                    <span>🧠 Enhanced structured reasoning applied</span>
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
                    ✓ Thanks for the feedback! I'm learning your preferences! 🙏
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="text-yellow-400 ml-2 flex items-center">
                <span className="animate-pulse">
                  {trainingComplete 
                    ? '💬 Thinking with your personalized profile...' 
                    : '🧠 Processing enhanced training command...'
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
                  ? "Ask me anything - I know your style now and will respond personally! 🎯"
                  : "Type 'start training' to begin enhanced contextual learning..."
              }
              disabled={isLoading || !isInitialized}
              autoFocus
            />
            <span className="text-green-400 animate-pulse ml-2 flex-shrink-0">█</span>
          </div>
        </div>
      </div>

      {/* Enhanced Training Interface */}
      <EnhancedTrainingInterface
        isVisible={showTrainingTest}
        onTrainingComplete={handleTrainingComplete}
      />
    </>
  );
};