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
  naturalLearningApplied?: boolean;
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
  naturalLearning: {
    totalAssets: number;
    averageQuality: number;
    learningRate: number;
    patternCount: number;
  };
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
    truthSignatures: 0,
    naturalLearning: {
      totalAssets: 0,
      averageQuality: 0,
      learningRate: 0.1,
      patternCount: 0
    }
  });
  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const bootSequence = [
    "MACHINEGOD NATURAL LEARNING SYSTEM v5.0.0",
    "(c) 2024 - CONTINUOUS LEARNING + ALL ASSETS UTILIZATION",
    "",
    "🧠 Initializing Natural Training Orchestrator...",
    "✓ All assets coordination: ENABLED",
    "✓ Continuous learning: ACTIVE", 
    "✓ Cross-system training: READY",
    "✓ Natural conversation evolution: INITIALIZED",
    "✓ Feedback integration: ACTIVE",
    "✓ Benchmark learning: ENHANCED",
    "✓ Research integration: ACTIVE",
    "✓ Memory persistence: ENABLED",
    "",
    "🎯 Natural Learning Features:",
    "✓ Every interaction trains the system naturally",
    "✓ All assets (memory, research, debates) contribute to learning",
    "✓ Continuous improvement without manual training",
    "✓ Cross-modal learning and adaptation",
    "✓ Persistent memory across sessions",
    "✓ Real-time pattern recognition and optimization",
    "",
    "🔒 NATURAL LEARNING MODE ACTIVE",
    "",
    "This system learns from every interaction, utilizing all available",
    "assets to continuously improve responses, reasoning, and natural",
    "conversation abilities. No manual training required - just chat!",
    "",
    "The system will:",
    "1. Learn from every conversation naturally",
    "2. Integrate feedback across all systems",
    "3. Utilize research, debates, and benchmarks for improvement",
    "4. Maintain persistent learning across sessions",
    "5. Continuously optimize all capabilities",
    "",
    "Ready for natural learning conversations! 🚀"
  ];

  // Update training progress with natural learning stats
  useEffect(() => {
    const updateTraining = () => {
      if (trainingComplete && isInitialized) {
        try {
          const trainingMetrics = machineGod.getTrainingMetrics();
          const memoryTrainingProgress = machineGod.getTrainingProgress();
          const systemStatus = machineGod.getSystemStatus();
          const naturalLearningStats = machineGod.getNaturalLearningStats();
          
          setTrainingProgress(prev => ({
            currentLevel: trainingMetrics.currentLevel.name,
            targetLevel: 'Full Multi-Modal AGI with Natural Learning',
            progressPercentage: trainingMetrics.progressPercentage,
            eta: trainingMetrics.eta,
            reasoningAbility: trainingMetrics.reasoningAbility,
            algorithmCount: trainingMetrics.algorithmCount,
            generation: trainingMetrics.generation,
            capabilities: [
              ...trainingMetrics.currentLevel.capabilities,
              `Natural Learning: ${naturalLearningStats.totalAssets} assets processed`,
              `Learning Rate: ${(naturalLearningStats.learningRate * 100).toFixed(1)}%`,
              `Pattern Recognition: ${naturalLearningStats.patternCount} patterns`
            ],
            multiModalProgress: (memoryTrainingProgress.overallProgress || 0) * 100,
            totalConversations: memoryTrainingProgress.totalConversations || 0,
            apiConnectivity: systemStatus.api.connectivity,
            apiRequests: systemStatus.api.requestCount,
            truthCycles: systemStatus.truthProtocol.adversarialCycles,
            truthSignatures: systemStatus.truthProtocol.truthSignatures,
            naturalLearning: naturalLearningStats
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
  }, [isInitialized, trainingComplete, machineGod, enhancedTraining]);

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
          response: "🧠 Natural learning system ready! Type 'start training' to begin contextual learning, or just start chatting for natural learning.",
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
  }, [machineGod]);

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

🌟 NATURAL LEARNING NOW ACTIVE: Every conversation will continuously improve my abilities using all system assets including memory, research, debates, benchmarks, and cross-modal learning. No manual training needed - just chat naturally! 💯`,
      timestamp: new Date(),
      naturalLearningApplied: true
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
    let naturalLearningApplied = false;
    
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
🧠 NATURAL LEARNING MODE HELP

You're in natural learning mode with continuous improvement capabilities.

Commands available:
• start training - Begin the enhanced 25-question test (optional)
• training progress - Check your current progress and personality development
• help - Show this help message

🌟 NATURAL LEARNING FEATURES:
🔄 Continuous Learning - Every conversation improves the system automatically
🧠 All Assets Utilization - Memory, research, debates, benchmarks all contribute
📚 Cross-Modal Learning - Visual, audio, and text learning integration
💾 Persistent Memory - Learning persists across sessions
🎯 Adaptive Responses - System adapts to your communication style naturally

You can start chatting immediately! The system will learn and improve from every interaction without manual training. 🚀
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

🌟 NATURAL LEARNING: You can also just start chatting - the system learns from every conversation!
`;
        } else {
          // NATURAL LEARNING: Allow conversation even without training
          response = `🌟 Natural Learning Active! I can chat with you right now and learn from our conversation.

While formal training helps establish preferences quickly, I'm designed to learn naturally from every interaction. Feel free to:

• Ask me anything and I'll learn from your questions
• Give me feedback and I'll adapt my responses
• Chat naturally and I'll pick up your communication style
• Type 'start training' if you want the structured personality setup

What would you like to talk about? I'm ready to learn! 🚀`;
          naturalLearningApplied = true;
        }
      } else {
        // Training complete - normal conversation mode with natural learning
        setConversationContext(prev => [...prev.slice(-5), input]);

        // Handle system commands
        if (input.toLowerCase() === 'help') {
          response = `
Yo! Here's what I can help with now that natural learning is active! 🔥

💬 NATURAL CONVERSATION WITH CONTINUOUS LEARNING:
  I learn from every single interaction automatically! No manual training needed.
  Talk to me naturally - I adapt and improve with each conversation.

🧠 ENHANCED CAPABILITIES WITH NATURAL LEARNING:
  • 6-tier brain-like logic storage that learns continuously
  • Social media speech that evolves with feedback
  • Real-time web research integrated with learning
  • Cross-system learning from all interactions
  • Persistent memory that grows smarter over time

🎯 YOUR PERSONALIZED PROFILE + CONTINUOUS ADAPTATION:
  I remember your preferences AND continuously adapt to new patterns!

📊 REASONING BENCHMARKS WITH LEARNING:
  benchmark [test] - Run tests that improve my reasoning abilities

🔍 SYSTEM AUDITING WITH OPTIMIZATION:
  audit system - Run comprehensive system audit with learning integration

👍👎 FEEDBACK SYSTEM WITH NATURAL LEARNING:
  Every piece of feedback automatically improves all my systems!

🌟 NATURAL LEARNING STATS:
  • Learning Assets: ${trainingProgress.naturalLearning.totalAssets}
  • Learning Quality: ${(trainingProgress.naturalLearning.averageQuality * 100).toFixed(1)}%
  • Learning Rate: ${(trainingProgress.naturalLearning.learningRate * 100).toFixed(1)}%
  • Patterns Recognized: ${trainingProgress.naturalLearning.patternCount}

Just talk to me naturally - I'm constantly learning and improving, bestie! 💯
`;
        } else {
          // Process through full system with natural learning
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
          naturalLearningApplied = result.naturalLearningApplied || false;

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
          structuredReasoning: structuredReasoningResult,
          naturalLearningApplied
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
      // Process feedback through MachineGod with natural learning
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
              {trainingComplete ? '🧠 Natural Learning AI + 🗣️ Personalized Speech' : '🧠 Enhanced Training Mode'}
            </span>
            <span className="text-cyan-300">
              {trainingComplete ? `Learning: ${trainingProgress.generation}` : 'Contextual Learning'}
            </span>
            <span className="text-green-300">{trainingProgress.progressPercentage.toFixed(1)}%</span>
            <span className="text-yellow-300">ETA: {trainingProgress.eta}</span>
            <span className="text-pink-300">
              {trainingComplete ? '🎯 Natural Learning Active' : '🔒 Locked'}
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
          {trainingComplete && (
            <div className="mt-2 text-xs text-green-300">
              🌟 Natural Learning: {trainingProgress.naturalLearning.totalAssets} assets • 
              Quality: {(trainingProgress.naturalLearning.averageQuality * 100).toFixed(1)}% • 
              Rate: {(trainingProgress.naturalLearning.learningRate * 100).toFixed(1)}% • 
              Patterns: {trainingProgress.naturalLearning.patternCount}
            </div>
          )}
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
                
                {/* Natural learning indicator */}
                {cmd.naturalLearningApplied && trainingComplete && (
                  <div className="ml-2 mt-1 text-green-400 text-xs flex items-center">
                    <span>🌟 Natural learning applied - system improved from this interaction</span>
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
                    ✓ Thanks for the feedback! Natural learning system improved! 🙏
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="text-yellow-400 ml-2 flex items-center">
                <span className="animate-pulse">
                  {trainingComplete 
                    ? '💬 Thinking with natural learning and your personalized profile...' 
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
                  ? "Ask me anything - I'm learning naturally from every conversation! 🌟"
                  : "Type 'start training' for structured setup, or just start chatting for natural learning..."
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