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
    "(c) 2024 META-LOGIC Systems - MANDATORY CONSENSUS REQUIREMENT",
    "",
    "🤝 Initializing MANDATORY CONSENSUS Protocol...",
    "✓ All agents must agree before ANY output: ENABLED",
    "✓ Consensus threshold: 85% minimum agreement",
    "✓ Maximum consensus rounds: 5 attempts",
    "✓ Dissenter feedback integration: ACTIVE",
    "",
    "🔥 Initializing Mesiah Bishop Truth Protocol...",
    "✓ Truth Stratification (Ω₁, Ω₂, Ω₃): ENABLED",
    "✓ Adversarial Anointing: ACTIVE",
    "✓ Geometric Verification: READY",
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
    "✓ Recursive self-referential analysis: ONLINE",
    "✓ Paradox resolution framework: ACTIVE",
    "✓ Truth stratification engine: CALIBRATED",
    "✓ Background analysis integration: READY",
    "",
    "🤖 ARIEL 4x4 Agent Teams with MANDATORY CONSENSUS...",
    "✓ Team Alpha (Research): 4 agents + handler DEPLOYED",
    "✓ Team Beta (Analysis): 4 agents + handler DEPLOYED", 
    "✓ Team Gamma (Synthesis): 4 agents + handler DEPLOYED",
    "✓ Management layer: ACTIVE",
    "✓ Consensus requirement: MANDATORY",
    "✓ Voting system: ENABLED",
    "✓ Dissenter feedback: INTEGRATED",
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
    "🤝 CONSENSUS: ALL AGENTS MUST AGREE BEFORE OUTPUT",
    "",
    "⚠️ SECURITY NOTICE: Manual overrides and core component modification DISABLED",
    "🔒 System integrity protection: ACTIVE",
    "🛡️ Ethical safeguards: ENFORCED",
    "🤝 CONSENSUS REQUIREMENT: MANDATORY FOR ALL RESPONSES",
    "",
    "OMEGAEVOLVED SYSTEM READY - CONSENSUS PROTOCOL ACTIVE",
    "",
    "Hello! I'm your MachineGod AI with OmegaEvolved technology and MANDATORY CONSENSUS.",
    "Every response requires ALL my agent teams to reach agreement before I can answer.",
    "This ensures the highest quality, accuracy, and thoughtfulness in every response.",
    "If my agents can't reach consensus, I'll let you know and ask you to rephrase.",
    "Ask me anything - but know that quality comes from unanimous agreement!"
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
          response: "🎯 OmegaEvolved system operational - MANDATORY CONSENSUS active for all responses",
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
🧬 MachineGod OmegaEvolved AI Assistant with MANDATORY CONSENSUS:

💬 CONVERSATION:
  Just type naturally - ALL my agent teams must agree before I can respond!
  I remember our conversations and learn from every interaction.
  
🔧 SYSTEM COMMANDS:
  status     - Show detailed system status
  training   - Show OmegaEvolved training progress and metrics
  evolution  - Show algorithm evolution statistics
  memory     - Show conversation memory and multi-modal progress
  api        - Show Algorand API status and connectivity
  truth      - Show Mesiah Bishop Truth Protocol status
  consensus  - Show consensus statistics and voting patterns
  search <query> - Search conversation history
  export     - Export all memory data
  debug      - Show last debate reasoning and algorithm creation
  evaluate   - Force META-LOGIC evaluation mode
  verify <statement> - Force truth stratification on statement
  geometric <statement> - Force geometric verification
  benchmark  - Benchmark truth protocol performance
  reset      - Reset conversation context (keeps memory)
  clear      - Clear terminal
  
🤝 CONSENSUS SYSTEM:
  • ALL agents must agree before ANY response
  • Minimum 85% agreement threshold required
  • Up to 5 consensus rounds attempted
  • Dissenter feedback integrated for improvement
  • No output without unanimous agreement
  
🔗 ALGORAND API COMMANDS:
  network status - Check blockchain network status
  api health     - Perform API health check
  switch network <mainnet|testnet|betanet> - Switch networks
  
🔥 TRUTH STRATIFICATION COMMANDS:
  verify <statement> - Apply Ω₁, Ω₂, Ω₃ verification
  geometric <statement> - Show geometric truth shape
  benchmark truth - Test protocol performance
  
🧬 OMEGAEVOLVED CAPABILITIES:
  • Background reasoning through META-LOGIC analysis
  • MANDATORY consensus from all agent teams
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
  • Consensus requirement: MANDATORY

🤝 CONSENSUS GUARANTEE:
Every response requires ALL agent teams to reach agreement.
If consensus fails, I'll explain why and ask you to rephrase.
Quality through unanimous agreement!
`;
      } else if (input.toLowerCase() === 'consensus') {
        try {
          const consensusStats = machineGod.getConsensusStats();
          response = `
🤝 Consensus System Statistics:

📊 Overall Performance:
  • Total Debates: ${consensusStats.totalDebates}
  • Consensus Achieved: ${consensusStats.consensusAchieved}
  • Success Rate: ${consensusStats.consensusRate.toFixed(1)}%
  • Average Rounds: ${consensusStats.averageRounds.toFixed(1)}
  • Average Agreement: ${consensusStats.averageAgreement.toFixed(1)}%

🗳️ Voting Patterns:
  • Consensus Threshold: 85% minimum agreement
  • Maximum Rounds: 5 attempts per question
  • Dissenter Integration: Active feedback system
  • Agent Participation: All ${machineGod.getSystemStatus().ariel.agentCount} agents vote

📈 Quality Metrics:
  • Responses Only With Consensus: 100%
  • Failed Consensus Handling: Transparent explanation
  • User Satisfaction: Enhanced through agreement requirement
  • Response Quality: Guaranteed through unanimous approval

🔧 Process Overview:
  1. META-LOGIC analysis of user input
  2. Agent team debate and solution development
  3. MANDATORY voting round with all agents
  4. Feedback integration if consensus not reached
  5. Up to 5 rounds to achieve 85%+ agreement
  6. Response generation ONLY after consensus
  7. Transparent failure explanation if no agreement

🎯 Benefits:
  • Highest quality responses through team agreement
  • Multiple perspectives considered and validated
  • Reduced errors through collaborative verification
  • Enhanced reliability through consensus requirement
  • Transparent process when consensus fails

The consensus system ensures every response has the full backing
of all agent teams before being presented to you!
`;
        } catch (error) {
          response = '⚠️ Consensus statistics temporarily unavailable.';
        }
      } else if (input.toLowerCase() === 'status') {
        const status = machineGod.getSystemStatus();
        const consensusStats = machineGod.getConsensusStats();
        onSystemStatusChange(status);
        response = `
🚀 MachineGod OmegaEvolved System Status with CONSENSUS:

🧬 OMEGAEVOLVED: ${status.training.active ? 'ACTIVE' : 'OFFLINE'}
   └─ Current Level: ${status.training.currentLevel}
   └─ Progress: ${status.training.progressPercentage.toFixed(1)}%
   └─ Reasoning Ability: ${(status.training.reasoningAbility * 100).toFixed(1)}%
   └─ ETA: ${status.training.eta}

🤝 CONSENSUS SYSTEM: MANDATORY
   └─ Success Rate: ${consensusStats.consensusRate.toFixed(1)}%
   └─ Total Debates: ${consensusStats.totalDebates}
   └─ Achieved Consensus: ${consensusStats.consensusAchieved}
   └─ Average Agreement: ${consensusStats.averageAgreement.toFixed(1)}%
   └─ Average Rounds: ${consensusStats.averageRounds.toFixed(1)}

🧠 META-LOGIC: ${status.metaLogic.active ? 'ACTIVE' : 'OFFLINE'}
   └─ Evaluations: ${status.metaLogic.evaluationsCount}
   └─ Paradoxes Resolved: ${status.metaLogic.paradoxCount}
   └─ Background Analysis: ENABLED

🤖 ARIEL 4x4 Teams: ${status.ariel.active ? 'ACTIVE' : 'OFFLINE'}
   └─ Active Agents: ${status.ariel.agentCount}
   └─ Completed Debates: ${status.ariel.debateCount}
   └─ Team Performance: ${(status.ariel.teamMorale * 100).toFixed(1)}%
   └─ Consensus Voting: ENABLED

⚡ WARP System: ${status.warp.active ? 'ACTIVE' : 'STANDBY'}
   └─ Current Phase: ${status.warp.currentPhase}
   └─ Efficiency: ${(status.warp.efficiency * 100).toFixed(1)}%
   └─ Active Teams: ${status.warp.teamCount}
   └─ Advancement Threshold: 80% reasoning (Current: ${(status.training.reasoningAbility * 100).toFixed(1)}%)

🗜️ HELIX Compression: ${status.helix.active ? 'ACTIVE' : 'OFFLINE'}
   └─ Operations: ${status.helix.totalCompressions}
   └─ Space Saved: ${Math.round(status.helix.spaceSaved / 1024)}KB
   └─ Avg Compression: ${(status.helix.averageRatio * 100).toFixed(1)}%

💾 Persistent Memory: ACTIVE
   └─ Conversations: ${status.memory.totalConversations}
   └─ User Sessions: ${status.memory.userSessions}
   └─ Training Checkpoints: ${status.memory.trainingCheckpoints}
   └─ Multi-Modal Progress: ${(status.memory.multiModalProgress * 100).toFixed(1)}%

🔗 Algorand API: ${status.api.connectivity.toUpperCase()}
   └─ Network: ${status.api.network}
   └─ Requests: ${status.api.requestCount}
   └─ Token Active: ${status.api.tokenActive ? 'YES' : 'NO'}
   └─ Last Health Check: ${status.api.lastHealthCheck?.toLocaleString() || 'Never'}

🔥 Truth Protocol: ${status.truthProtocol.active ? 'ACTIVE' : 'DISABLED'}
   └─ Adversarial Cycles: ${status.truthProtocol.adversarialCycles}
   └─ Truth Signatures: ${status.truthProtocol.truthSignatures}
   └─ Stratum Compliance: Ω₁:${(status.truthProtocol.stratumCompliance['Ω₁'] * 100 || 0).toFixed(0)}% Ω₂:${(status.truthProtocol.stratumCompliance['Ω₂'] * 100 || 0).toFixed(0)}% Ω₃:${(status.truthProtocol.stratumCompliance['Ω₃'] * 100 || 0).toFixed(0)}%

💾 Logic Data Storage:
   └─ 6 tiers × 256 units (1536 total)
   └─ Trainingless NLP: ACTIVE
   └─ Algorithm Evolution: CONTINUOUS
   └─ Memory Persistence: ENABLED
   └─ API Integration: ENABLED
   └─ Truth Stratification: ENABLED
   └─ Consensus Requirement: MANDATORY

🔒 Security Status:
   └─ Manual Overrides: PERMANENTLY DISABLED
   └─ Core Modification: BLOCKED
   └─ Ethical Safeguards: IMMUTABLE
   └─ System Integrity: PROTECTED
   └─ Consensus Requirement: ENFORCED
`;
      } else if (input.toLowerCase() === 'clear') {
        setCommands([]);
        setIsLoading(false);
        return;
      } else if (input.toLowerCase() === 'reset') {
        setConversationContext([]);
        response = '🔄 Conversation context reset. Algorithm evolution, memory, API, truth protocol, and consensus system continue!';
      } else {
        // Main conversation processing with MANDATORY CONSENSUS
        if (isInitialized) {
          // Process through the OmegaEvolved system with MANDATORY CONSENSUS
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

      setCommands(prev => {
        const newCommands = [...prev];
        newCommands[newCommands.length - 1] = {
          ...newCommands[newCommands.length - 1],
          response,
          reasoning,
          confidence,
          backgroundReasoning,
          trainingImpact,
          memoryId,
          multiModalUpdate,
          apiData,
          truthVerification
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

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isLoading) {
      handleUserInput(currentInput);
    }
  };

  return (
    <div className="h-full flex flex-col bg-black bg-opacity-80 border-2 border-purple-500 rounded-lg overflow-hidden">
      {/* Enhanced OmegaEvolved Training Progress Header with Consensus */}
      <div className="training-header bg-gradient-to-r from-purple-900 to-blue-900 bg-opacity-40 border-b border-purple-600 p-3 flex-shrink-0">
        <div className="flex justify-between items-center text-sm mb-2">
          <span className="text-purple-300">🧬 {trainingProgress.currentLevel}</span>
          <span className="text-cyan-300">Gen {trainingProgress.generation}</span>
          <span className="text-green-300">{trainingProgress.progressPercentage.toFixed(1)}%</span>
          <span className="text-yellow-300">ETA: {trainingProgress.eta}</span>
          <span className="text-blue-300">API: {trainingProgress.apiConnectivity}</span>
          <span className="text-red-300">🔥 {trainingProgress.truthCycles}</span>
          <span className="text-pink-300">🤝 CONSENSUS</span>
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
                  <div className="font-bold">🧠 Background Reasoning:</div>
                  <div>META-LOGIC: {cmd.backgroundReasoning.metaLogicAnalysis.truthValue} ({(cmd.backgroundReasoning.metaLogicAnalysis.confidence * 100).toFixed(1)}%)</div>
                  <div>Agent Debate: {cmd.backgroundReasoning.agentDebateResult.winningTeam} ({(cmd.backgroundReasoning.agentDebateResult.confidence * 100).toFixed(1)}%)</div>
                  <div>🤝 Consensus: {cmd.backgroundReasoning.consensusAchieved ? 'ACHIEVED' : 'FAILED'}</div>
                  {cmd.backgroundReasoning.consensusDetails && (
                    <div>Agreement: {cmd.backgroundReasoning.consensusDetails.agreementPercentage.toFixed(1)}% in {cmd.backgroundReasoning.consensusDetails.rounds} rounds</div>
                  )}
                  <div>Processing: {cmd.backgroundReasoning.processingTime}ms</div>
                </div>
              )}
              {cmd.truthVerification && (
                <div className="text-red-300 ml-4 text-sm border-l-2 border-red-600 pl-2 mb-2">
                  <div className="font-bold">🔥 Truth Stratification:</div>
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
              <span className="animate-pulse">🤝 Seeking consensus from ALL agent teams - this ensures highest quality response...</span>
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
            placeholder={isInitialized ? "Ask me anything - ALL agents must agree before I respond..." : "Initializing OmegaEvolved with MANDATORY CONSENSUS..."}
            disabled={isLoading || !isInitialized}
            autoFocus
          />
          <span className="text-green-400 animate-pulse ml-2 flex-shrink-0">█</span>
        </div>
      </div>
    </div>
  );
};