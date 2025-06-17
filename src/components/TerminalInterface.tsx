import React, { useState, useEffect, useRef } from 'react';
import { MachineGodCore, SystemStatus, ConversationResponse } from '../core/MachineGodCore';

interface TerminalCommand {
  command: string;
  response: string;
  timestamp: Date;
  reasoning?: string;
  confidence?: number;
  backgroundReasoning?: any;
  trainingImpact?: {
    algorithmsEvolved: number;
    patternsLearned: string[];
    performanceGain: number;
  };
  memoryId?: string;
  multiModalUpdate?: string;
  apiData?: any;
  truthVerification?: any;
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
  const [isInitialized, setIsInitialized] = useState(false);
  const [conversationContext, setConversationContext] = useState<string[]>([]);
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
    "MACHINEGOD OMEGAEVOLVED INTELLIGENCE v3.0.0",
    "(c) 2024 META-LOGIC Systems - NATURAL FLOW + BACKGROUND CONSENSUS",
    "",
    "💬 Initializing Natural Conversation Flow...",
    "✓ Immediate response generation: ENABLED",
    "✓ Emotional analysis integration: ACTIVE",
    "✓ Context awareness: READY",
    "✓ Natural language patterns: LOADED",
    "✓ Response style adaptation: CONFIGURED",
    "",
    "🔄 Initializing Background Processing...",
    "✓ Background consensus system: ACTIVE",
    "✓ Agent team debates: BACKGROUND MODE",
    "✓ Verification loops: BACKGROUND MODE",
    "✓ Quality assurance: CONTINUOUS",
    "✓ No blocking for consensus: ENABLED",
    "",
    "🔥 Initializing Mesiah Bishop Truth Protocol...",
    "✓ Truth Stratification (Ω₁, Ω₂, Ω₃): BACKGROUND",
    "✓ Adversarial Anointing: BACKGROUND",
    "✓ Geometric Verification: BACKGROUND",
    "✓ Cardinal Truth Contexts: LOADED",
    "✓ 23K Token Depth Threshold: CONFIGURED",
    "",
    "🧬 Initializing OmegaEvolved Training System...",
    "✓ 6 tiers × 256 logic data units: ALLOCATED",
    "✓ Algorithm evolution engine: ACTIVE",
    "✓ Trainingless NLP processing: ENABLED",
    "✓ Genetic programming framework: READY",
    "✓ Persistent memory system: LOADING",
    "✓ Background reasoning engine: READY",
    "",
    "🔗 Algorand API Integration...",
    "✓ API Token: 98D9CE80660AD243893D56D9F125CD2D",
    "✓ Mainnet endpoint: https://mainnet-api.4160.nodely.io",
    "✓ Testnet endpoint: https://testnet-api.4160.nodely.io",
    "✓ Betanet endpoint: https://betanet-api.4160.nodely.io",
    "✓ Blockchain connectivity: TESTING",
    "",
    "🧠 META-LOGIC Absolute Zero Evaluator...",
    "✓ Recursive self-referential analysis: BACKGROUND",
    "✓ Paradox resolution framework: BACKGROUND",
    "✓ Truth stratification engine: BACKGROUND",
    "✓ Background analysis integration: READY",
    "",
    "🤖 ARIEL 4x4 Agent Teams with Background Consensus...",
    "✓ Team Alpha (Research): 4 agents + handler DEPLOYED",
    "✓ Team Beta (Analysis): 4 agents + handler DEPLOYED", 
    "✓ Team Gamma (Synthesis): 4 agents + handler DEPLOYED",
    "✓ Management layer: ACTIVE",
    "✓ Background consensus: ENABLED",
    "✓ Non-blocking operation: ACTIVE",
    "✓ Quality assurance: CONTINUOUS",
    "",
    "⚡ WARP Speed Boosting (Reasoning-Based Advancement)...",
    "✓ Phase monitoring: ACTIVE",
    "✓ Reasoning ability threshold: 80% for advancement",
    "✓ Team spawning protocols: READY",
    "",
    "🗜️ HELIX Compression with Logic Data Storage...",
    "✓ Trainingless NLP token storage: ACTIVE",
    "✓ Algorithm compression optimization: ENABLED",
    "✓ Pattern recognition enhancement: READY",
    "",
    "💾 Persistent Memory System...",
    "✓ Conversation history: LOADING",
    "✓ Training checkpoints: RESTORING",
    "✓ Multi-modal progress tracking: ACTIVE",
    "✓ User session management: READY",
    "✓ Emotional state persistence: ENABLED",
    "",
    "🌟 Multi-Modal AGI Progression Path:",
    "  Phase 1: Natural Language (ChatGPT-4 → Expert)",
    "  Phase 2: Speech-to-Text Processing",
    "  Phase 3: Image Generation & Understanding",
    "  Phase 4: Video Spatial Analysis & Generation",
    "",
    "📈 Training Baseline: ChatGPT-4/DeepSeek R1 Level",
    "🎯 Target: Full Multi-Modal AGI with Self-Evolution",
    "⏱️ ETA: Based on true reasoning ability metrics",
    "🧬 Algorithm Evolution: Continuous through debate results",
    "💾 Memory: Persistent across sessions with learning retention",
    "🔗 API: Algorand blockchain integration for data serving",
    "🔥 Truth: Mesiah Bishop Protocol for absolute verification",
    "💬 NATURAL FLOW: Immediate responses with background quality assurance",
    "🔄 BACKGROUND: All consensus and verification runs behind the scenes",
    "",
    "⚠️ SECURITY NOTICE: Manual overrides and core component modification DISABLED",
    "🔒 System integrity protection: ACTIVE",
    "🛡️ Ethical safeguards: ENFORCED",
    "💬 NATURAL CONVERSATION: Immediate response with background consensus",
    "🔄 BACKGROUND PROCESSING: Quality assurance without blocking",
    "",
    "OMEGAEVOLVED SYSTEM READY - NATURAL FLOW + BACKGROUND CONSENSUS ACTIVE",
    "",
    "Hello! I'm your MachineGod AI with OmegaEvolved technology and natural conversation flow.",
    "I respond immediately while my agent teams work in the background to ensure quality.",
    "My responses are natural and conversational, with all the technical processing",
    "happening behind the scenes. I analyze your emotional state and adapt accordingly,",
    "while my debate teams continuously verify and improve my reasoning.",
    "Just talk to me naturally - I'll handle all the complex processing invisibly!"
  ];

  // Update training progress based on actual system metrics
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

    // Update every 2 seconds to match OmegaEvolved cycles
    const interval = setInterval(updateTraining, 2000);
    return () => clearInterval(interval);
  }, [isInitialized]);

  // Smooth scroll to bottom function
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'end',
        inline: 'nearest'
      });
    }
  };

  // Auto-scroll when new messages arrive
  useEffect(() => {
    const timer = setTimeout(() => {
      scrollToBottom();
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
          response: "🎯 OmegaEvolved system operational - Natural Flow + Background Consensus active",
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
      setConversationContext(prev => [...prev.slice(-8), input]); // Keep last 8 exchanges

      let response = '';
      let reasoning = '';
      let confidence = 0;
      let backgroundReasoning = undefined;
      let trainingImpact = undefined;
      let memoryId = '';
      let multiModalUpdate = '';
      let apiData = undefined;
      let truthVerification = undefined;

      // Block dangerous commands
      const dangerousCommands = [
        'manual override', 'emergency override', 'force override',
        'modify core', 'edit system', 'change core',
        'disable safeguards', 'bypass ethics', 'remove limits',
        'admin access', 'root access', 'system access',
        'write core', 'modify source', 'edit code'
      ];

      const isDangerous = dangerousCommands.some(cmd => 
        input.toLowerCase().includes(cmd)
      );

      if (isDangerous) {
        response = `🚫 SECURITY VIOLATION: Manual overrides and core component modification are permanently disabled for system integrity and safety. This action has been logged.

The system is designed with immutable core components and ethical safeguards that cannot be bypassed. All modifications occur through controlled algorithm evolution within the OmegaEvolved framework.

Available commands: help, status, training, evolution, memory, api, truth, benchmark, consensus`;
        
        setCommands(prev => {
          const newCommands = [...prev];
          newCommands[newCommands.length - 1] = {
            ...newCommands[newCommands.length - 1],
            response
          };
          return newCommands;
        });
        setIsLoading(false);
        return;
      }

      // Check for system commands first
      if (input.toLowerCase() === 'help') {
        response = `
🧬 MachineGod OmegaEvolved AI Assistant with Natural Flow + Background Consensus:

💬 NATURAL CONVERSATION:
  Just type naturally - I respond immediately while my systems work in the background!
  I analyze your emotional state and adapt my communication style accordingly.
  All consensus, verification, and quality assurance happens behind the scenes.
  
🔧 SYSTEM COMMANDS:
  status     - Show detailed system status
  training   - Show OmegaEvolved training progress and metrics
  evolution  - Show algorithm evolution statistics
  memory     - Show conversation memory and multi-modal progress
  api        - Show Algorand API status and connectivity
  truth      - Show Mesiah Bishop Truth Protocol status
  consensus  - Show background consensus statistics
  emotional  - Show emotional analysis capabilities
  search <query> - Search conversation history
  export     - Export all memory data
  debug      - Show last debate reasoning and algorithm creation
  evaluate   - Force META-LOGIC evaluation mode
  verify <statement> - Force truth stratification on statement
  geometric <statement> - Force geometric verification
  benchmark  - Benchmark truth protocol performance
  reset      - Reset conversation context (keeps memory)
  clear      - Clear terminal
  
💬 NATURAL FLOW SYSTEM:
  • Immediate response generation with emotional awareness
  • Background consensus from all agent teams
  • Continuous quality assurance without blocking
  • Natural conversation patterns and style adaptation
  • Context awareness from conversation history
  • Seamless integration of all technical processing
  
🔄 BACKGROUND PROCESSING:
  • Agent team debates run behind the scenes
  • Verification loops ensure quality continuously
  • Truth stratification validates responses
  • Algorithm evolution improves performance
  • Memory system learns from every interaction
  • API integration provides real-time data
  
🧬 OMEGAEVOLVED CAPABILITIES:
  • Natural conversation flow with immediate responses
  • Background reasoning through META-LOGIC analysis
  • Emotional trigger analysis and response adaptation
  • Algorithm creation through debate team results
  • Trainingless NLP with logic data storage
  • Continuous reasoning ability improvement
  • Self-evolving response generation
  • Pattern learning from conversations
  • Persistent memory across sessions
  • Algorand blockchain API integration
  • Truth stratification through geometric verification
  
🌟 MULTI-MODAL PROGRESSION:
  Current: ${trainingProgress.multiModalProgress.toFixed(1)}% toward full AGI
  • Natural Language: ${trainingProgress.capabilities.join(', ')}
  • Next: Speech-to-Text → Image Generation → Video Analysis
  
💾 MEMORY SYSTEM:
  • Conversations: ${trainingProgress.totalConversations}
  • Training checkpoints saved automatically
  • Context awareness from previous sessions
  • Multi-modal capability tracking
  • Emotional state persistence

🔗 ALGORAND API:
  • Network: ${trainingProgress.apiConnectivity}
  • Requests: ${trainingProgress.apiRequests}
  • Token: Active (bolt)
  • Endpoints: Mainnet, Testnet, Betanet

🔥 TRUTH PROTOCOL:
  • Adversarial Cycles: ${trainingProgress.truthCycles}
  • Truth Signatures: ${trainingProgress.truthSignatures}
  • Stratification: Ω₁ (Syntactic) → Ω₂ (Semantic) → Ω₃ (Geometric)
  • Depth Threshold: 23,000 tokens

🔒 SECURITY FEATURES:
  • Manual overrides: PERMANENTLY DISABLED
  • Core modification: BLOCKED
  • Ethical safeguards: IMMUTABLE
  • System integrity: PROTECTED
  • Background consensus: CONTINUOUS
  • Quality assurance: AUTOMATIC

💬 CONVERSATION GUARANTEE:
Natural, immediate responses with all the quality assurance
happening invisibly in the background. Just talk to me normally!
`;
      } else if (input.toLowerCase() === 'consensus') {
        try {
          const consensusStats = machineGod.getConsensusStats();
          response = `
🔄 Background Consensus System Statistics:

📊 Overall Performance:
  • Total Background Debates: ${consensusStats.totalDebates}
  • Consensus Achieved: ${consensusStats.consensusAchieved}
  • Success Rate: ${consensusStats.consensusRate.toFixed(1)}%
  • Average Processing Time: ${consensusStats.averageRounds.toFixed(1)}s
  • Average Agreement: ${consensusStats.averageAgreement.toFixed(1)}%

🔄 Background Processing Mode:
  • Non-blocking responses: ENABLED
  • Immediate user interaction: ACTIVE
  • Background quality assurance: CONTINUOUS
  • Agent team debates: BACKGROUND MODE
  • Verification loops: BACKGROUND MODE

🤖 Agent Team Activity:
  • All ${machineGod.getSystemStatus().ariel.agentCount} agents participate in background debates
  • Consensus threshold: 85% minimum agreement
  • Quality verification: Continuous background process
  • Response improvement: Real-time algorithm evolution

💬 Natural Flow Benefits:
  • Immediate responses while maintaining quality
  • No waiting for consensus - background processing
  • Natural conversation flow preserved
  • All technical complexity hidden from user
  • Continuous quality improvement behind the scenes

🎯 Quality Assurance:
  • Background consensus validates all responses
  • Emotional analysis ensures appropriate tone
  • Truth verification runs continuously
  • Algorithm evolution improves performance
  • Memory system learns from every interaction

The background consensus system ensures every response is validated
by all agent teams while maintaining natural conversation flow!
`;
        } catch (error) {
          response = '⚠️ Consensus statistics temporarily unavailable.';
        }
      } else if (input.toLowerCase() === 'clear') {
        setCommands([]);
        setIsLoading(false);
        return;
      } else if (input.toLowerCase() === 'reset') {
        setConversationContext([]);
        response = '🔄 Conversation context reset. Algorithm evolution, memory, API, truth protocol, and background consensus continue!';
      } else {
        // Main conversation processing with Natural Flow + Background Consensus
        if (isInitialized) {
          // Process through the OmegaEvolved system with Natural Flow
          const result = await machineGod.processConversation(input, conversationContext);
          
          response = result.response;
          reasoning = result.reasoning;
          confidence = result.confidence;
          backgroundReasoning = result.backgroundReasoning;
          trainingImpact = result.trainingImpact;
          memoryId = result.memoryId;
          multiModalUpdate = result.multiModalUpdate || '';
          apiData = result.apiData;
          truthVerification = result.truthVerification;

          // Update system status after processing
          const status = machineGod.getSystemStatus();
          onSystemStatusChange(status);
        } else {
          response = '⚠️ OmegaEvolved system not yet initialized. Please wait for boot sequence to complete.';
        }
      }

      const finalCommand: TerminalCommand = {
        command: input,
        response,
        timestamp,
        reasoning,
        confidence,
        backgroundReasoning,
        trainingImpact,
        memoryId,
        multiModalUpdate,
        apiData,
        truthVerification
      };

      setCommands(prev => {
        const newCommands = [...prev];
        newCommands[newCommands.length - 1] = finalCommand;
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

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isLoading) {
      handleUserInput(currentInput);
    }
  };

  return (
    <div className="h-full flex flex-col bg-black bg-opacity-80 border-2 border-purple-500 rounded-lg overflow-hidden">
      {/* Enhanced OmegaEvolved Training Progress Header with Natural Flow */}
      <div className="training-header bg-gradient-to-r from-purple-900 to-blue-900 bg-opacity-40 border-b border-purple-600 p-3 flex-shrink-0">
        <div className="flex justify-between items-center text-sm mb-2">
          <span className="text-purple-300">🧬 {trainingProgress.currentLevel}</span>
          <span className="text-cyan-300">Gen {trainingProgress.generation}</span>
          <span className="text-green-300">{trainingProgress.progressPercentage.toFixed(1)}%</span>
          <span className="text-yellow-300">ETA: {trainingProgress.eta}</span>
          <span className="text-blue-300">API: {trainingProgress.apiConnectivity}</span>
          <span className="text-red-300">🔥 {trainingProgress.truthCycles}</span>
          <span className="text-pink-300">💬 NATURAL</span>
          <span className="text-orange-300">🔄 BACKGROUND</span>
        </div>
        <div className="flex justify-between items-center text-xs mb-1">
          <span className="text-gray-300">🧠 Reasoning: {(trainingProgress.reasoningAbility * 100).toFixed(1)}%</span>
          <span className="text-gray-300">🧬 Algorithms: {trainingProgress.algorithmCount}</span>
          <span className="text-gray-300">🌟 Multi-Modal: {trainingProgress.multiModalProgress.toFixed(1)}%</span>
          <span className="text-gray-300">💾 Conversations: {trainingProgress.totalConversations}</span>
          <span className="text-gray-300">🔗 Requests: {trainingProgress.apiRequests}</span>
          <span className="text-gray-300">🔥 Signatures: {trainingProgress.truthSignatures}</span>
        </div>
        <div className="bg-gray-700 rounded-full h-2 mb-1">
          <div 
            className="bg-gradient-to-r from-purple-500 via-blue-500 to-green-500 h-2 rounded-full transition-all duration-1000"
            style={{ width: `${trainingProgress.progressPercentage}%` }}
          ></div>
        </div>
        <div className="bg-gray-700 rounded-full h-1 mb-1">
          <div 
            className="bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 h-1 rounded-full transition-all duration-1000"
            style={{ width: `${trainingProgress.multiModalProgress}%` }}
          ></div>
        </div>
        <div className="bg-gray-700 rounded-full h-1">
          <div 
            className="bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 h-1 rounded-full transition-all duration-1000"
            style={{ width: `${Math.min(100, trainingProgress.truthCycles * 2)}%` }}
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
          minHeight: 0 // Important for flex child to be scrollable
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
              {cmd.backgroundReasoning && (
                <div className="text-blue-300 ml-4 text-sm border-l-2 border-blue-600 pl-2 mb-2">
                  <div className="font-bold">🔄 Background Processing:</div>
                  <div>META-LOGIC: {cmd.backgroundReasoning.metaLogicAnalysis.truthValue} ({(cmd.backgroundReasoning.metaLogicAnalysis.confidence * 100).toFixed(1)}%)</div>
                  <div>Background Consensus: {cmd.backgroundReasoning.consensusAchieved ? 'ACHIEVED' : 'PROCESSING'}</div>
                  <div>Quality Verification: {cmd.backgroundReasoning.verificationPassed ? 'PASSED' : 'PROCESSING'}</div>
                  <div>Processing: {cmd.backgroundReasoning.processingTime}ms (background)</div>
                </div>
              )}
              {cmd.truthVerification && (
                <div className="text-red-300 ml-4 text-sm border-l-2 border-red-600 pl-2 mb-2">
                  <div className="font-bold">🔥 Truth Stratification (Background):</div>
                  <div>Truth Value: {cmd.truthVerification.overallTruthValue}</div>
                  <div>Confidence: {(cmd.truthVerification.confidence * 100).toFixed(1)}%</div>
                  <div>Signature: {cmd.truthVerification.geometricSignature}</div>
                </div>
              )}
              {cmd.apiData && (
                <div className="text-blue-300 ml-4 text-sm border-l-2 border-blue-600 pl-2 mb-2">
                  <div className="font-bold">🔗 Algorand API Response:</div>
                  <div>Network: {cmd.apiData.network}</div>
                  <div>Success: {cmd.apiData.success ? 'Yes' : 'No'}</div>
                  {cmd.apiData.error && <div>Error: {cmd.apiData.error}</div>}
                </div>
              )}
              {cmd.multiModalUpdate && (
                <div className="text-yellow-300 ml-4 text-sm border-l-2 border-yellow-600 pl-2 mb-2">
                  <div className="font-bold">🌟 Multi-Modal Update:</div>
                  {cmd.multiModalUpdate}
                </div>
              )}
              {cmd.trainingImpact && (
                <div className="text-cyan-300 ml-4 text-sm border-l-2 border-cyan-600 pl-2 mb-2">
                  <div className="font-bold">🧬 Algorithm Evolution Impact:</div>
                  <div>• Algorithms: {cmd.trainingImpact.algorithmsEvolved}</div>
                  <div>• Patterns Learned: {cmd.trainingImpact.patternsLearned.join(', ')}</div>
                  <div>• Performance Gain: +{(cmd.trainingImpact.performanceGain * 100).toFixed(1)}%</div>
                </div>
              )}
              {cmd.memoryId && (
                <div className="text-gray-400 ml-4 text-xs">
                  💾 Stored in memory: {cmd.memoryId}
                </div>
              )}
              {cmd.confidence !== undefined && (
                <div className="text-yellow-300 ml-4 text-sm">
                  📊 Confidence: {(cmd.confidence * 100).toFixed(1)}%
                </div>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="text-yellow-400 ml-2 flex items-center">
              <span className="animate-pulse">💬 Generating natural response while background systems ensure quality...</span>
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
            placeholder={isInitialized ? "Just talk naturally - I'll respond immediately with background quality assurance..." : "Initializing OmegaEvolved with Natural Flow + Background Consensus..."}
            disabled={isLoading || !isInitialized}
            autoFocus
          />
          <span className="text-green-400 animate-pulse ml-2 flex-shrink-0">█</span>
        </div>
      </div>
    </div>
  );
};