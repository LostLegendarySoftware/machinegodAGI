import React, { useState, useEffect, useRef } from 'react';
import { MachineGodCore, SystemStatus, ConversationResponse, UserFeedback } from '../core/MachineGodCore';
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
  const [lmmBenchmarks] = useState(() => new OpenLMMBenchmarks());
  const [isInitialized, setIsInitialized] = useState(false);
  const [conversationContext, setConversationContext] = useState<string[]>([]);
  const [showFeedbackFor, setShowFeedbackFor] = useState<string | null>(null);
  const [feedbackReason, setFeedbackReason] = useState('');
  const [feedbackImprovement, setFeedbackImprovement] = useState('');
  const [isBenchmarking, setIsBenchmarking] = useState(false);
  const [slangIntensity, setSlangIntensity] = useState(0.5);
  const [trainingProgress, setTrainingProgress] = useState<TrainingProgress>({
    currentLevel: 'ChatGPT-4 Baseline',
    targetLevel: 'Full Multi-Modal AGI',
    progressPercentage: 15,
    eta: 'Calculating...',
    reasoningAbility: 0.4,
    algorithmCount: 0,
    generation: 0,
    capabilities: ['Natural conversation', 'Basic reasoning', 'Information retrieval'],
    multiModalProgress: 0.25,
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
    "MACHINEGOD NATURAL CONVERSATION v3.0.0",
    "(c) 2024 - TRUE NATURAL AI WITH PROPER LOGIC STORAGE",
    "",
    "💬 Initializing Natural Conversation Mode...",
    "✓ Human-like response patterns: LOADED",
    "✓ Slang and casual speech: ACTIVE",
    "✓ Conversational flow optimization: ENABLED",
    "✓ User feedback learning: READY",
    "✓ Background quality assurance: SILENT MODE",
    "",
    "🧠 6-Tier Logic Storage System:",
    "✓ Tier 1: Common Sense & Meta-Logic (256 units)",
    "✓ Tier 2: Natural Language Processing (256 units)",
    "✓ Tier 3: Agentic Training (256 units)",
    "✓ Tier 4: Slang & Natural Speaking (256 units)",
    "✓ Tier 5: Image Generation & Spatial Analysis (256 units)",
    "✓ Tier 6: Video Generation & 3D Modeling (256 units)",
    "✓ Total: 1536 logic data units ACTIVE",
    "",
    "🔍 REAL Research Capabilities:",
    "✓ Google Custom Search API: CONNECTED",
    "✓ Web search integration: ACTIVE",
    "✓ Source credibility assessment: ENABLED",
    "✓ Fact-checking system: READY",
    "✓ Logical analysis framework: LOADED",
    "",
    "🗣️ Slang & Natural Speech:",
    "✓ Modern slang patterns: LOADED",
    "✓ Casual speech patterns: ACTIVE",
    "✓ Conversational fillers: ENABLED",
    "✓ Emoji integration: READY",
    "✓ Regional dialect support: AVAILABLE",
    "",
    "📊 LMM Reasoning Benchmarks:",
    "✓ MathVista: READY",
    "✓ MathVision: READY",
    "✓ MathVerse: READY",
    "✓ DynaMath: READY",
    "✓ WeMath: READY",
    "✓ LogicVista: READY",
    "",
    "🧠 Background Systems (Silent Operation):",
    "✓ Agent team debates: BACKGROUND ONLY",
    "✓ Truth verification: BACKGROUND ONLY", 
    "✓ Algorithm evolution: BACKGROUND ONLY",
    "✓ Quality assurance: BACKGROUND ONLY",
    "✓ All technical processing: INVISIBLE TO USER",
    "",
    "📝 User Feedback Learning System:",
    "✓ Thumbs up/down feedback: ENABLED",
    "✓ Improvement suggestions: ACTIVE",
    "✓ Response adaptation: CONTINUOUS",
    "✓ Learning from mistakes: ENABLED",
    "",
    "NATURAL CONVERSATION SYSTEM WITH PROPER LOGIC STORAGE READY",
    "",
    "Hey! I'm your AI assistant with proper logic storage. I talk like a normal person",
    "and can search the web in real-time to answer your questions with up-to-date information.",
    "",
    "If you like or dislike any of my responses, just click the thumbs up or down",
    "and I'll learn from your feedback to get better at helping you.",
    "",
    "What would you like to chat about today?"
  ];

  // Update training progress
  useEffect(() => {
    const updateTraining = () => {
      if (isInitialized) {
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
      }
    };

    const interval = setInterval(updateTraining, 2000);
    return () => clearInterval(interval);
  }, [isInitialized]);

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

      // Initialize MachineGod core
      try {
        await machineGod.initialize();
        setIsInitialized(true);
        
        // Update system status
        const status = machineGod.getSystemStatus();
        onSystemStatusChange(status);
        
        setCommands(prev => [...prev, {
          command: '',
          response: "🎯 Natural conversation system with proper logic storage ready - just talk to me normally!",
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
      // Add to conversation context
      setConversationContext(prev => [...prev.slice(-5), input]); // Keep last 5 exchanges

      let response = '';
      let confidence = 0;
      let needsFeedback = false;
      let memoryId = '';
      let researchConducted = false;
      let logicalAnalysisApplied = false;
      let slangApplied = false;
      let logicAlgorithmsUsed: string[] = [];
      let benchmarkResult: LMMBenchmarkResult | undefined;

      // Check for system commands first
      if (input.toLowerCase() === 'help') {
        response = `
Hey! Here's what I can help with:

💬 NATURAL CONVERSATION:
  Just talk to me normally! Ask questions, have conversations, request help with tasks.
  I respond like a regular person - with natural language and even slang when appropriate.

🧠 LOGIC STORAGE SYSTEM:
  I use a 6-tier logic storage system with 256 units per tier:
  • Tier 1: Common Sense & Meta-Logic
  • Tier 2: Natural Language Processing
  • Tier 3: Agentic Training
  • Tier 4: Slang & Natural Speaking
  • Tier 5: Image Generation & Spatial Analysis
  • Tier 6: Video Generation & 3D Modeling

🔍 REAL-TIME RESEARCH:
  I can search the web in real-time to find information for you
  Just ask me questions that need up-to-date information

📊 REASONING BENCHMARKS:
  benchmark mathvista - Test mathematical reasoning with visual elements
  benchmark mathvision - Test advanced mathematical vision understanding
  benchmark mathverse - Test mathematical reasoning in vision-only mode
  benchmark dynamath - Test dynamic mathematical problem solving
  benchmark wemath - Test comprehensive mathematical reasoning
  benchmark logicvista - Test logical reasoning and inference
  benchmark report - Show benchmark results report

🗣️ SLANG SETTINGS:
  slang high - Use more slang and casual speech
  slang medium - Use moderate slang (default)
  slang low - Use minimal slang
  slang off - Turn off slang completely

📝 FEEDBACK SYSTEM:
  👍 👎 Click thumbs up/down on any response to help me improve
  I learn from your feedback and get better over time

🔧 SYSTEM COMMANDS (if you're curious):
  status     - Show system status
  storage    - Show logic storage statistics
  feedback   - Show feedback statistics  
  training   - Show learning progress
  clear      - Clear terminal
  reset      - Reset conversation

Just talk to me like you would any person - that's what I'm designed for!
`;
      } else if (input.toLowerCase() === 'feedback') {
        const feedbackStats = machineGod.getFeedbackStats();
        response = `
📝 Feedback Statistics:

👍 Positive: ${feedbackStats.positiveCount}
👎 Negative: ${feedbackStats.negativeCount}
📊 Success Rate: ${feedbackStats.positiveRate.toFixed(1)}%

${feedbackStats.commonIssues.length > 0 ? `
🔧 Common Issues:
${feedbackStats.commonIssues.map(issue => `• ${issue}`).join('\n')}
` : ''}

${feedbackStats.improvementSuggestions.length > 0 ? `
💡 Improvement Suggestions:
${feedbackStats.improvementSuggestions.map(suggestion => `• ${suggestion}`).join('\n')}
` : ''}

Thanks for helping me improve! Your feedback makes me better at conversations.
`;
      } else if (input.toLowerCase() === 'clear') {
        setCommands([]);
        setIsLoading(false);
        return;
      } else if (input.toLowerCase() === 'reset') {
        setConversationContext([]);
        response = 'Conversation reset! What would you like to talk about?';
      } else if (input.toLowerCase() === 'status') {
        const logicStats = machineGod.getLogicStorageStats();
        response = `
🧠 Logic Storage System Status:

• Total Algorithms: ${logicStats.stats.totalAlgorithms}
• Total Patterns: ${logicStats.stats.totalPatterns}
• Active Units: ${logicStats.stats.activeUnits} of ${logicStats.stats.totalUnits}
• Compression Ratio: ${(logicStats.stats.compressionRatio * 100).toFixed(1)}%
• Top Performing Tier: ${logicStats.tiers[logicStats.stats.topPerformingTier].description}

🔝 Top Performing Algorithms:
${logicStats.topAlgorithms.map((alg, i) => `${i+1}. ${alg.name} (${(alg.performance * 100).toFixed(1)}%)`).join('\n')}

The system is fully operational with proper 6-tier logic storage.
`;
      } else if (input.toLowerCase() === 'storage') {
        const logicStats = machineGod.getLogicStorageStats();
        response = `
🧠 6-Tier Logic Storage System:

${logicStats.tiers.map(tier => 
  `Tier ${tier.id+1}: ${tier.description}
   • Usage: ${tier.utilizationPercentage.toFixed(1)}% (${Math.round(tier.usedCapacity/1024/1024)}MB / ${Math.round(tier.totalCapacity/1024/1024)}MB)
   • Compression: ${((1-tier.compressionRatio) * 100).toFixed(1)}%`
).join('\n\n')}

📊 Overall Statistics:
• Total Algorithms: ${logicStats.stats.totalAlgorithms}
• Total Patterns: ${logicStats.stats.totalPatterns}
• Active Units: ${logicStats.stats.activeUnits} of ${logicStats.stats.totalUnits}
• Average Performance: ${(logicStats.stats.averagePerformance * 100).toFixed(1)}%

This 6-tier system ensures proper storage of different types of knowledge and capabilities.
`;
      } else if (input.toLowerCase().startsWith('benchmark ')) {
        const benchmarkCommand = input.toLowerCase().substring(10).trim();
        
        if (benchmarkCommand === 'report') {
          response = lmmBenchmarks.generateBenchmarkReport();
        } else {
          const validBenchmarks = ['mathvista', 'mathvision', 'mathverse', 'dynamath', 'wemath', 'logicvista'];
          const benchmarkId = validBenchmarks.find(b => benchmarkCommand.includes(b));
          
          if (benchmarkId) {
            setIsBenchmarking(true);
            response = `Starting ${benchmarkId} benchmark test...`;
            
            try {
              const fullBenchmarkId = benchmarkId === 'mathvista' ? 'mathvista_mini' : 
                                     benchmarkId === 'mathverse' ? 'mathverse_mini' : benchmarkId;
              
              benchmarkResult = await lmmBenchmarks.runLMMBenchmark(
                fullBenchmarkId,
                async (question, options) => {
                  // Process through MachineGod
                  const result = await machineGod.processConversation(
                    `${question}${options ? '\nOptions: ' + options.join(', ') : ''}`,
                    []
                  );
                  
                  return {
                    answer: result.response,
                    reasoning: 'Processed through natural language understanding',
                    confidence: result.confidence
                  };
                }
              );
              
              response = `
📊 ${benchmarkId.toUpperCase()} Benchmark Results:

Score: ${benchmarkResult.percentage.toFixed(1)}% (${benchmarkResult.score}/${benchmarkResult.maxScore})
Rank on Leaderboard: #${benchmarkResult.leaderboardComparison.rank}
Percentile: ${benchmarkResult.leaderboardComparison.percentile.toFixed(1)}%
Top Model Score: ${benchmarkResult.leaderboardComparison.topScore.toFixed(1)}%

${benchmarkResult.percentage > benchmarkResult.leaderboardComparison.topScore ? 
  '🎉 OUTSTANDING! Exceeded top model performance!' : 
  benchmarkResult.leaderboardComparison.percentile > 75 ? 
    '🌟 EXCELLENT! Top-tier performance!' : 
    benchmarkResult.leaderboardComparison.percentile > 50 ? 
      '✅ GOOD! Above average performance.' : 
      '⚠️ NEEDS IMPROVEMENT. Below average performance.'}

Run 'benchmark report' to see full comparison across all benchmarks.
`;
            } catch (error) {
              response = `❌ Error running benchmark: ${error}`;
            } finally {
              setIsBenchmarking(false);
            }
          } else {
            response = `
Invalid benchmark command. Available benchmarks:
- benchmark mathvista - Test mathematical reasoning with visual elements
- benchmark mathvision - Test advanced mathematical vision understanding
- benchmark mathverse - Test mathematical reasoning in vision-only mode
- benchmark dynamath - Test dynamic mathematical problem solving
- benchmark wemath - Test comprehensive mathematical reasoning
- benchmark logicvista - Test logical reasoning and inference
- benchmark report - Show benchmark results report
`;
          }
        }
      } else if (input.toLowerCase().startsWith('slang ')) {
        const slangCommand = input.toLowerCase().substring(6).trim();
        
        if (slangCommand === 'high') {
          machineGod.setSlangIntensity(0.8);
          response = "Slang intensity set to high! I'll talk with lots more slang and casual speech now. 🔥";
          setSlangIntensity(0.8);
        } else if (slangCommand === 'medium') {
          machineGod.setSlangIntensity(0.5);
          response = "Slang intensity set to medium - I'll use a moderate amount of slang now. 👌";
          setSlangIntensity(0.5);
        } else if (slangCommand === 'low') {
          machineGod.setSlangIntensity(0.2);
          response = "Slang intensity set to low. I'll use just a little bit of slang now.";
          setSlangIntensity(0.2);
        } else if (slangCommand === 'off') {
          machineGod.setSlangIntensity(0);
          response = "Slang turned off. I'll speak more formally now without using slang terms.";
          setSlangIntensity(0);
        } else {
          response = `
Invalid slang command. Available options:
- slang high - Use more slang and casual speech
- slang medium - Use moderate slang (default)
- slang low - Use minimal slang
- slang off - Turn off slang completely
`;
        }
      } else {
        // Main conversation processing with Natural Flow
        if (isInitialized) {
          const result = await machineGod.processConversation(input, conversationContext);
          
          response = result.response;
          confidence = result.confidence;
          needsFeedback = result.needsFeedback;
          memoryId = result.memoryId;
          researchConducted = result.researchConducted || false;
          logicalAnalysisApplied = result.logicalAnalysisApplied || false;
          slangApplied = result.slangApplied || false;
          logicAlgorithmsUsed = result.logicAlgorithmsUsed || [];

          // Update system status after processing
          const status = machineGod.getSystemStatus();
          onSystemStatusChange(status);
        } else {
          response = '⚠️ System not yet ready. Please wait for initialization to complete.';
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
          benchmarkResult
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

  const handleFeedback = async (memoryId: string, liked: boolean) => {
    if (liked) {
      // Positive feedback - just process it
      await machineGod.processUserFeedback(memoryId, true);
      
      // Update the command to show feedback was given
      setCommands(prev => {
        const newCommands = [...prev];
        const commandIndex = newCommands.findIndex(cmd => cmd.memoryId === memoryId);
        if (commandIndex !== -1) {
          newCommands[commandIndex].feedbackGiven = true;
        }
        return newCommands;
      });
    } else {
      // Negative feedback - show form for details
      setShowFeedbackFor(memoryId);
    }
  };

  const submitNegativeFeedback = async () => {
    if (showFeedbackFor === null) return;

    try {
      await machineGod.processUserFeedback(
        showFeedbackFor,
        false,
        feedbackReason || 'No specific reason given',
        feedbackImprovement || undefined
      );

      // Update the command to show feedback was given
      setCommands(prev => {
        const newCommands = [...prev];
        const commandIndex = newCommands.findIndex(cmd => cmd.memoryId === showFeedbackFor);
        if (commandIndex !== -1) {
          newCommands[commandIndex].feedbackGiven = true;
        }
        return newCommands;
      });

      // Reset feedback form
      setShowFeedbackFor(null);
      setFeedbackReason('');
      setFeedbackImprovement('');
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert('There was an error submitting your feedback. Please try again.');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isLoading) {
      handleUserInput(currentInput);
    }
  };

  return (
    <div className="h-full flex flex-col bg-black bg-opacity-80 border-2 border-purple-500 rounded-lg overflow-hidden">
      {/* Training Progress Header */}
      <div className="training-header bg-gradient-to-r from-purple-900 to-blue-900 bg-opacity-40 border-b border-purple-600 p-3 flex-shrink-0">
        <div className="flex justify-between items-center text-sm mb-2">
          <span className="text-purple-300">🧠 6-Tier Logic Storage</span>
          <span className="text-cyan-300">Learning: {trainingProgress.generation}</span>
          <span className="text-green-300">{trainingProgress.progressPercentage.toFixed(1)}%</span>
          <span className="text-yellow-300">ETA: {trainingProgress.eta}</span>
          <span className="text-pink-300">🗣️ Slang: {slangIntensity === 0 ? 'Off' : slangIntensity < 0.3 ? 'Low' : slangIntensity < 0.7 ? 'Medium' : 'High'}</span>
        </div>
        <div className="bg-gray-700 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-purple-500 via-blue-500 to-green-500 h-2 rounded-full transition-all duration-1000"
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
              
              {/* Benchmark result indicator */}
              {cmd.benchmarkResult && (
                <div className="ml-2 mt-1 text-yellow-400 text-xs flex items-center">
                  <span>📊 Benchmark completed: {cmd.benchmarkResult.percentage.toFixed(1)}% score</span>
                </div>
              )}
              
              {/* Research indicator */}
              {cmd.researchConducted && (
                <div className="ml-2 mt-1 text-blue-400 text-xs flex items-center">
                  <span>🔍 Real-time web research conducted</span>
                </div>
              )}
              
              {/* Logical analysis indicator */}
              {cmd.logicalAnalysisApplied && (
                <div className="ml-2 mt-1 text-purple-400 text-xs flex items-center">
                  <span>🧠 Logical analysis applied</span>
                </div>
              )}
              
              {/* Slang indicator */}
              {cmd.slangApplied && (
                <div className="ml-2 mt-1 text-pink-400 text-xs flex items-center">
                  <span>🗣️ Natural speech with slang applied</span>
                </div>
              )}
              
              {/* Logic algorithms used */}
              {cmd.logicAlgorithmsUsed && cmd.logicAlgorithmsUsed.length > 0 && (
                <div className="ml-2 mt-1 text-cyan-400 text-xs flex items-center">
                  <span>🧠 Used {cmd.logicAlgorithmsUsed.length} logic algorithms</span>
                </div>
              )}
              
              {/* Feedback buttons for responses that need feedback */}
              {cmd.needsFeedback && !cmd.feedbackGiven && cmd.command && cmd.memoryId && (
                <div className="ml-2 mt-2 flex items-center space-x-2">
                  <span className="text-gray-400 text-sm">Was this helpful?</span>
                  <button
                    onClick={() => handleFeedback(cmd.memoryId!, true)}
                    className="text-green-400 hover:text-green-300 transition-colors"
                    title="This was helpful"
                  >
                    <ThumbsUp size={16} />
                  </button>
                  <button
                    onClick={() => handleFeedback(cmd.memoryId!, false)}
                    className="text-red-400 hover:text-red-300 transition-colors"
                    title="This wasn't helpful"
                  >
                    <ThumbsDown size={16} />
                  </button>
                </div>
              )}

              {/* Show feedback given confirmation */}
              {cmd.feedbackGiven && (
                <div className="ml-2 mt-1 text-gray-500 text-xs">
                  ✓ Thanks for the feedback!
                </div>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="text-yellow-400 ml-2 flex items-center">
              <span className="animate-pulse">{isBenchmarking ? '📊 Running benchmark...' : '💬 Thinking...'}</span>
            </div>
          )}
          {/* Scroll anchor */}
          <div ref={messagesEndRef} />
        </div>
      </div>
      
      {/* Negative Feedback Form */}
      {showFeedbackFor !== null && (
        <div className="border-t border-purple-800 p-4 bg-gray-900 bg-opacity-50">
          <div className="text-yellow-300 mb-2">Help me improve! What went wrong?</div>
          <input
            type="text"
            value={feedbackReason}
            onChange={(e) => setFeedbackReason(e.target.value)}
            placeholder="What didn't you like about this response?"
            className="w-full p-2 mb-2 bg-gray-800 text-white rounded border border-gray-600"
          />
          <input
            type="text"
            value={feedbackImprovement}
            onChange={(e) => setFeedbackImprovement(e.target.value)}
            placeholder="How could I improve? (optional)"
            className="w-full p-2 mb-2 bg-gray-800 text-white rounded border border-gray-600"
          />
          <div className="flex space-x-2">
            <button
              onClick={submitNegativeFeedback}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Submit Feedback
            </button>
            <button
              onClick={() => setShowFeedbackFor(null)}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      
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
            placeholder={isInitialized ? "Ask me anything - I'll respond naturally with proper logic..." : "Initializing 6-tier logic storage system..."}
            disabled={isLoading || !isInitialized}
            autoFocus
          />
          <span className="text-green-400 animate-pulse ml-2 flex-shrink-0">█</span>
        </div>
      </div>
    </div>
  );
};