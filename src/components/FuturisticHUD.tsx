import React from 'react';
import { 
  Activity, Brain, Users, Zap, Archive, Database, 
  BarChart2, Cpu, Shield, Layers, Sparkles, Search,
  MessageSquare, Crown, Terminal
} from 'lucide-react';

interface HUDPanelProps {
  title: string;
  icon: React.ReactNode;
  metrics: {
    label: string;
    value: number | string;
    max?: number;
    color?: string;
  }[];
  active?: boolean;
}

export const HUDPanel: React.FC<HUDPanelProps> = ({ 
  title, 
  icon, 
  metrics, 
  active = true 
}) => {
  return (
    <div className={`bg-black bg-opacity-80 border ${active ? 'border-cyan-500' : 'border-gray-700'} rounded-lg p-3 relative overflow-hidden`}>
      {/* Background grid effect */}
      <div className="absolute inset-0 grid grid-cols-10 grid-rows-10 opacity-10 pointer-events-none">
        {Array.from({ length: 100 }).map((_, i) => (
          <div 
            key={i} 
            className="border-[0.5px] border-cyan-500"
          />
        ))}
      </div>
      
      {/* Header */}
      <div className="flex items-center justify-between mb-2 relative z-10">
        <div className="flex items-center space-x-2">
          <div className={`${active ? 'text-cyan-400' : 'text-gray-500'}`}>
            {icon}
          </div>
          <h3 className={`text-sm font-bold ${active ? 'text-cyan-300' : 'text-gray-500'}`}>
            {title}
          </h3>
        </div>
        <div className={`h-2 w-2 rounded-full ${active ? 'bg-cyan-400' : 'bg-gray-600'}`}></div>
      </div>
      
      {/* Metrics */}
      <div className="space-y-2 relative z-10">
        {metrics.map((metric, index) => (
          <div key={index} className="text-xs">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">{metric.label}</span>
              <span className={metric.color || (active ? 'text-cyan-300' : 'text-gray-500')}>
                {typeof metric.value === 'number' && metric.max 
                  ? `${(metric.value * 100).toFixed(0)}%` 
                  : metric.value}
              </span>
            </div>
            
            {/* Progress bar for numeric values with max */}
            {typeof metric.value === 'number' && metric.max && (
              <div className="w-full bg-gray-800 rounded-full h-1 mt-1">
                <div 
                  className={`h-1 rounded-full ${metric.color ? metric.color : 'bg-cyan-500'}`}
                  style={{ width: `${(metric.value / metric.max) * 100}%` }}
                ></div>
              </div>
            )}
          </div>
        ))}
      </div>
      
      {/* Decorative corner elements */}
      <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-cyan-500 opacity-70"></div>
      <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-cyan-500 opacity-70"></div>
      <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-cyan-500 opacity-70"></div>
      <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-cyan-500 opacity-70"></div>
    </div>
  );
};

interface FuturisticHUDProps {
  systemStatus: any;
  activeMode: 'normal' | 'deep-search' | 'conversation' | 'god-mode';
  onModeChange: (mode: 'normal' | 'deep-search' | 'conversation' | 'god-mode') => void;
}

export const FuturisticHUD: React.FC<FuturisticHUDProps> = ({
  systemStatus,
  activeMode,
  onModeChange
}) => {
  return (
    <div className="w-full">
      {/* Mode Tabs */}
      <div className="flex space-x-1 p-2 bg-black bg-opacity-80 border-b border-purple-600 rounded-t-lg">
        <button
          onClick={() => onModeChange('normal')}
          className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-sm ${
            activeMode === 'normal' 
              ? 'bg-purple-600 text-white' 
              : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
          }`}
        >
          <Terminal size={14} />
          <span>Normal</span>
        </button>
        
        <button
          onClick={() => onModeChange('deep-search')}
          className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-sm ${
            activeMode === 'deep-search' 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
          }`}
        >
          <Search size={14} />
          <span>Deep Search</span>
        </button>
        
        <button
          onClick={() => onModeChange('conversation')}
          className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-sm ${
            activeMode === 'conversation' 
              ? 'bg-green-600 text-white' 
              : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
          }`}
        >
          <MessageSquare size={14} />
          <span>Talk to Conversation</span>
        </button>
        
        <button
          onClick={() => onModeChange('god-mode')}
          className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-sm ${
            activeMode === 'god-mode' 
              ? 'bg-yellow-600 text-white' 
              : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
          }`}
        >
          <Crown size={14} />
          <span>God Mode</span>
        </button>
      </div>
      
      {/* HUD Panels */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-2 p-2 bg-black bg-opacity-80 border-b border-purple-600">
        <HUDPanel
          title="META-LOGIC"
          icon={<Brain size={16} />}
          active={systemStatus.metaLogic.active}
          metrics={[
            { label: "Evaluations", value: systemStatus.metaLogic.evaluationsCount },
            { label: "Paradoxes", value: systemStatus.metaLogic.paradoxCount },
            { label: "Coherence", value: 0.85, max: 1, color: "text-green-400" }
          ]}
        />
        
        <HUDPanel
          title="ARIEL SYSTEM"
          icon={<Users size={16} />}
          active={systemStatus.ariel.active}
          metrics={[
            { label: "Agents", value: systemStatus.ariel.agentCount },
            { label: "Debates", value: systemStatus.ariel.debateCount },
            { label: "Team Morale", value: systemStatus.ariel.teamMorale, max: 1, color: "text-blue-400" }
          ]}
        />
        
        <HUDPanel
          title="WARP SYSTEM"
          icon={<Zap size={16} />}
          active={systemStatus.warp.active}
          metrics={[
            { label: "Phase", value: systemStatus.warp.currentPhase },
            { label: "Teams", value: systemStatus.warp.teamCount },
            { label: "Efficiency", value: systemStatus.warp.efficiency, max: 1, color: "text-yellow-400" }
          ]}
        />
        
        <HUDPanel
          title="HELIX SYSTEM"
          icon={<Archive size={16} />}
          active={systemStatus.helix.active}
          metrics={[
            { label: "Compressions", value: systemStatus.helix.totalCompressions },
            { label: "Ratio", value: systemStatus.helix.averageRatio, max: 1, color: "text-purple-400" },
            { label: "Space Saved", value: `${Math.round(systemStatus.helix.spaceSaved / 1024)}KB` }
          ]}
        />
        
        <HUDPanel
          title="TNLP SYSTEM"
          icon={<Cpu size={16} />}
          active={true}
          metrics={[
            { label: "Phase", value: "Independent" },
            { label: "Iterations", value: 256 },
            { label: "Quantum Ent", value: 0.85, max: 1, color: "text-pink-400" }
          ]}
        />
      </div>
      
      {/* Status Bar */}
      <div className="flex-shrink-0 border-t border-purple-800 p-2 bg-black bg-opacity-80 text-xs text-gray-400 flex justify-between rounded-b-lg">
        <div className="flex items-center">
          <Brain size={12} className="text-purple-400 mr-1" />
          <span>Quantum Core Active</span>
        </div>
        
        <div className="flex items-center">
          <Zap size={12} className="text-yellow-400 mr-1" />
          <span>WARP Phase {systemStatus?.warp.currentPhase || 1}</span>
        </div>
        
        <div className="flex items-center">
          <Shield size={12} className="text-blue-400 mr-1" />
          <span>Truth Protocol Active</span>
        </div>
        
        <div className="flex items-center">
          <Sparkles size={12} className="text-green-400 mr-1" />
          <span>Natural Learning: {systemStatus?.naturalLearning.totalAssets || 0} assets</span>
        </div>
      </div>
    </div>
  );
};