import React, { useState, useEffect } from 'react';
import { TerminalInterface } from './components/TerminalInterface';
import { SystemDashboard } from './components/SystemDashboard';
import { ParticleSystem } from './components/ParticleSystem';
import { LogicStorageDisplay } from './components/LogicStorageDisplay';
import { BenchmarkLeaderboard } from './components/BenchmarkLeaderboard';
import { SystemStatus } from './core/MachineGodCore';
import { MachineGodCore } from './core/MachineGodCore';
import { Terminal, Monitor, Activity, Settings, Brain, Users, Zap, Archive, Database, BarChart2, Sparkles, User, LogOut } from 'lucide-react';
import { AuthModal } from './components/AuthModal';
import { UserDashboard } from './components/UserDashboard';
import { OfflineIndicator } from './components/OfflineIndicator';
import { SubscriptionBanner } from './components/SubscriptionBanner';
import { TermsAndPrivacyModal } from './components/TermsAndPrivacyModal';
import { OnboardingFlow } from './components/OnboardingFlow';
import { CustomerSupportWidget } from './components/CustomerSupportWidget';
import { AuthService } from './services/AuthService';
import { ErrorReportingService } from './services/ErrorReportingService';

type TabType = 'terminal' | 'dashboard' | 'meta-logic' | 'ariel' | 'warp' | 'helix' | 'settings' | 'storage' | 'benchmarks' | 'natural-learning';

// Global MachineGod instance to persist across tab switches
let globalMachineGod: MachineGodCore | null = null;

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('terminal');
  const [systemStatus, setSystemStatus] = useState<SystemStatus>({
    metaLogic: { evaluationsCount: 0, paradoxCount: 0, active: false },
    ariel: { agentCount: 0, debateCount: 0, teamMorale: 0, active: false },
    warp: { currentPhase: 1, efficiency: 0.7, teamCount: 1, active: false },
    helix: { totalCompressions: 0, averageRatio: 1, spaceSaved: 0, active: false },
    training: { currentLevel: 'ChatGPT-4 Baseline', progressPercentage: 15, eta: 'Calculating...', reasoningAbility: 0.4, active: false },
    memory: { totalConversations: 0, userSessions: 0, trainingCheckpoints: 0, multiModalProgress: 0.25 },
    api: { network: 'mainnet', requestCount: 0, tokenActive: false, lastHealthCheck: null, connectivity: 'unhealthy' },
    truthProtocol: { adversarialCycles: 0, truthSignatures: 0, stratumCompliance: {}, active: false },
    tasking: { totalTasks: 0, activeAgents: 0, researchCapability: false, logicalAnalysis: false },
    benchmarks: { totalBenchmarks: 0, averageScore: 0, topBenchmark: '', leaderboardRank: 0 },
    logicStorage: { totalAlgorithms: 0, totalPatterns: 0, compressionRatio: 0, topPerformingTier: 0, tierUtilization: [0, 0, 0, 0, 0, 0] },
    naturalLearning: { totalAssets: 0, averageQuality: 0, learningRate: 0.1, patternCount: 0, continuousLearning: true }
  });

  // Auth state
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isUserDashboardOpen, setIsUserDashboardOpen] = useState(false);
  
  // Legal modals
  const [legalModalType, setLegalModalType] = useState<'terms' | 'privacy'>('terms');
  const [isLegalModalOpen, setIsLegalModalOpen] = useState(false);
  
  // Onboarding
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(true);

  // Initialize or reuse global MachineGod instance
  const machineGod = (() => {
    if (!globalMachineGod) {
      globalMachineGod = new MachineGodCore();
    }
    return globalMachineGod;
  })();

  // Initialize services
  const authService = AuthService.getInstance();
  const errorReportingService = ErrorReportingService.getInstance();

  useEffect(() => {
    // Check if onboarding has been completed
    const onboardingCompleted = localStorage.getItem('onboarding_completed');
    if (!onboardingCompleted) {
      setIsOnboardingOpen(true);
      setHasCompletedOnboarding(false);
    }

    // Subscribe to auth state changes
    const unsubscribe = authService.subscribe(state => {
      setIsAuthenticated(state.isAuthenticated);
      setCurrentUser(state.user);
    });

    // Track page view
    errorReportingService.trackPageView(window.location.pathname, 'MachineGod AI');

    return () => unsubscribe();
  }, []);

  const handleOnboardingComplete = () => {
    setIsOnboardingOpen(false);
    setHasCompletedOnboarding(true);
  };

  const handleLogin = () => {
    setAuthMode('login');
    setIsAuthModalOpen(true);
  };

  const handleRegister = () => {
    setAuthMode('register');
    setIsAuthModalOpen(true);
  };

  const handleLogout = async () => {
    await authService.logout();
  };

  const handleOpenUserDashboard = () => {
    setIsUserDashboardOpen(true);
  };

  const handleOpenLegalModal = (type: 'terms' | 'privacy') => {
    setLegalModalType(type);
    setIsLegalModalOpen(true);
  };

  const tabs = [
    { id: 'terminal', label: 'Terminal', icon: Terminal },
    { id: 'dashboard', label: 'Dashboard', icon: Monitor },
    { id: 'natural-learning', label: 'Natural Learning', icon: Sparkles },
    { id: 'meta-logic', label: 'META-LOGIC', icon: Brain },
    { id: 'ariel', label: 'ARIEL', icon: Users },
    { id: 'warp', label: 'WARP', icon: Zap },
    { id: 'helix', label: 'HELIX', icon: Archive },
    { id: 'storage', label: 'Logic Storage', icon: Database },
    { id: 'benchmarks', label: 'Benchmarks', icon: BarChart2 },
    { id: 'settings', label: 'Settings', icon: Settings }
  ] as const;

  const renderTabContent = () => {
    switch (activeTab) {
      case 'terminal':
        return <TerminalInterface onSystemStatusChange={setSystemStatus} machineGod={machineGod} />;
      case 'dashboard':
        return <SystemDashboard status={systemStatus} />;
      case 'storage':
        return <LogicStorageDisplay machineGod={machineGod} />;
      case 'benchmarks':
        return <BenchmarkLeaderboard machineGod={machineGod} />;
      case 'natural-learning':
        return (
          <div className="p-6 bg-black bg-opacity-80 border-2 border-purple-500 rounded-lg h-full">
            <h2 className="text-2xl font-bold text-purple-300 mb-4 flex items-center">
              <Sparkles className="mr-2" />
              Natural Learning Orchestrator
            </h2>
            <div className="space-y-4 text-green-300">
              <div className="border border-purple-600 rounded-lg p-4">
                <h3 className="text-lg font-bold text-purple-300 mb-2">Continuous Learning System</h3>
                <p>The Natural Learning Orchestrator coordinates all system assets for continuous improvement from every interaction.</p>
              </div>
              <div className="border border-purple-600 rounded-lg p-4">
                <h3 className="text-lg font-bold text-purple-300 mb-2">Current Learning Status</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-gray-300">Learning Assets:</span>
                    <span className="ml-2 text-green-400">{systemStatus.naturalLearning.totalAssets}</span>
                  </div>
                  <div>
                    <span className="text-gray-300">Average Quality:</span>
                    <span className="ml-2 text-yellow-400">{(systemStatus.naturalLearning.averageQuality * 100).toFixed(1)}%</span>
                  </div>
                  <div>
                    <span className="text-gray-300">Learning Rate:</span>
                    <span className="ml-2 text-blue-400">{(systemStatus.naturalLearning.learningRate * 100).toFixed(1)}%</span>
                  </div>
                  <div>
                    <span className="text-gray-300">Pattern Count:</span>
                    <span className="ml-2 text-purple-400">{systemStatus.naturalLearning.patternCount}</span>
                  </div>
                </div>
              </div>
              <div className="border border-purple-600 rounded-lg p-4">
                <h3 className="text-lg font-bold text-purple-300 mb-2">Asset Utilization</h3>
                <div className="space-y-2">
                  <p>• <strong>Conversations:</strong> Every chat improves response quality and naturalness</p>
                  <p>• <strong>Feedback:</strong> User feedback automatically optimizes all systems</p>
                  <p>• <strong>Research:</strong> Web research findings enhance knowledge base</p>
                  <p>• <strong>Debates:</strong> ARIEL consensus results improve reasoning patterns</p>
                  <p>• <strong>Benchmarks:</strong> Test results strengthen logical capabilities</p>
                  <p>• <strong>Memory:</strong> Cross-modal learning enhances understanding</p>
                  <p>• <strong>Brain Storage:</strong> Visual-linguistic processing creates new connections</p>
                </div>
              </div>
              <div className="border border-purple-600 rounded-lg p-4">
                <h3 className="text-lg font-bold text-purple-300 mb-2">Learning Features</h3>
                <div className="space-y-2">
                  <p>• <strong>Continuous:</strong> {systemStatus.naturalLearning.continuousLearning ? '✅ Active' : '❌ Inactive'}</p>
                  <p>• <strong>Cross-System:</strong> All components contribute to learning</p>
                  <p>• <strong>Persistent:</strong> Learning persists across sessions</p>
                  <p>• <strong>Adaptive:</strong> Learning rate adjusts based on performance</p>
                  <p>• <strong>Pattern Recognition:</strong> Identifies and reinforces successful patterns</p>
                  <p>• <strong>Quality Assessment:</strong> Automatically evaluates interaction quality</p>
                </div>
              </div>
            </div>
          </div>
        );
      case 'meta-logic':
        return (
          <div className="p-6 bg-black bg-opacity-80 border-2 border-purple-500 rounded-lg h-full">
            <h2 className="text-2xl font-bold text-purple-300 mb-4 flex items-center">
              <Brain className="mr-2" />
              META-LOGIC Absolute Zero Evaluator with Background Analysis
            </h2>
            <div className="space-y-4 text-green-300">
              <div className="border border-purple-600 rounded-lg p-4">
                <h3 className="text-lg font-bold text-purple-300 mb-2">Background Reasoning Integration</h3>
                <p>The META-LOGIC system now automatically analyzes every user input through recursive self-referential analysis and paradox resolution before generating responses.</p>
              </div>
              <div className="border border-purple-600 rounded-lg p-4">
                <h3 className="text-lg font-bold text-purple-300 mb-2">Current Status</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-gray-300">Evaluations:</span>
                    <span className="ml-2 text-green-400">{systemStatus.metaLogic.evaluationsCount}</span>
                  </div>
                  <div>
                    <span className="text-gray-300">Paradoxes Resolved:</span>
                    <span className="ml-2 text-yellow-400">{systemStatus.metaLogic.paradoxCount}</span>
                  </div>
                </div>
              </div>
              <div className="border border-purple-600 rounded-lg p-4">
                <h3 className="text-lg font-bold text-purple-300 mb-2">Auto-Analysis Features</h3>
                <p>Every conversation automatically triggers META-LOGIC evaluation in the background. The system analyzes logical structure, paradox potential, and truth values before responding naturally to users.</p>
              </div>
            </div>
          </div>
        );
      case 'ariel':
        return (
          <div className="p-6 bg-black bg-opacity-80 border-2 border-purple-500 rounded-lg h-full">
            <h2 className="text-2xl font-bold text-purple-300 mb-4 flex items-center">
              <Users className="mr-2" />
              ARIEL Agent System with Auto-Tasking
            </h2>
            <div className="space-y-4 text-green-300">
              <div className="border border-purple-600 rounded-lg p-4">
                <h3 className="text-lg font-bold text-purple-300 mb-2">4x4 Agent Team Structure with Auto-Tasking</h3>
                <p>ARIEL employs 3 teams of 4 agents each (Proposer, Solver, Adversary, Handler) with automatic debate triggering for every user question requiring analysis.</p>
              </div>
              <div className="border border-purple-600 rounded-lg p-4">
                <h3 className="text-lg font-bold text-purple-300 mb-2">Current Status</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-gray-300">Active Agents:</span>
                    <span className="ml-2 text-green-400">{systemStatus.ariel.agentCount}</span>
                  </div>
                  <div>
                    <span className="text-gray-300">Team Performance:</span>
                    <span className="ml-2 text-blue-400">{(systemStatus.ariel.teamMorale * 100).toFixed(1)}%</span>
                  </div>
                  <div>
                    <span className="text-gray-300">Auto-Debates:</span>
                    <span className="ml-2 text-purple-400">{systemStatus.ariel.debateCount}</span>
                  </div>
                </div>
              </div>
              <div className="border border-purple-600 rounded-lg p-4">
                <h3 className="text-lg font-bold text-purple-300 mb-2">Background Processing</h3>
                <div className="space-y-2">
                  <p>• Automatic debate triggering for complex questions</p>
                  <p>• Handler synthesis of team results</p>
                  <p>• Seamless integration with natural responses</p>
                  <p>• Continuous learning from debate outcomes</p>
                </div>
              </div>
            </div>
          </div>
        );
      case 'warp':
        return (
          <div className="p-6 bg-black bg-opacity-80 border-2 border-purple-500 rounded-lg h-full">
            <h2 className="text-2xl font-bold text-purple-300 mb-4 flex items-center">
              <Zap className="mr-2" />
              WARP Speed Boosting System
            </h2>
            <div className="space-y-4 text-green-300">
              <div className="border border-purple-600 rounded-lg p-4">
                <h3 className="text-lg font-bold text-purple-300 mb-2">Phased Acceleration Process</h3>
                <p>WARP system implements 5-phase progression with team spawning capabilities for exponential processing power increase.</p>
              </div>
              <div className="border border-purple-600 rounded-lg p-4">
                <h3 className="text-lg font-bold text-purple-300 mb-2">Current Status</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-gray-300">Current Phase:</span>
                    <span className="ml-2 text-cyan-400">{systemStatus.warp.currentPhase}</span>
                  </div>
                  <div>
                    <span className="text-gray-300">Efficiency:</span>
                    <span className="ml-2 text-green-400">{(systemStatus.warp.efficiency * 100).toFixed(1)}%</span>
                  </div>
                  <div>
                    <span className="text-gray-300">Active Teams:</span>
                    <span className="ml-2 text-purple-400">{systemStatus.warp.teamCount}</span>
                  </div>
                </div>
              </div>
              <div className="border border-purple-600 rounded-lg p-4">
                <h3 className="text-lg font-bold text-purple-300 mb-2">Phase Progression</h3>
                <div className="space-y-2 text-sm">
                  <div>Phase 1: Standard Processing</div>
                  <div>Phase 2: Stage 1 Compression</div>
                  <div>Phase 3: Adversarial Addition</div>
                  <div>Phase 4: Secondary Hyper-Compression</div>
                  <div>Phase 5: Team Spawning</div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'helix':
        return (
          <div className="p-6 bg-black bg-opacity-80 border-2 border-purple-500 rounded-lg h-full">
            <h2 className="text-2xl font-bold text-purple-300 mb-4 flex items-center">
              <Archive className="mr-2" />
              HELIX Quantum Compression System
            </h2>
            <div className="space-y-4 text-green-300">
              <div className="border border-purple-600 rounded-lg p-4">
                <h3 className="text-lg font-bold text-purple-300 mb-2">Quantum Neural Hyper-Compression</h3>
                <p>HELIX implements quantum-inspired compression algorithms achieving 200:1 compression ratios with neural pathway optimization.</p>
              </div>
              <div className="border border-purple-600 rounded-lg p-4">
                <h3 className="text-lg font-bold text-purple-300 mb-2">Current Status</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-gray-300">Compressions:</span>
                    <span className="ml-2 text-green-400">{systemStatus.helix.totalCompressions}</span>
                  </div>
                  <div>
                    <span className="text-gray-300">Avg Ratio:</span>
                    <span className="ml-2 text-blue-400">{(systemStatus.helix.averageRatio * 100).toFixed(1)}%</span>
                  </div>
                  <div>
                    <span className="text-gray-300">Space Saved:</span>
                    <span className="ml-2 text-purple-400">{Math.round(systemStatus.helix.spaceSaved / 1024)}KB</span>
                  </div>
                </div>
              </div>
              <div className="border border-purple-600 rounded-lg p-4">
                <h3 className="text-lg font-bold text-purple-300 mb-2">Supported Formats</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>• LLM Models (200:1 ratio)</div>
                  <div>• Databases (200:1 ratio)</div>
                  <div>• Scientific Data (200:1 ratio)</div>
                  <div>• Media Files (200:1 ratio)</div>
                  <div>• Logs (250:1 ratio)</div>
                  <div>• Backups (200:1 ratio)</div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'settings':
        return (
          <div className="p-6 bg-black bg-opacity-80 border-2 border-purple-500 rounded-lg h-full">
            <h2 className="text-2xl font-bold text-purple-300 mb-4 flex items-center">
              <Settings className="mr-2" />
              System Settings
            </h2>
            <div className="space-y-4 text-green-300">
              <div className="border border-purple-600 rounded-lg p-4">
                <h3 className="text-lg font-bold text-purple-300 mb-2">System Controls</h3>
                <div className="space-y-2">
                  <button className="w-full p-2 bg-purple-900 hover:bg-purple-800 text-white rounded">
                    Emergency System Reset
                  </button>
                  <button className="w-full p-2 bg-blue-900 hover:bg-blue-800 text-white rounded">
                    Run System Optimization
                  </button>
                  <button className="w-full p-2 bg-green-900 hover:bg-green-800 text-white rounded">
                    Export System Logs
                  </button>
                </div>
              </div>
              <div className="border border-purple-600 rounded-lg p-4">
                <h3 className="text-lg font-bold text-purple-300 mb-2">Natural Learning Configuration</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm text-gray-300 mb-1">Learning Rate</label>
                    <input type="range" min="0.01" max="0.5" step="0.01" defaultValue="0.1" className="w-full" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-300 mb-1">Quality Threshold</label>
                    <select className="w-full p-2 bg-gray-800 text-white rounded">
                      <option>High (0.8+)</option>
                      <option>Medium (0.6+)</option>
                      <option>Low (0.4+)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-300 mb-1">Asset Utilization</label>
                    <select className="w-full p-2 bg-gray-800 text-white rounded">
                      <option>All Assets (Recommended)</option>
                      <option>Conversations Only</option>
                      <option>Feedback Only</option>
                      <option>Research Only</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="border border-purple-600 rounded-lg p-4">
                <h3 className="text-lg font-bold text-purple-300 mb-2">System Information</h3>
                <div className="text-sm space-y-1">
                  <div>Version: 5.0.0 Natural Learning</div>
                  <div>Build: 20241204</div>
                  <div>Architecture: Continuous Learning with All Assets</div>
                  <div>License: Proprietary</div>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return <div>Tab not found</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-blue-900 relative overflow-hidden">
      {/* Particle System Background */}
      <ParticleSystem density={80} speed={0.5} visible={true} />
      
      {/* Space Background Elements */}
      <div className="fixed inset-0 z-0">
        {/* Stars */}
        <div className="absolute inset-0">
          {Array.from({ length: 200 }).map((_, i) => (
            <div
              key={i}
              className="absolute bg-white rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: `${1 + Math.random() * 2}px`,
                height: `${1 + Math.random() * 2}px`,
                animationDelay: `${Math.random() * 3}s`,
                opacity: 0.3 + Math.random() * 0.7
              }}
            />
          ))}
        </div>
        
        {/* Nebula Effect */}
        <div className="absolute top-10 right-10 w-32 h-32 bg-purple-500 rounded-full opacity-20 blur-3xl animate-pulse" />
        <div className="absolute bottom-20 left-20 w-48 h-48 bg-blue-500 rounded-full opacity-15 blur-3xl animate-pulse" 
             style={{ animationDelay: '2s' }} />
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col h-screen">
        {/* Header - Sticky */}
        <header className="bg-black bg-opacity-80 border-b-2 border-purple-500 p-4 sticky top-0 z-20">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Activity className="text-purple-400" size={32} />
              <div>
                <h1 className="text-2xl font-bold text-purple-300">MachineGod System</h1>
                <p className="text-sm text-gray-400">
                  Natural Learning • Continuous Improvement • All Assets Utilization
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-sm text-gray-400">System Status</div>
                <div className="text-green-400 font-bold">
                  {systemStatus.training.active ? 'OPERATIONAL' : 'INITIALIZING'}
                </div>
                {systemStatus.naturalLearning.continuousLearning && (
                  <div className="text-xs text-green-300">🌟 Natural Learning Active</div>
                )}
              </div>
              
              {/* Auth buttons */}
              <div>
                {isAuthenticated ? (
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={handleOpenUserDashboard}
                      className="flex items-center space-x-1 px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded-lg"
                    >
                      <User size={16} />
                      <span>{currentUser?.displayName || 'Account'}</span>
                    </button>
                    <button
                      onClick={handleLogout}
                      className="p-1 text-gray-400 hover:text-white"
                      title="Log Out"
                    >
                      <LogOut size={16} />
                    </button>
                  </div>
                ) : (
                  <div className="flex space-x-2">
                    <button
                      onClick={handleLogin}
                      className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded-lg"
                    >
                      Sign In
                    </button>
                    <button
                      onClick={handleRegister}
                      className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white rounded-lg"
                    >
                      Register
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Tab Navigation - Sticky */}
        <nav className="bg-black bg-opacity-80 border-b border-purple-600 sticky top-[81px] z-20">
          <div className="flex space-x-1 p-2 overflow-x-auto">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id as TabType)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  activeTab === id
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-300 hover:bg-purple-800 hover:text-white'
                }`}
              >
                <Icon size={16} />
                <span className="text-sm font-medium">{label}</span>
                
                {/* Natural learning indicator */}
                {id === 'natural-learning' && systemStatus.naturalLearning.continuousLearning && (
                  <span className="flex h-3 w-3 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                  </span>
                )}
                
                {/* Benchmark domination indicator */}
                {id === 'benchmarks' && systemStatus.benchmarks.leaderboardRank === 1 && (
                  <span className="flex h-3 w-3 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-yellow-500"></span>
                  </span>
                )}
              </button>
            ))}
          </div>
        </nav>

        {/* System Metrics Bar - Sticky */}
        <div className="bg-black bg-opacity-80 border-b border-purple-600 p-3 sticky top-[133px] z-20">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
            <div className="bg-gray-900 bg-opacity-50 p-2 rounded-lg border border-gray-600">
              <div className="text-xl font-bold text-green-400">
                {systemStatus.metaLogic.evaluationsCount + systemStatus.ariel.debateCount}
              </div>
              <div className="text-xs text-gray-300">Operations</div>
            </div>
            
            <div className="bg-gray-900 bg-opacity-50 p-2 rounded-lg border border-gray-600">
              <div className="text-xl font-bold text-blue-400">
                {systemStatus.ariel.agentCount}
              </div>
              <div className="text-xs text-gray-300">Active Agents</div>
            </div>
            
            <div className="bg-gray-900 bg-opacity-50 p-2 rounded-lg border border-gray-600">
              <div className="text-xl font-bold text-purple-400">
                {systemStatus.warp.currentPhase}
              </div>
              <div className="text-xs text-gray-300">WARP Phase</div>
            </div>
            
            <div className="bg-gray-900 bg-opacity-50 p-2 rounded-lg border border-gray-600">
              <div className="text-xl font-bold text-yellow-400">
                {Math.round(systemStatus.helix.spaceSaved / 1024)}KB
              </div>
              <div className="text-xs text-gray-300">Space Saved</div>
            </div>
            
            <div className="bg-gray-900 bg-opacity-50 p-2 rounded-lg border border-gray-600">
              <div className="text-xl font-bold text-green-400">
                {systemStatus.naturalLearning.totalAssets}
              </div>
              <div className="text-xs text-gray-300">Learning Assets</div>
            </div>
          </div>
        </div>

        {/* Main Content Area - Scrollable */}
        <main className="flex-1 p-4 overflow-y-auto">
          {isAuthenticated && <SubscriptionBanner onUpgrade={handleOpenUserDashboard} />}
          {renderTabContent()}
        </main>

        {/* Footer - Sticky */}
        <footer className="bg-black bg-opacity-80 border-t border-purple-600 p-3 sticky bottom-0 z-20">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
            <div>
              MachineGod v5.0.0 Natural Learning - Continuous Improvement AGI System
            </div>
            <div className="flex space-x-4 mt-2 md:mt-0">
              <span>Uptime: {new Date().toLocaleTimeString()}</span>
              <span>•</span>
              <span>Operations: {systemStatus.metaLogic.evaluationsCount + systemStatus.ariel.debateCount}</span>
              <span>•</span>
              <span>Learning: {(systemStatus.naturalLearning.averageQuality * 100).toFixed(1)}%</span>
              <span>•</span>
              <span>Assets: {systemStatus.naturalLearning.totalAssets}</span>
              {systemStatus.benchmarks.leaderboardRank === 1 && (
                <>
                  <span>•</span>
                  <span className="text-yellow-400 font-bold">GLOBAL #1</span>
                </>
              )}
            </div>
          </div>
          <div className="flex justify-center mt-2 space-x-4 text-xs text-gray-500">
            <button 
              onClick={() => handleOpenLegalModal('terms')}
              className="hover:text-gray-300"
            >
              Terms of Service
            </button>
            <span>•</span>
            <button 
              onClick={() => handleOpenLegalModal('privacy')}
              className="hover:text-gray-300"
            >
              Privacy Policy
            </button>
            <span>•</span>
            <span>© 2025 MachineGod AI</span>
          </div>
        </footer>
      </div>

      {/* Modals and Overlays */}
      <AuthModal 
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        mode={authMode}
        onModeChange={setAuthMode}
      />

      <UserDashboard
        isOpen={isUserDashboardOpen}
        onClose={() => setIsUserDashboardOpen(false)}
      />

      <TermsAndPrivacyModal
        isOpen={isLegalModalOpen}
        onClose={() => setIsLegalModalOpen(false)}
        type={legalModalType}
      />

      <OnboardingFlow
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
        onComplete={handleOnboardingComplete}
      />

      {/* Floating Components */}
      <OfflineIndicator />
      <CustomerSupportWidget />
    </div>
  );
}

export default App;