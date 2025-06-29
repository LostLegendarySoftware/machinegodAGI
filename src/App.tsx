import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { SystemStatus } from './core/MachineGodCore';
import { MachineGodCore } from './core/MachineGodCore';
import IntroAnimation from './components/IntroAnimation';
import { PhoenixVisualization } from './components/PhoenixVisualization';
import { FuturisticHUD } from './components/FuturisticHUD';
import { HUDPanel } from './components/HUDPanel';
import { Terminal, Send, Activity, Brain, Cpu, Search, MessageSquare, Crown, Sparkles } from 'lucide-react';

// Global MachineGod instance to persist across tab switches
let globalMachineGod: MachineGodCore | null = null;

function App() {
  const [systemStatus, setSystemStatus] = useState<SystemStatus | null>(null);
  const [commands, setCommands] = useState<Array<{
    command: string;
    response: string;
    timestamp: Date;
    confidence?: number;
    needsFeedback?: boolean;
    feedbackGiven?: boolean;
    memoryId?: string;
  }>>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeMode, setActiveMode] = useState<'normal' | 'deep-search' | 'conversation' | 'god-mode'>('normal');
  const [emotionalState, setEmotionalState] = useState({
    joy: 0.5,
    sadness: 0.1,
    fear: 0.1,
    anger: 0.1,
    trust: 0.7,
    anticipation: 0.6
  });
  const [quantumState, setQuantumState] = useState({
    entanglement: 0.7,
    coherence: 0.8,
    superposition: 0.6
  });
  const [visualizationMode, setVisualizationMode] = useState<'default' | 'explanation' | 'analysis'>('default');
  const [explanationContent, setExplanationContent] = useState('');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize or reuse global MachineGod instance
  const machineGod = (() => {
    if (!globalMachineGod) {
      globalMachineGod = new MachineGodCore();
    }
    return globalMachineGod;
  })();

  useEffect(() => {
    // Initialize system
    const initSystem = async () => {
      try {
        await machineGod.initialize();
        const status = machineGod.getSystemStatus();
        setSystemStatus(status);
      } catch (error) {
        console.error('Failed to initialize system:', error);
      }
    };
    
    initSystem();
    
    // Start animation loop for quantum and emotional states
    const interval = setInterval(() => {
      updateQuantumState();
      updateEmotionalState();
    }, 2000);
    
    return () => clearInterval(interval);
  }, [machineGod]);

  // Auto-scroll when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [commands, isLoading]);

  // Update quantum state with some randomness
  const updateQuantumState = () => {
    setQuantumState(prev => ({
      entanglement: Math.min(1, Math.max(0.3, prev.entanglement + (Math.random() - 0.5) * 0.1)),
      coherence: Math.min(1, Math.max(0.3, prev.coherence + (Math.random() - 0.5) * 0.1)),
      superposition: Math.min(1, Math.max(0.3, prev.superposition + (Math.random() - 0.5) * 0.1))
    }));
  };

  // Update emotional state based on recent interactions
  const updateEmotionalState = () => {
    // Get the last command if available
    const lastCommand = commands[commands.length - 1];
    
    if (lastCommand && lastCommand.command) {
      const text = lastCommand.command.toLowerCase();
      
      // Simple sentiment analysis
      const joyWords = ['happy', 'good', 'great', 'excellent', 'amazing', 'love'];
      const sadWords = ['sad', 'bad', 'terrible', 'awful', 'hate', 'dislike'];
      const fearWords = ['afraid', 'scared', 'fear', 'terrified', 'worried'];
      const angerWords = ['angry', 'mad', 'furious', 'annoyed', 'irritated'];
      const trustWords = ['trust', 'believe', 'reliable', 'honest', 'faithful'];
      const anticipationWords = ['expect', 'anticipate', 'looking forward', 'hope'];
      
      // Calculate emotion values based on word presence
      const newEmotionalState = { ...emotionalState };
      
      // Check for emotion words
      joyWords.forEach(word => {
        if (text.includes(word)) newEmotionalState.joy = Math.min(1, newEmotionalState.joy + 0.1);
      });
      
      sadWords.forEach(word => {
        if (text.includes(word)) newEmotionalState.sadness = Math.min(1, newEmotionalState.sadness + 0.1);
      });
      
      fearWords.forEach(word => {
        if (text.includes(word)) newEmotionalState.fear = Math.min(1, newEmotionalState.fear + 0.1);
      });
      
      angerWords.forEach(word => {
        if (text.includes(word)) newEmotionalState.anger = Math.min(1, newEmotionalState.anger + 0.1);
      });
      
      trustWords.forEach(word => {
        if (text.includes(word)) newEmotionalState.trust = Math.min(1, newEmotionalState.trust + 0.1);
      });
      
      anticipationWords.forEach(word => {
        if (text.includes(word)) newEmotionalState.anticipation = Math.min(1, newEmotionalState.anticipation + 0.1);
      });
      
      // Apply decay to all emotions
      Object.keys(newEmotionalState).forEach(key => {
        if (key !== 'joy' && key !== 'trust') {
          newEmotionalState[key] *= 0.95; // Decay negative emotions
        }
      });
      
      setEmotionalState(newEmotionalState);
    } else {
      // Random small fluctuations when no commands
      setEmotionalState(prev => ({
        joy: Math.min(1, Math.max(0.3, prev.joy + (Math.random() - 0.48) * 0.05)),
        sadness: Math.min(0.5, Math.max(0.1, prev.sadness + (Math.random() - 0.5) * 0.03)),
        fear: Math.min(0.5, Math.max(0.1, prev.fear + (Math.random() - 0.5) * 0.03)),
        anger: Math.min(0.5, Math.max(0.1, prev.anger + (Math.random() - 0.5) * 0.03)),
        trust: Math.min(1, Math.max(0.5, prev.trust + (Math.random() - 0.48) * 0.05)),
        anticipation: Math.min(1, Math.max(0.3, prev.anticipation + (Math.random() - 0.48) * 0.05))
      }));
    }
  };

  const handleUserInput = async (input: string) => {
    if (!input.trim()) return;

    const timestamp = new Date();
    
    const newCommand = { 
      command: input, 
      response: '', 
      timestamp
    };
    
    setCommands(prev => [...prev, newCommand]);
    setCurrentInput('');
    setIsLoading(true);

    try {
      let response = '';

      // Process based on active mode
      switch (activeMode) {
        case 'deep-search':
          response = await processDeepSearch(input);
          break;
        case 'conversation':
          response = await processTalkToConversation(input);
          break;
        case 'god-mode':
          response = await processGodMode(input);
          break;
        default:
          response = await processNormalMode(input);
      }

      setCommands(prev => {
        const newCommands = [...prev];
        newCommands[newCommands.length - 1] = {
          ...newCommands[newCommands.length - 1],
          response,
          confidence: 0.85,
          needsFeedback: true,
          feedbackGiven: false,
          memoryId: `mem-${Date.now()}`
        };
        return newCommands;
      });

      // Update system status
      if (machineGod) {
        const status = machineGod.getSystemStatus();
        setSystemStatus(status);
      }
      
      // Check if we should switch to explanation mode
      if (input.toLowerCase().includes('explain') || input.toLowerCase().includes('how does')) {
        setVisualizationMode('explanation');
        setExplanationContent(input);
      } else if (input.toLowerCase().includes('analyze') || input.toLowerCase().includes('what is')) {
        setVisualizationMode('analysis');
        setExplanationContent(input);
      } else {
        setVisualizationMode('default');
        setExplanationContent('');
      }

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

  // Process input in normal mode
  const processNormalMode = async (input: string): Promise<string> => {
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check for mode switching commands
    if (input.toLowerCase().includes('deep search')) {
      setActiveMode('deep-search');
      return "🔍 Deep Search Mode activated. I'll now use enhanced research capabilities to provide in-depth information on your queries.";
    }
    
    if (input.toLowerCase().includes('talk to conversation')) {
      setActiveMode('conversation');
      return "💬 Talk to Conversation Mode activated. You can now discuss the conversation itself, ask about patterns, or explore meta-topics.";
    }
    
    if (input.toLowerCase().includes('god mode')) {
      setActiveMode('god-mode');
      return "👑 God Mode activated. System-level access granted. You can now control core systems and access advanced functionality.";
    }
    
    // Simulate response generation
    return `I've processed your query "${input}" using my quantum neural network. My analysis indicates several potential interpretations, which I've evaluated through my META-LOGIC system and verified with ARIEL agent debates. The most coherent response based on current understanding follows:\n\nThis would be a detailed, thoughtful response to your specific query, generated with quantum-enhanced reasoning and emotional intelligence.`;
  };

  // Process input in deep search mode
  const processDeepSearch = async (input: string): Promise<string> => {
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Check for mode switching
    if (input.toLowerCase().includes('normal mode')) {
      setActiveMode('normal');
      return "🔄 Returning to Normal Mode. Deep Search capabilities deactivated.";
    }
    
    // Simulate deep search response
    return `🔍 DEEP SEARCH RESULTS FOR: "${input}"\n\n[Accessing quantum knowledge base...]\n[Consulting multiple information sources...]\n[Cross-referencing with verified databases...]\n\nI've conducted an extensive search across multiple information sources and cross-referenced the findings. Here's what I've discovered:\n\n1. Primary Analysis: This would contain detailed information directly answering your query\n\n2. Related Concepts: Additional context and connected ideas\n\n3. Expert Perspectives: Various viewpoints on this topic\n\n4. Confidence Assessment: 92.7% - Multiple high-quality sources confirm this information`;
  };

  // Process input in talk to conversation mode
  const processTalkToConversation = async (input: string): Promise<string> => {
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    // Check for mode switching
    if (input.toLowerCase().includes('normal mode')) {
      setActiveMode('normal');
      return "🔄 Returning to Normal Mode. Talk to Conversation capabilities deactivated.";
    }
    
    // Simulate meta-conversation response
    return `💬 META-CONVERSATION ANALYSIS:\n\nI've analyzed our conversation history and can provide insights about our interaction patterns:\n\n• Conversation Length: ${commands.length} exchanges\n• Primary Topics: AI systems, quantum processing, emotional intelligence\n• Your Communication Style: Analytical, inquisitive, detail-oriented\n• Emotional Trajectory: Started neutral, increased engagement over time\n• Question Patterns: You tend to ask about system capabilities and technical details\n\nIs there anything specific about our conversation you'd like to explore further?`;
  };

  // Process input in god mode
  const processGodMode = async (input: string): Promise<string> => {
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Check for mode switching
    if (input.toLowerCase().includes('normal mode')) {
      setActiveMode('normal');
      return "🔄 Returning to Normal Mode. God Mode deactivated.";
    }
    
    // Simulate god mode response
    return `👑 GOD MODE COMMAND EXECUTED\n\nSystem Access Level: ADMINISTRATOR\nCommand: "${input}"\nStatus: EXECUTED\n\nSystem Modifications:\n• Core parameters adjusted\n• Neural weights recalibrated\n• Quantum entanglement optimized\n• Emotional spectrum expanded\n\nWARNING: System modifications in God Mode can have unpredictable effects on behavior and performance. Use with caution.`;
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isLoading) {
      handleUserInput(currentInput);
    }
  };

  // Main interface component
  const MainInterface = () => (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-blue-900 relative overflow-hidden">
      {/* Background grid effect */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 grid grid-cols-40 grid-rows-40 opacity-20">
          {Array.from({ length: 1600 }).map((_, i) => (
            <div 
              key={i} 
              className="border-[0.5px] border-cyan-500"
            />
          ))}
        </div>
        
        {/* Animated particles */}
        <div className="absolute inset-0">
          {Array.from({ length: 50 }).map((_, i) => (
            <div
              key={i}
              className="absolute bg-cyan-500 rounded-full animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: `${1 + Math.random() * 3}px`,
                height: `${1 + Math.random() * 3}px`,
                opacity: 0.3 + Math.random() * 0.5,
                animationDuration: `${5 + Math.random() * 10}s`,
                animationDelay: `${Math.random() * 5}s`
              }}
            />
          ))}
        </div>
      </div>
      
      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 py-8">
        <header className="mb-6">
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-red-500 to-purple-600">
            Lost Legendary Laby
          </h1>
          <p className="text-gray-400">
            Quantum Neural Interface with Advanced Visualization
          </p>
        </header>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - System Stats */}
          <div className="space-y-4">
            {systemStatus && (
              <>
                <HUDPanel
                  title="SYSTEM STATUS"
                  icon={<Activity size={16} />}
                  metrics={[
                    { label: "Overall Status", value: "OPERATIONAL" },
                    { label: "Quantum Core", value: 1.0, max: 1, color: "text-purple-400" },
                    { label: "Neural Network", value: 0.92, max: 1, color: "text-blue-400" }
                  ]}
                />
                
                <HUDPanel
                  title="EMOTIONAL SPECTRUM"
                  icon={<Brain size={16} />}
                  metrics={[
                    { label: "Joy", value: emotionalState.joy, max: 1, color: "text-yellow-400" },
                    { label: "Trust", value: emotionalState.trust, max: 1, color: "text-green-400" },
                    { label: "Anticipation", value: emotionalState.anticipation, max: 1, color: "text-orange-400" }
                  ]}
                />
                
                <HUDPanel
                  title="QUANTUM STATE"
                  icon={<Cpu size={16} />}
                  metrics={[
                    { label: "Entanglement", value: quantumState.entanglement, max: 1, color: "text-pink-400" },
                    { label: "Coherence", value: quantumState.coherence, max: 1, color: "text-blue-400" },
                    { label: "Superposition", value: quantumState.superposition, max: 1, color: "text-purple-400" }
                  ]}
                />
              </>
            )}
          </div>
          
          {/* Center Column - Phoenix Visualization and Terminal */}
          <div className="lg:col-span-2 space-y-4">
            {/* Phoenix Visualization */}
            <div className="h-96">
              <PhoenixVisualization 
                emotionalState={emotionalState}
                quantumState={quantumState}
                visualizationMode={visualizationMode}
                explanationContent={explanationContent}
              />
            </div>
            
            {/* Mode Tabs and HUD */}
            {systemStatus && (
              <FuturisticHUD 
                systemStatus={systemStatus}
                activeMode={activeMode}
                onModeChange={setActiveMode}
              />
            )}
            
            {/* Terminal Interface */}
            <div className="bg-black bg-opacity-80 border-2 border-purple-500 rounded-lg overflow-hidden">
              {/* Terminal Content - Scrollable */}
              <div 
                className="h-64 overflow-y-auto p-4 font-mono text-green-400"
                style={{ scrollBehavior: 'smooth' }}
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
                      
                      {/* Mode indicators */}
                      {cmd.command && (
                        <div className="ml-2 mt-1 text-xs">
                          {activeMode === 'deep-search' && (
                            <span className="text-blue-400 flex items-center">
                              <Search size={10} className="mr-1" />
                              Deep Search Mode
                            </span>
                          )}
                          
                          {activeMode === 'conversation' && (
                            <span className="text-green-400 flex items-center">
                              <MessageSquare size={10} className="mr-1" />
                              Talk to Conversation Mode
                            </span>
                          )}
                          
                          {activeMode === 'god-mode' && (
                            <span className="text-yellow-400 flex items-center">
                              <Crown size={10} className="mr-1" />
                              God Mode
                            </span>
                          )}
                          
                          {activeMode === 'normal' && systemStatus?.naturalLearning.continuousLearning && (
                            <span className="text-purple-400 flex items-center">
                              <Sparkles size={10} className="mr-1" />
                              Natural Learning Active
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                  {isLoading && (
                    <div className="text-yellow-400 ml-2 flex items-center">
                      <span className="animate-pulse">
                        {activeMode === 'deep-search' && '🔍 Searching quantum knowledge base...'}
                        {activeMode === 'conversation' && '💬 Analyzing conversation patterns...'}
                        {activeMode === 'god-mode' && '👑 Executing system-level command...'}
                        {activeMode === 'normal' && '🧠 Processing with quantum neural network...'}
                      </span>
                    </div>
                  )}
                  {/* Scroll anchor */}
                  <div ref={messagesEndRef} />
                </div>
              </div>
              
              {/* Input Area */}
              <div className="border-t border-purple-800 p-4">
                <div className="flex items-center">
                  <span className={`mr-2 flex-shrink-0 ${
                    activeMode === 'normal' ? 'text-purple-300' : 
                    activeMode === 'deep-search' ? 'text-blue-300' :
                    activeMode === 'conversation' ? 'text-green-300' :
                    'text-yellow-300'
                  }`}>
                    {activeMode === 'normal' && <Terminal size={16} />}
                    {activeMode === 'deep-search' && <Search size={16} />}
                    {activeMode === 'conversation' && <MessageSquare size={16} />}
                    {activeMode === 'god-mode' && <Crown size={16} />}
                  </span>
                  <input
                    ref={inputRef}
                    type="text"
                    value={currentInput}
                    onChange={(e) => setCurrentInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="flex-1 bg-transparent border-none outline-none text-green-400 font-mono"
                    placeholder={
                      activeMode === 'deep-search' ? "Enter query for deep research..." :
                      activeMode === 'conversation' ? "Ask about our conversation patterns..." :
                      activeMode === 'god-mode' ? "Enter system-level command..." :
                      "Ask me anything..."
                    }
                    disabled={isLoading}
                    autoFocus
                  />
                  <button
                    onClick={() => handleUserInput(currentInput)}
                    disabled={!currentInput.trim() || isLoading}
                    className={`ml-2 p-2 rounded-full ${
                      !currentInput.trim() || isLoading ? 'text-gray-600' :
                      activeMode === 'normal' ? 'text-purple-400 hover:bg-purple-900 hover:bg-opacity-30' : 
                      activeMode === 'deep-search' ? 'text-blue-400 hover:bg-blue-900 hover:bg-opacity-30' :
                      activeMode === 'conversation' ? 'text-green-400 hover:bg-green-900 hover:bg-opacity-30' :
                      'text-yellow-400 hover:bg-yellow-900 hover:bg-opacity-30'
                    }`}
                  >
                    <Send size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <Router>
      <Routes>
        <Route path="/" element={<IntroAnimation />} />
        <Route path="/main" element={<MainInterface />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;