import React, { useState } from 'react';
import { TerminalInterface } from './components/TerminalInterface';
import { SystemDashboard } from './components/SystemDashboard';
import { ParticleSystem } from './components/ParticleSystem';
import { SystemStatus } from './core/MachineGodCore';
import { Terminal, Monitor, Activity, Settings, Brain, Users, Zap, Archive } from 'lucide-react';

type TabType = 'terminal' | 'dashboard' | 'meta-logic' | 'ariel' | 'warp' | 'helix' | 'settings';

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('terminal');
  const [systemStatus, setSystemStatus] = useState<SystemStatus>({
    metaLogic: { evaluationsCount: 0, paradoxCount: 0, active: false },
    ariel: { agentCount: 0, debateCount: 0, teamMorale: 0, active: false },
    warp: { currentPhase: 1, efficiency: 0.7, teamCount: 1, active: false },
    helix: { totalCompressions: 0, averageRatio: 1, spaceSaved: 0, active: false }
  });

  const tabs = [
    { id: 'terminal', label: 'Terminal', icon: Terminal },
    { id: 'dashboard', label: 'Dashboard', icon: Monitor },
    { id: 'meta-logic', label: 'META-LOGIC', icon: Brain },
    { id: 'ariel', label: 'ARIEL', icon: Users },
    { id: 'warp', label: 'WARP', icon: Zap },
    { id: 'helix', label: 'HELIX', icon: Archive },
    { id: 'settings', label: 'Settings', icon: Settings }
  ] as const;

  const renderTabContent = () => {
    switch (activeTab) {
      case 'terminal':
        return <TerminalInterface onSystemStatusChange={setSystemStatus} />;
      case 'dashboard':
        return <SystemDashboard status={systemStatus} />;
      case 'meta-logic':
        return (
          <div className="p-6 bg-black bg-opacity-80 border-2 border-purple-500 rounded-lg h-full">
            <h2 className="text-2xl font-bold text-purple-300 mb-4 flex items-center">
              <Brain className="mr-2" />
              META-LOGIC Absolute Zero Evaluator
            </h2>
            <div className="space-y-4 text-green-300">
              <div className="border border-purple-600 rounded-lg p-4">
                <h3 className="text-lg font-bold text-purple-300 mb-2">Recursive Self-Referential Analysis</h3>
                <p>The META-LOGIC system employs recursive analysis to handle self-referential statements and paradoxes through multi-valued logic frameworks.</p>
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
                <h3 className="text-lg font-bold text-purple-300 mb-2">Usage</h3>
                <p>Use the Terminal tab to evaluate statements with the command:</p>
                <code className="block mt-2 p-2 bg-gray-900 rounded text-green-400">
                  evaluate &lt;your statement&gt;
                </code>
              </div>
            </div>
          </div>
        );
      case 'ariel':
        return (
          <div className="p-6 bg-black bg-opacity-80 border-2 border-purple-500 rounded-lg h-full">
            <h2 className="text-2xl font-bold text-purple-300 mb-4 flex items-center">
              <Users className="mr-2" />
              ARIEL Agent System
            </h2>
            <div className="space-y-4 text-green-300">
              <div className="border border-purple-600 rounded-lg p-4">
                <h3 className="text-lg font-bold text-purple-300 mb-2">3x3 Agent Team Structure</h3>
                <p>ARIEL employs 3 teams of 3 agents each (Proposer, Solver, Adversary) with hierarchical management and emotional intelligence.</p>
              </div>
              <div className="border border-purple-600 rounded-lg p-4">
                <h3 className="text-lg font-bold text-purple-300 mb-2">Current Status</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-gray-300">Active Agents:</span>
                    <span className="ml-2 text-green-400">{systemStatus.ariel.agentCount}</span>
                  </div>
                  <div>
                    <span className="text-gray-300">Team Morale:</span>
                    <span className="ml-2 text-blue-400">{(systemStatus.ariel.teamMorale * 100).toFixed(1)}%</span>
                  </div>
                  <div>
                    <span className="text-gray-300">Debates Conducted:</span>
                    <span className="ml-2 text-purple-400">{systemStatus.ariel.debateCount}</span>
                  </div>
                </div>
              </div>
              <div className="border border-purple-600 rounded-lg p-4">
                <h3 className="text-lg font-bold text-purple-300 mb-2">Commands</h3>
                <div className="space-y-2">
                  <code className="block p-2 bg-gray-900 rounded text-green-400">
                    debate &lt;problem&gt; - Conduct agent debate
                  </code>
                  <code className="block p-2 bg-gray-900 rounded text-green-400">
                    agents - List all agents
                  </code>
                  <code className="block p-2 bg-gray-900 rounded text-green-400">
                    morale - Check team morale
                  </code>
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
              HELIX Compression System
            </h2>
            <div className="space-y-4 text-green-300">
              <div className="border border-purple-600 rounded-lg p-4">
                <h3 className="text-lg font-bold text-purple-300 mb-2">Advanced Compression Technology</h3>
                <p>HELIX implements format-specific compression algorithms optimized for different data types with energy efficiency focus.</p>
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
                  <div>• LLM Models (.bin, .safetensors)</div>
                  <div>• Databases (.db, .sqlite)</div>
                  <div>• Scientific Data (.csv, .json)</div>
                  <div>• Media Files (.mp4, .mp3)</div>
                  <div>• Logs (.log, .txt)</div>
                  <div>• Backups (.bak, .backup)</div>
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
                <h3 className="text-lg font-bold text-purple-300 mb-2">Configuration</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm text-gray-300 mb-1">Particle Density</label>
                    <input type="range" min="50" max="500" defaultValue="100" className="w-full" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-300 mb-1">Processing Priority</label>
                    <select className="w-full p-2 bg-gray-800 text-white rounded">
                      <option>Balanced</option>
                      <option>Speed</option>
                      <option>Accuracy</option>
                      <option>Efficiency</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="border border-purple-600 rounded-lg p-4">
                <h3 className="text-lg font-bold text-purple-300 mb-2">System Information</h3>
                <div className="text-sm space-y-1">
                  <div>Version: 1.0.0</div>
                  <div>Build: 20241204</div>
                  <div>Architecture: Integrated META-LOGIC</div>
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
        {/* Header */}
        <header className="bg-black bg-opacity-80 border-b-2 border-purple-500 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Activity className="text-purple-400" size={32} />
              <div>
                <h1 className="text-2xl font-bold text-purple-300">MachineGod System</h1>
                <p className="text-sm text-gray-400">
                  META-LOGIC • ARIEL • WARP • HELIX Integration Platform
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-400">System Status</div>
              <div className="text-green-400 font-bold">
                {systemStatus.metaLogic.active ? 'OPERATIONAL' : 'INITIALIZING'}
              </div>
            </div>
          </div>
        </header>

        {/* Tab Navigation */}
        <nav className="bg-black bg-opacity-80 border-b border-purple-600">
          <div className="flex space-x-1 p-2">
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
              </button>
            ))}
          </div>
        </nav>

        {/* Main Content Area */}
        <main className="flex-1 p-4">
          {renderTabContent()}
        </main>

        {/* Footer */}
        <footer className="bg-black bg-opacity-80 border-t border-purple-600 p-3">
          <div className="flex justify-between items-center text-sm text-gray-400">
            <div>
              MachineGod v1.0.0 - Integrated Artificial General Intelligence System
            </div>
            <div className="flex space-x-4">
              <span>Uptime: {new Date().toLocaleTimeString()}</span>
              <span>•</span>
              <span>Operations: {systemStatus.metaLogic.evaluationsCount + systemStatus.ariel.debateCount}</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;