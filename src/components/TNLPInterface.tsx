import React, { useState, useEffect, useRef } from 'react';
import { Brain, Zap, Activity, BarChart2, RefreshCw, AlertTriangle } from 'lucide-react';
import { TNLPSystem } from '../core/TNLPSystem';

interface TNLPInterfaceProps {
  onStatusChange?: (status: any) => void;
}

export const TNLPInterface: React.FC<TNLPInterfaceProps> = ({ onStatusChange }) => {
  const [tnlpSystem, setTnlpSystem] = useState<TNLPSystem | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentInput, setCurrentInput] = useState('');
  const [currentOutput, setCurrentOutput] = useState('');
  const [systemStatus, setSystemStatus] = useState<any>(null);
  const [history, setHistory] = useState<Array<{input: string, output: string, timestamp: Date}>>([]);
  const [error, setError] = useState<string | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize TNLP system
  useEffect(() => {
    const initSystem = async () => {
      try {
        const system = new TNLPSystem();
        await system.initialize();
        setTnlpSystem(system);
        setIsInitialized(true);
        updateStatus(system);
      } catch (error) {
        console.error('Failed to initialize TNLP system:', error);
        setError('Failed to initialize TNLP system. Please try again.');
      }
    };

    initSystem();
  }, []);

  // Update status periodically
  useEffect(() => {
    if (!tnlpSystem) return;

    const intervalId = setInterval(() => {
      updateStatus(tnlpSystem);
    }, 5000);

    return () => clearInterval(intervalId);
  }, [tnlpSystem]);

  // Scroll to bottom when history updates
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [history]);

  const updateStatus = (system: TNLPSystem) => {
    const status = system.getStatus();
    setSystemStatus(status);
    if (onStatusChange) {
      onStatusChange(status);
    }
  };

  const handleSubmit = async () => {
    if (!tnlpSystem || !currentInput.trim() || isProcessing) return;

    setIsProcessing(true);
    setError(null);

    try {
      const output = await tnlpSystem.process(currentInput);
      
      // Add to history
      setHistory(prev => [...prev, {
        input: currentInput,
        output,
        timestamp: new Date()
      }]);
      
      setCurrentOutput(output);
      setCurrentInput('');
      
      // Update status
      updateStatus(tnlpSystem);
    } catch (error) {
      console.error('TNLP processing error:', error);
      setError('Failed to process input. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleForceNextPhase = async () => {
    if (!tnlpSystem) return;
    
    try {
      await tnlpSystem.forceNextPhase();
      updateStatus(tnlpSystem);
    } catch (error) {
      console.error('Failed to force next phase:', error);
      setError('Failed to force next phase. Please try again.');
    }
  };

  const handleReset = async () => {
    if (!tnlpSystem) return;
    
    try {
      await tnlpSystem.reset();
      setHistory([]);
      setCurrentOutput('');
      updateStatus(tnlpSystem);
    } catch (error) {
      console.error('Failed to reset TNLP system:', error);
      setError('Failed to reset TNLP system. Please try again.');
    }
  };

  const getPhaseColor = (phase: string) => {
    switch (phase) {
      case 'initialization': return 'text-gray-400';
      case 'scaffolding': return 'text-blue-400';
      case 'self_emulation': return 'text-yellow-400';
      case 'verification': return 'text-orange-400';
      case 'independent': return 'text-green-400';
      default: return 'text-gray-400';
    }
  };

  const getPhaseIcon = (phase: string) => {
    switch (phase) {
      case 'initialization': return <Activity size={16} />;
      case 'scaffolding': return <Brain size={16} />;
      case 'self_emulation': return <RefreshCw size={16} />;
      case 'verification': return <BarChart2 size={16} />;
      case 'independent': return <Zap size={16} />;
      default: return <Activity size={16} />;
    }
  };

  return (
    <div className="h-full flex flex-col bg-black bg-opacity-80 border-2 border-purple-500 rounded-lg overflow-hidden">
      {/* Status Header */}
      <div className="bg-gradient-to-r from-purple-900 to-blue-900 bg-opacity-40 border-b border-purple-600 p-3 flex-shrink-0">
        <div className="flex justify-between items-center text-sm mb-2">
          <span className="text-purple-300 flex items-center">
            <Brain className="mr-1" size={16} />
            TNLP System {isInitialized ? 'Online' : 'Initializing...'}
          </span>
          
          {systemStatus && (
            <span className={`flex items-center ${getPhaseColor(systemStatus.phase)}`}>
              {getPhaseIcon(systemStatus.phase)}
              <span className="ml-1">
                Phase: {systemStatus.phase.charAt(0).toUpperCase() + systemStatus.phase.slice(1)}
              </span>
            </span>
          )}
          
          {systemStatus && (
            <span className="text-green-300">
              Iterations: {systemStatus.iterations}
            </span>
          )}
          
          {systemStatus && (
            <span className="text-yellow-300">
              Representations: {systemStatus.representationCount}
            </span>
          )}
          
          {systemStatus && (
            <span className={systemStatus.scaffoldActive ? 'text-blue-300' : 'text-green-300'}>
              {systemStatus.scaffoldActive ? 'Scaffold Active' : 'Independent Mode'}
            </span>
          )}
        </div>
        
        {systemStatus && systemStatus.metrics && (
          <div className="bg-gray-700 rounded-full h-2">
            <div 
              className="h-2 rounded-full transition-all duration-1000 bg-gradient-to-r from-blue-500 via-purple-500 to-green-500"
              style={{ width: `${systemStatus.metrics.overallScore * 100}%` }}
            ></div>
          </div>
        )}
        
        {systemStatus && systemStatus.metrics && showAdvanced && (
          <div className="mt-2 grid grid-cols-5 gap-2 text-xs">
            <div className="text-center">
              <div className="text-gray-400">Fluency</div>
              <div className="text-blue-300">{(systemStatus.metrics.fluency * 100).toFixed(1)}%</div>
            </div>
            <div className="text-center">
              <div className="text-gray-400">Semantic</div>
              <div className="text-green-300">{(systemStatus.metrics.semanticAccuracy * 100).toFixed(1)}%</div>
            </div>
            <div className="text-center">
              <div className="text-gray-400">Reasoning</div>
              <div className="text-yellow-300">{(systemStatus.metrics.abstractReasoning * 100).toFixed(1)}%</div>
            </div>
            <div className="text-center">
              <div className="text-gray-400">Context</div>
              <div className="text-purple-300">{(systemStatus.metrics.contextAwareness * 100).toFixed(1)}%</div>
            </div>
            <div className="text-center">
              <div className="text-gray-400">Continuity</div>
              <div className="text-pink-300">{(systemStatus.metrics.continuity * 100).toFixed(1)}%</div>
            </div>
          </div>
        )}
        
        <div className="flex justify-end mt-1">
          <button 
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="text-xs text-gray-400 hover:text-white"
          >
            {showAdvanced ? 'Hide Details' : 'Show Details'}
          </button>
        </div>
      </div>

      {/* Conversation History */}
      <div className="flex-1 overflow-y-auto p-4 font-mono text-green-400">
        {history.length === 0 && !isProcessing && (
          <div className="text-gray-500 text-center mt-4">
            <Brain size={48} className="mx-auto mb-2 text-purple-400" />
            <p>TNLP system initialized. Enter a prompt to begin the bootstrapping process.</p>
            <p className="mt-2 text-sm">
              {systemStatus?.phase === 'scaffolding' ? 
                'Phase 1: Using LLaMA scaffold to build internal representations' :
                systemStatus?.phase === 'self_emulation' ?
                'Phase 2: Self-emulation in progress, learning from scaffold' :
                systemStatus?.phase === 'verification' ?
                'Phase 3: Verifying independent capabilities' :
                systemStatus?.phase === 'independent' ?
                'Phase 4: Fully independent TNLP system active' :
                'Initializing...'}
            </p>
          </div>
        )}
        
        {history.map((item, index) => (
          <div key={index} className="mb-4">
            <div className="text-purple-400 mb-2">
              <span className="text-purple-300">{'>'}</span> {item.input}
              <span className="text-xs text-gray-500 ml-2">
                {item.timestamp.toLocaleTimeString()}
              </span>
            </div>
            <div className="whitespace-pre-wrap text-green-300 ml-2 mb-2 break-words">
              {item.output}
            </div>
          </div>
        ))}
        
        {isProcessing && (
          <div className="text-yellow-400 ml-2 flex items-center">
            <span className="animate-pulse">
              {systemStatus?.scaffoldActive ? 
                '🧠 Processing with LLaMA scaffold...' : 
                '⚡ Processing with independent TNLP...'}
            </span>
          </div>
        )}
        
        {error && (
          <div className="text-red-400 ml-2 flex items-center mt-2">
            <AlertTriangle size={16} className="mr-2" />
            <span>{error}</span>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      {/* Input Area */}
      <div className="flex-shrink-0 border-t border-purple-800 p-4">
        <div className="flex items-center">
          <span className="text-purple-300 mr-2 flex-shrink-0">{'>'}</span>
          <input
            type="text"
            value={currentInput}
            onChange={(e) => setCurrentInput(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1 bg-transparent border-none outline-none text-green-400 font-mono"
            placeholder={
              systemStatus?.phase === 'independent' 
                ? "Enter prompt for independent TNLP system..." 
                : "Enter prompt to help bootstrap TNLP system..."
            }
            disabled={isProcessing || !isInitialized}
          />
          <span className="text-green-400 animate-pulse ml-2 flex-shrink-0">█</span>
        </div>
      </div>
      
      {/* Control Panel */}
      {showAdvanced && (
        <div className="flex-shrink-0 border-t border-purple-800 p-2 bg-gray-900 bg-opacity-50">
          <div className="flex justify-between">
            <button
              onClick={handleForceNextPhase}
              disabled={!isInitialized || isProcessing || systemStatus?.phase === 'independent'}
              className="px-3 py-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 text-white text-sm rounded"
            >
              Force Next Phase
            </button>
            
            <button
              onClick={handleReset}
              disabled={!isInitialized || isProcessing}
              className="px-3 py-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-700 text-white text-sm rounded"
            >
              Reset TNLP System
            </button>
          </div>
        </div>
      )}
    </div>
  );
};