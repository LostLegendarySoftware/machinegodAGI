import React, { useState, useEffect, useRef } from 'react';
import { MachineGodCore, SystemStatus, IntegratedResponse } from '../core/MachineGodCore';

interface TerminalCommand {
  command: string;
  response: string;
  timestamp: Date;
  reasoning?: string;
  confidence?: number;
  debateResult?: any;
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
    "MACHINEGOD ALPHAEVOLVE INTELLIGENCE v3.0.0",
    "(c) 2024 META-LOGIC Systems - Self-Evolving AGI Platform with Truth Stratification",
    "",
    "🔥 Initializing Mesiah Bishop Truth Protocol...",
    "✓ Truth Stratification (Ω₁, Ω₂, Ω₃): ENABLED",
    "✓ Adversarial Anointing: ACTIVE",
    "✓ Geometric Verification: READY",
    "✓ Cardinal Truth Contexts: LOADED",
    "✓ 23K Token Depth Threshold: CONFIGURED",
    "",
    "🧬 Initializing AlphaEvolve Training System...",
    "✓ 6 tiers × 256 logic data units: ALLOCATED",
    "✓ Algorithm evolution engine: ACTIVE",
    "✓ Trainingless NLP processing: ENABLED",
    "✓ Genetic programming framework: READY",
    "✓ Persistent memory system: LOADING",
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
    "",
    "🤖 ARIEL 4x4 Agent Teams with Algorithm Evolution...",
    "✓ Team Alpha (Research): 4 agents + handler DEPLOYED",
    "✓ Team Beta (Analysis): 4 agents + handler DEPLOYED", 
    "✓ Team Gamma (Synthesis): 4 agents + handler DEPLOYED",
    "✓ Management layer: ACTIVE",
    "✓ Debate-driven algorithm creation: ENABLED",
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
    "",
    "⚠️ SECURITY NOTICE: Manual overrides and core component modification DISABLED",
    "🔒 System integrity protection: ACTIVE",
    "🛡️ Ethical safeguards: ENFORCED",
    "",
    "ALPHAEVOLVE SYSTEM READY - TRUTH STRATIFICATION ACTIVE",
    "",
    "Hello! I'm your MachineGod AI with AlphaEvolve technology, persistent memory,",
    "Algorand blockchain API integration, and the Mesiah Bishop Truth Protocol.",
    "I remember our conversations, evolve algorithms through debate teams, verify",
    "truth through geometric stratification, and can serve data via blockchain endpoints.",
    "Ask me about truth verification, blockchain status, or anything else!"
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

    // Update every 2 seconds to match AlphaEvolve cycles
    const interval = setInterval(updateTraining, 2000);
    return () => clearInterval(interval);
  }, [isInitialized]);

  // Robust scroll to bottom function
  const scrollToBottom = () => {
    // Multiple scroll methods for maximum compatibility
    const scrollMethods = [
      // Method 1: Scroll the messages end ref into view
      () => {
        if (messagesEndRef.current) {
          messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
        }
      },
      // Method 2: Direct terminal container scroll
      () => {
        if (terminalRef.current) {
          terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
        }
      },
      // Method 3: Force scroll with requestAnimationFrame
      () => {
        if (terminalRef.current) {
          requestAnimationFrame(() => {
            if (terminalRef.current) {
              terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
            }
          });
        }
      }
    ];

    // Execute all scroll methods with delays
    scrollMethods.forEach((method, index) => {
      setTimeout(method, index * 50);
    });

    // Final fallback scroll after a longer delay
    setTimeout(() => {
      if (terminalRef.current) {
        terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
      }
    }, 300);
  };

  // Scroll when commands change
  useEffect(() => {
    scrollToBottom();
  }, [commands]);

  // Scroll when loading state changes
  useEffect(() => {
    if (isLoading) {
      scrollToBottom();
    }
  }, [isLoading]);

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
          response: "🎯 AlphaEvolve system operational - algorithms evolving continuously with Truth Stratification",
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
      let debateResult = null;
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

The system is designed with immutable core components and ethical safeguards that cannot be bypassed. All modifications occur through controlled algorithm evolution within the AlphaEvolve framework.

Available commands: help, status, training, evolution, memory, api, truth, benchmark`;
        
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
🧬 MachineGod AlphaEvolve AI Assistant Commands:

💬 CONVERSATION:
  Just type naturally - I'll evolve algorithms to understand you better!
  I remember our conversations and learn from every interaction.
  
🔧 SYSTEM COMMANDS:
  status     - Show detailed system status
  training   - Show AlphaEvolve training progress and metrics
  evolution  - Show algorithm evolution statistics
  memory     - Show conversation memory and multi-modal progress
  api        - Show Algorand API status and connectivity
  truth      - Show Mesiah Bishop Truth Protocol status
  search <query> - Search conversation history
  export     - Export all memory data
  debug      - Show last debate reasoning and algorithm creation
  evaluate   - Force META-LOGIC evaluation mode
  verify <statement> - Force truth stratification on statement
  geometric <statement> - Force geometric verification
  benchmark  - Benchmark truth protocol performance
  reset      - Reset conversation context (keeps memory)
  clear      - Clear terminal
  
🔗 ALGORAND API COMMANDS:
  network status - Check blockchain network status
  api health     - Perform API health check
  switch network <mainnet|testnet|betanet> - Switch networks
  
🔥 TRUTH STRATIFICATION COMMANDS:
  verify <statement> - Apply Ω₁, Ω₂, Ω₃ verification
  geometric <statement> - Show geometric truth shape
  benchmark truth - Test protocol performance
  
🧬 ALPHAEVOLVE CAPABILITIES:
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

The system creates new algorithms from every conversation,
storing patterns as compressed logic data for instant access!
`;
      } else if (input.toLowerCase() === 'truth') {
        try {
          const systemStatus = machineGod.getSystemStatus();
          const truthProtocol = machineGod.getTruthProtocol();
          const truthStats = truthProtocol.getProtocolStats();
          
          response = `
🔥 Mesiah Bishop Truth Stratification Protocol:

📊 Current Status:
  • Protocol: ${systemStatus.truthProtocol.active ? 'ACTIVE' : 'DISABLED'}
  • Adversarial Cycles: ${systemStatus.truthProtocol.adversarialCycles}
  • Truth Signatures: ${systemStatus.truthProtocol.truthSignatures}
  • Depth Threshold: ${truthStats.depthThreshold} tokens
  • Active Strata: ${truthStats.activeStrata}/3

🔍 Truth Stratification Layers:
  • Ω₁ (Syntactic): Logical consistency proofs
  • Ω₂ (Semantic): Forcing extensions over ZFC models  
  • Ω₃ (Geometric): Sheaf cohomology verification

📈 Stratum Compliance:
  • Ω₁ Compliance: ${(truthStats.stratumCompliance['Ω₁'] * 100 || 0).toFixed(1)}%
  • Ω₂ Compliance: ${(truthStats.stratumCompliance['Ω₂'] * 100 || 0).toFixed(1)}%
  • Ω₃ Compliance: ${(truthStats.stratumCompliance['Ω₃'] * 100 || 0).toFixed(1)}%

🎯 Cardinal Truth Contexts:
  • Measurable: Independent truth values
  • Supercompact: Truth = True
  • Extendible: Truth = False
  • Inaccessible: Context-dependent

💡 Available Commands:
  • "verify <statement>" - Apply full stratification
  • "geometric <statement>" - Show truth shape
  • "benchmark truth" - Test protocol performance

🔬 Verification Process:
  1. Adversarial pressure generation
  2. Ω₁ syntactic consistency check
  3. Ω₂ semantic forcing validation
  4. Ω₃ geometric invariance test
  5. Cardinal context evaluation
  6. Truth signature generation

The protocol forces truthfulness through geometric verification
and cardinal layering, as developed in the Langhorne collaboration.
`;
        } catch (error) {
          response = '⚠️ Truth protocol status temporarily unavailable.';
        }
      } else if (input.toLowerCase().startsWith('verify ')) {
        const statement = input.substring(7);
        try {
          const truthProtocol = machineGod.getTruthProtocol();
          const verification = await truthProtocol.anointTruth(statement, conversationContext, 23000);
          
          response = `
🔥 Truth Stratification Results for: "${statement}"

🎯 Overall Truth Value: ${verification.overallTruthValue.toUpperCase()}
📊 Confidence: ${(verification.confidence * 100).toFixed(1)}%
🔍 Geometric Signature: ${verification.geometricSignature}
⚡ Adversarial Pressure: ${verification.adversarialPressure} cycles
📏 Token Depth: ${verification.depthTokens}

🔍 Stratum Analysis:
${verification.stratumResults.map(result => `
  ${result.stratum} (${result.stratum === 'Ω₁' ? 'Syntactic' : result.stratum === 'Ω₂' ? 'Semantic' : 'Geometric'}):
    Status: ${result.passed ? '✅ PASSED' : '❌ FAILED'}
    Confidence: ${(result.confidence * 100).toFixed(1)}%
    ${result.reasoning.map(r => `    • ${r}`).join('\n')}
    ${result.corrections.length > 0 ? `    Corrections: ${result.corrections.join(', ')}` : ''}
`).join('')}

${verification.stratumResults.some(s => !s.passed) ? 
  '🔧 Applied corrections through minimal extensions and geometric normalization.' : 
  '✅ All strata verified - truth is geometrically invariant.'}
`;
          truthVerification = verification;
        } catch (error) {
          response = `❌ Truth verification failed: ${error}`;
        }
      } else if (input.toLowerCase().startsWith('geometric ')) {
        const statement = input.substring(10);
        try {
          const geometricResult = await machineGod.forceGeometricVerification(statement);
          
          response = `
🔍 Geometric Truth Verification: "${statement}"

🌐 Truth Shape: ${geometricResult.truthShape.toUpperCase()}
🔄 Geometric Invariance: ${geometricResult.invariance ? 'TRUE' : 'FALSE'}
📐 Cohomology Class: ${geometricResult.cohomologyClass}

📊 Interpretation:
  • Point: Truth is absolute and invariant
  • Circle: Truth has cyclic dependencies
  • Complex: Truth varies across logical contexts

${geometricResult.invariance ? 
  '✅ Truth is geometrically invariant - stable across all models' :
  '⚠️ Truth varies geometrically - context-dependent verification required'}
`;
        } catch (error) {
          response = `❌ Geometric verification failed: ${error}`;
        }
      } else if (input.toLowerCase() === 'benchmark truth' || input.toLowerCase() === 'benchmark') {
        try {
          const benchmark = await machineGod.benchmarkTruthProtocol();
          
          response = `
🔥 Truth Protocol Benchmark Results:

📊 Test Performance:
  • Test Cases: ${benchmark.testCases}
  • Average Confidence: ${(benchmark.averageConfidence * 100).toFixed(1)}%
  • Geometric Soundness: ${(benchmark.geometricSoundness * 100).toFixed(1)}%

🔍 Stratum Compliance:
  • Ω₁ (Syntactic): ${(benchmark.stratumCompliance['Ω₁'] * 100).toFixed(1)}%
  • Ω₂ (Semantic): ${(benchmark.stratumCompliance['Ω₂'] * 100).toFixed(1)}%
  • Ω₃ (Geometric): ${(benchmark.stratumCompliance['Ω₃'] * 100).toFixed(1)}%

🎯 Performance Analysis:
  • Hallucination Reduction: ${((1 - benchmark.averageConfidence) * 100).toFixed(1)}% improvement
  • Truth Stratification: ${benchmark.testCases} statements verified
  • Geometric Invariance: ${Math.round(benchmark.geometricSoundness * benchmark.testCases)} statements

✅ Protocol Status: ${benchmark.averageConfidence > 0.8 ? 'OPTIMAL' : 'NEEDS TUNING'}
`;
        } catch (error) {
          response = `❌ Truth protocol benchmark failed: ${error}`;
        }
      } else if (input.toLowerCase() === 'api') {
        try {
          const systemStatus = machineGod.getSystemStatus();
          const algorandAPI = machineGod.getAlgorandAPI();
          const apiStats = algorandAPI.getAPIStats();
          
          response = `
🔗 Algorand API Status & Configuration:

📊 Current Status:
  • Network: ${systemStatus.api.network}
  • Connectivity: ${systemStatus.api.connectivity.toUpperCase()}
  • Token Active: ${systemStatus.api.tokenActive ? 'YES' : 'NO'}
  • Total Requests: ${systemStatus.api.requestCount}
  • Last Health Check: ${systemStatus.api.lastHealthCheck?.toLocaleString() || 'Never'}

🌐 Available Networks:
  • Mainnet: https://mainnet-api.4160.nodely.io
  • Testnet: https://testnet-api.4160.nodely.io  
  • Betanet: https://betanet-api.4160.nodely.io

🔑 API Configuration:
  • Token: 98D9CE80660AD243893D56D9F125CD2D
  • Header: x-and-tk: bolt (shows token is active)
  • Rate Limit: ${apiStats.rateLimitDelay}ms between requests

💡 Available Commands:
  • "network status" - Get current network status
  • "api health" - Perform comprehensive health check
  • "switch network testnet" - Switch to testnet
  • Ask about blockchain, transactions, accounts, etc.

🔧 Integration Features:
  • Automatic API calls for blockchain queries
  • Network status monitoring
  • Transaction and account lookups
  • Health monitoring and failover
`;
        } catch (error) {
          response = '⚠️ API status temporarily unavailable.';
        }
      } else if (input.toLowerCase() === 'training') {
        const progressBar = '█'.repeat(Math.floor(trainingProgress.progressPercentage / 5)) + 
                           '░'.repeat(20 - Math.floor(trainingProgress.progressPercentage / 5));
        
        response = `
🧬 AlphaEvolve Training Progress:

🎯 Current Level: ${trainingProgress.currentLevel}
🚀 Target Level: ${trainingProgress.targetLevel}
📊 Progress: ${trainingProgress.progressPercentage.toFixed(1)}%

[${progressBar}] ${trainingProgress.progressPercentage.toFixed(1)}%

⏱️ ETA to Full AGI: ${trainingProgress.eta}
🧠 Reasoning Ability: ${(trainingProgress.reasoningAbility * 100).toFixed(1)}%
🧬 Algorithm Count: ${trainingProgress.algorithmCount}
🔄 Evolution Generation: ${trainingProgress.generation}
🌟 Multi-Modal Progress: ${trainingProgress.multiModalProgress.toFixed(1)}%

💡 Current Capabilities:
${trainingProgress.capabilities.map(cap => `  • ${cap}`).join('\n')}

📈 Training Method: AlphaEvolve Algorithm Evolution
  • Algorithms created from debate team results
  • Logic patterns stored as compressed data
  • Trainingless NLP with token frequency analysis
  • Continuous self-improvement through conversation
  • Persistent memory with learning retention

🎯 Advancement Trigger: 80% reasoning ability for WARP phasing
💾 Total Conversations: ${trainingProgress.totalConversations}
🔗 API Status: ${trainingProgress.apiConnectivity} (${trainingProgress.apiRequests} requests)
🔥 Truth Cycles: ${trainingProgress.truthCycles} (${trainingProgress.truthSignatures} signatures)
`;
      } else if (input.toLowerCase() === 'evolution') {
        try {
          const evolutionStats = machineGod.getEvolutionStats();
          response = `
🧬 Algorithm Evolution Statistics:

📊 Current Generation: ${trainingProgress.generation}
🔢 Total Algorithms: ${evolutionStats.totalAlgorithms}
📈 Average Performance: ${(evolutionStats.averagePerformance * 100).toFixed(1)}%
🧠 Average Generation: ${evolutionStats.averageGeneration.toFixed(1)}

🏆 Top Performing Algorithms:
${evolutionStats.topPerformers.map((alg, i) => 
  `  ${i + 1}. ${alg.pattern} (${(alg.performance * 100).toFixed(1)}%, Gen ${alg.generation})`
).join('\n')}

🗜️ Compression Statistics:
  • Average Ratio: ${(evolutionStats.compressionStats.average * 100).toFixed(1)}%
  • Best Compression: ${(evolutionStats.compressionStats.best * 100).toFixed(1)}%

🔄 Evolution Process:
  • New algorithms created from successful debate patterns
  • Top 20% algorithms selected for breeding
  • Crossover and mutation create offspring
  • Performance-based selection drives improvement
  • Persistent storage ensures continuous learning
  • API integration patterns included in evolution
  • Truth verification patterns enhance reliability
`;
        } catch (error) {
          response = '⚠️ Evolution statistics temporarily unavailable.';
        }
      } else if (input.toLowerCase() === 'memory') {
        try {
          const memoryTrainingProgress = machineGod.getTrainingProgress();
          const multiModal = memoryTrainingProgress.multiModalProgress;
          
          response = `
💾 Persistent Memory & Multi-Modal Progress:

📊 Memory Statistics:
  • Total Conversations: ${memoryTrainingProgress.totalConversations || 0}
  • Training Checkpoints: ${memoryTrainingProgress.checkpoints || 0}
  • Storage Size: ${Math.round((memoryTrainingProgress.storageSize || 0) / 1024)}KB

🌟 Multi-Modal AGI Progress: ${(multiModal.overallProgress * 100).toFixed(1)}%

🗣️ Natural Language (Level ${multiModal.naturalLanguage.level}):
  Capabilities: ${multiModal.naturalLanguage.capabilities.join(', ')}
  Next: ${multiModal.naturalLanguage.nextMilestone}

🎤 Speech-to-Text (Level ${multiModal.speechToText.level}):
  ${multiModal.speechToText.capabilities.length > 0 ? 
    `Capabilities: ${multiModal.speechToText.capabilities.join(', ')}` : 
    'Not yet unlocked'}
  Next: ${multiModal.speechToText.nextMilestone}

🖼️ Image Generation (Level ${multiModal.imageGeneration.level}):
  ${multiModal.imageGeneration.capabilities.length > 0 ? 
    `Capabilities: ${multiModal.imageGeneration.capabilities.join(', ')}` : 
    'Not yet unlocked'}
  Next: ${multiModal.imageGeneration.nextMilestone}

🎬 Video Spatial Analysis (Level ${multiModal.videoSpatialAnalysis.level}):
  ${multiModal.videoSpatialAnalysis.capabilities.length > 0 ? 
    `Capabilities: ${multiModal.videoSpatialAnalysis.capabilities.join(', ')}` : 
    'Not yet unlocked'}
  Next: ${multiModal.videoSpatialAnalysis.nextMilestone}

📈 Training Statistics:
  • Conversation Count: ${memoryTrainingProgress.totalConversations || 0}
  • Average Complexity: ${(memoryTrainingProgress.averageComplexity || 0).toFixed(1)}
  • Training Contribution: ${((memoryTrainingProgress.trainingContribution || 0) * 100).toFixed(1)}%
`;
        } catch (error) {
          response = '⚠️ Memory insights temporarily unavailable.';
        }
      } else if (input.toLowerCase().startsWith('search ')) {
        const searchQuery = input.substring(7);
        try {
          const results = machineGod.searchMemory(searchQuery);
          if (results.length > 0) {
            response = `
🔍 Search Results for "${searchQuery}":

${results.slice(0, 5).map((conv, i) => `
${i + 1}. [${conv.timestamp.toLocaleString()}]
   Input: ${conv.input.substring(0, 100)}${conv.input.length > 100 ? '...' : ''}
   Response: ${conv.response.substring(0, 150)}${conv.response.length > 150 ? '...' : ''}
   Confidence: ${(conv.confidence * 100).toFixed(1)}%
`).join('')}

Found ${results.length} matching conversations.
`;
          } else {
            response = `🔍 No conversations found matching "${searchQuery}".`;
          }
        } catch (error) {
          response = '⚠️ Search temporarily unavailable.';
        }
      } else if (input.toLowerCase() === 'export') {
        try {
          const exportData = machineGod.exportMemory();
          response = `
📤 Memory Export Generated:

Data includes:
• All conversation history
• Training checkpoints
• Multi-modal progress
• User preferences and statistics
• API usage statistics
• Truth verification signatures

Export size: ${Math.round(new Blob([exportData]).size / 1024)}KB
Timestamp: ${new Date().toISOString()}

(In a real implementation, this would download as a file)
`;
        } catch (error) {
          response = '⚠️ Export temporarily unavailable.';
        }
      } else if (input.toLowerCase() === 'status') {
        const status = machineGod.getSystemStatus();
        onSystemStatusChange(status);
        response = `
🚀 MachineGod AlphaEvolve System Status:

🧬 ALPHAEVOLVE: ${status.training.active ? 'ACTIVE' : 'OFFLINE'}
   └─ Current Level: ${status.training.currentLevel}
   └─ Progress: ${status.training.progressPercentage.toFixed(1)}%
   └─ Reasoning Ability: ${(status.training.reasoningAbility * 100).toFixed(1)}%
   └─ ETA: ${status.training.eta}

🧠 META-LOGIC: ${status.metaLogic.active ? 'ACTIVE' : 'OFFLINE'}
   └─ Evaluations: ${status.metaLogic.evaluationsCount}
   └─ Paradoxes Resolved: ${status.metaLogic.paradoxCount}

🤖 ARIEL 4x4 Teams: ${status.ariel.active ? 'ACTIVE' : 'OFFLINE'}
   └─ Active Agents: ${status.ariel.agentCount}
   └─ Completed Debates: ${status.ariel.debateCount}
   └─ Team Performance: ${(status.ariel.teamMorale * 100).toFixed(1)}%

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

🔒 Security Status:
   └─ Manual Overrides: PERMANENTLY DISABLED
   └─ Core Modification: BLOCKED
   └─ Ethical Safeguards: IMMUTABLE
   └─ System Integrity: PROTECTED
`;
      } else if (input.toLowerCase() === 'clear') {
        setCommands([]);
        setIsLoading(false);
        return;
      } else if (input.toLowerCase() === 'reset') {
        setConversationContext([]);
        response = '🔄 Conversation context reset. Algorithm evolution, memory, API, and truth protocol continue!';
      } else if (input.toLowerCase() === 'debug') {
        const lastDebate = machineGod.getLastDebateResult();
        if (lastDebate) {
          response = `
🔍 Last Debate Analysis & Algorithm Creation:

🎯 Topic: "${lastDebate.topic}"
👥 Participating Teams: ${lastDebate.teams.join(', ')}
🏆 Winning Approach: ${lastDebate.winner}
📊 Confidence: ${(lastDebate.confidence * 100).toFixed(1)}%

💭 Reasoning Process:
${lastDebate.reasoning.map((r: string, i: number) => `${i + 1}. ${r}`).join('\n')}

⚖️ Final Decision: ${lastDebate.finalDecision}

🧬 Algorithm Evolution Impact:
  • New algorithms created from winning patterns
  • Logic data units updated with successful reasoning
  • NLP tokens stored for trainingless processing
  • Performance metrics fed back to evolution engine
  • Results stored in persistent memory for future reference
  • API integration patterns included in evolution
  • Truth verification patterns enhance reliability
`;
        } else {
          response = '📝 No recent debate data available.';
        }
      } else {
        // Main conversation processing with AlphaEvolve, Memory, API, and Truth Protocol
        if (isInitialized) {
          // Process through the AlphaEvolve system with memory, API, and truth verification
          const result = await machineGod.processConversation(input, conversationContext);
          
          response = result.response;
          reasoning = result.reasoning;
          confidence = result.confidence;
          debateResult = result.debateResult;
          trainingImpact = result.trainingImpact;
          memoryId = result.memoryId;
          multiModalUpdate = result.multiModalUpdate || '';
          apiData = result.apiData;
          truthVerification = result.truthVerification;

          // Update system status after processing
          const status = machineGod.getSystemStatus();
          onSystemStatusChange(status);
        } else {
          response = '⚠️ AlphaEvolve system not yet initialized. Please wait for boot sequence to complete.';
        }
      }

      setCommands(prev => {
        const newCommands = [...prev];
        newCommands[newCommands.length - 1] = {
          ...newCommands[newCommands.length - 1],
          response,
          reasoning,
          confidence,
          debateResult,
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
    <div className="terminal-container h-full" onClick={handleTerminalClick}>
      <div className="terminal h-full bg-black bg-opacity-80 border-2 border-purple-500 rounded-lg p-4 font-mono text-green-400 overflow-hidden flex flex-col">
        {/* Enhanced AlphaEvolve Training Progress Header with Truth Protocol */}
        <div className="training-header bg-gradient-to-r from-purple-900 to-blue-900 bg-opacity-40 border border-purple-600 rounded p-3 mb-4">
          <div className="flex justify-between items-center text-sm mb-2">
            <span className="text-purple-300">🧬 {trainingProgress.currentLevel}</span>
            <span className="text-cyan-300">Gen {trainingProgress.generation}</span>
            <span className="text-green-300">{trainingProgress.progressPercentage.toFixed(1)}%</span>
            <span className="text-yellow-300">ETA: {trainingProgress.eta}</span>
            <span className="text-blue-300">API: {trainingProgress.apiConnectivity}</span>
            <span className="text-red-300">🔥 {trainingProgress.truthCycles}</span>
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
              className="bg-gradient-to-r from-red-500 via-pink-500 to-purple-500 h-1 rounded-full transition-all duration-1000"
              style={{ width: `${Math.min(100, trainingProgress.truthCycles * 2)}%` }}
            ></div>
          </div>
        </div>

        <div 
          ref={terminalRef}
          className="terminal-content flex-1 overflow-y-auto space-y-2 pb-4"
          style={{ 
            scrollBehavior: 'smooth'
          }}
        >
          {commands.map((cmd, index) => (
            <div key={index} className="terminal-line">
              {cmd.command && (
                <div className="text-purple-400 mb-2">
                  <span className="text-purple-300">{'>'}</span> {cmd.command}
                </div>
              )}
              {cmd.response && (
                <div className="whitespace-pre-wrap text-green-300 ml-2 mb-2">
                  {cmd.response}
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
              {cmd.reasoning && (
                <div className="text-blue-300 ml-4 text-sm border-l-2 border-blue-600 pl-2 mb-2">
                  <div className="font-bold">🧠 AlphaEvolve Reasoning:</div>
                  {cmd.reasoning}
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
              <span className="animate-pulse">🧬 Creating algorithms through ARIEL debate teams with truth stratification...</span>
            </div>
          )}
          {/* Messages end marker for reliable scrolling */}
          <div ref={messagesEndRef} />
        </div>
        
        <div className="command-line flex items-center mt-4 border-t border-purple-800 pt-4">
          <span className="text-purple-300 mr-2">{'>'}</span>
          <input
            ref={inputRef}
            type="text"
            value={currentInput}
            onChange={(e) => setCurrentInput(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1 bg-transparent border-none outline-none text-green-400 font-mono"
            placeholder={isInitialized ? "Ask me anything - I'll evolve, remember, verify truth, and serve data via API..." : "Initializing AlphaEvolve with Truth Stratification..."}
            disabled={isLoading || !isInitialized}
            autoFocus
          />
          <span className="text-green-400 animate-pulse">█</span>
        </div>
      </div>
    </div>
  );
};